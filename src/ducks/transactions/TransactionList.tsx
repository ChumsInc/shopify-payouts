import React, {ChangeEvent, Fragment, useState} from 'react';
import {useSelector} from 'react-redux';
import SalesOrderLink from "../../components/SalesOrderLink";
import InvoiceLink from "../../components/InvoiceLink";
import ShopifyLink from "../../components/ShopifyLink";
import {
    loadTransactions,
    selectPage,
    selectRowsPerPage,
    selectSort,
    selectSortedTransactionList,
    selectTransactionsLoading,
    setPage,
    setRowsPerPage,
    setSort
} from "./index";
import {Alert, FormCheck, SortableTable, SortableTableField, SpinnerButton, TablePagination,} from 'chums-components';
import {markPayoutComplete, selectCurrentPayout} from "../payouts";
import numeral from "numeral";
import ShopifyOrderStatus from "../../components/ShopifyOrderStatus";
import {TransactionTableFields} from "../types";
import {useAppDispatch} from "../../app/configureStore";
import {ShopifyPaymentTransaction, SortProps} from "chums-types";
import classNames from "classnames";
import Decimal from "decimal.js";

const fields: SortableTableField<TransactionTableFields>[] = [
    {field: 'type', title: 'Type', sortable: true},
    {
        field: 'id',
        title: 'Shopify Order #',
        render: row => (<ShopifyLink id={row.order?.id ?? null} name={row.order?.shopify_order?.name ?? null}/>),
        sortable: true
    },
    {
        field: 'sage_SalesOrderNo',
        title: 'Sage SO #',
        render: row => <SalesOrderLink sage_SalesOrderNo={row.order?.sage_SalesOrderNo}
                                       sage_Company={row.order?.sage_Company}/>,
        sortable: true
    },
    {
        field: 'InvoiceNo',
        title: 'Invoice #',
        render: row => <InvoiceLink invoiceNo={row.order?.InvoiceNo} sage_Company={row.order?.sage_Company}/>,
        sortable: true
    },
    {
        field: 'email',
        title: 'Email',
        render: row => row.order?.shopify_order?.email ?? null,
        sortable: true
    },
    {
        field: 'BillToName',
        title: 'Name',
        render: row => row.order?.BillToName,
        sortable: true
    },
    {
        field: 'fulfillment_status', title: 'Status',
        render: (row) => (<ShopifyOrderStatus fulfillment_status={row.order?.shopify_order?.fulfillment_status}
                                              tags={row.order?.shopify_order?.tags}
                                              total_discounts={row.order?.shopify_order?.total_discounts}/>)
    },
    {field: 'amount', title: 'Amount', className: 'text-end', sortable: true},
    {field: 'fee', title: 'Fee', className: 'text-end', sortable: true},
    {field: 'net', title: 'Net', className: 'text-end', sortable: true},
];

const rowClassName = (row: ShopifyPaymentTransaction) => {
    return classNames({
        'table-warning': row.type !== 'payout' && !row.order?.InvoiceNo,
        'text-danger': row.type === 'refund',
        'text-info': row.type === 'adjustment',
    })
};

const TransactionList: React.FC = () => {
    const dispatch = useAppDispatch();

    const selectedPayout = useSelector(selectCurrentPayout);
    const sort = useSelector(selectSort);
    const loading = useSelector(selectTransactionsLoading);
    const list = useSelector(selectSortedTransactionList);
    const page = useSelector(selectPage);
    const rowsPerPage = useSelector(selectRowsPerPage);
    const [selected, setSelected] = useState<ShopifyPaymentTransaction | null>(null);
    const [completed, setCompleted] = useState(false);

    interface TransactionsTotal {
        amount: number|string;
        fee: number|string;
        net: number|string;
    }
    const total = list
        .filter(row => row.type !== 'payout')
        .reduce((total:TransactionsTotal, row) => {
        return {
            amount: new Decimal(total.amount).add(row.amount ?? 0).toString(),
            fee: new Decimal(total.fee).add(row.fee ?? 0).toString(),
            net: new Decimal(total.net).add(row.net ?? 0).toString(),
        }
    }, {
        amount: 0,
        fee: 0,
        net: 0,
    });

    const missingInvoices = list.filter(tx => tx.type !== 'payout').filter(tx => !tx.order || !tx.order?.InvoiceNo).length;

    const onReloadTransactions = () => {
        if (!selectedPayout) {
            return;
        }
        dispatch(loadTransactions(selectedPayout.id));
    }
    const onClickCompleted = (ev:ChangeEvent<HTMLInputElement>) => {
        setCompleted(ev.target.checked);
    }

    const onComplete = () => {
        if (!completed || !selectedPayout) {
            return;
        }
        dispatch(markPayoutComplete(selectedPayout?.id));
    }

    const onSelect = (row: ShopifyPaymentTransaction) => {
        setSelected(row || null);
    }

    const sortChangeHandler = (sort: SortProps) => {
        dispatch(setSort(sort));
    }
    const pageChangeHandler = (page: number) => dispatch(setPage(page));
    const rowsPerPageChangeHandler = (rpp: number) => dispatch(setRowsPerPage(rpp));

    const tfoot = (
        <tfoot>
        {list.length > rowsPerPage && (
            <tr>
                <td colSpan={10}>...</td>
            </tr>
        )}
        <tr>
            <td colSpan={7}>Total for {list.length} orders</td>
            <td className="text-end">{numeral(total.amount).format('$0,0.00')}</td>
            <td className="text-end">{numeral(total.fee).format('$0,0.00')}</td>
            <td className="text-end">{numeral(total.net).format('$0,0.00')}</td>
        </tr>
        </tfoot>
    )

    return (
        <Fragment>
            <div className="d-flex justify-content-between mb-1">
                <SpinnerButton spinning={loading} className="btn btn-sm btn-secondary"
                               onClick={onReloadTransactions} disabled={!selectedPayout}>
                    Reload Transactions
                </SpinnerButton>

                <div className="row g-3">
                    <div className="col-auto">
                        <FormCheck label="Mark Complete" checked={completed} onChange={onClickCompleted}
                                   type="checkbox"/>
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-sm btn-success" onClick={onComplete}
                                disabled={!selectedPayout || loading || !completed}>
                            Save
                        </button>
                    </div>
                </div>
            </div>

            {!!missingInvoices && (
                <Alert color="warning" title="Open Orders:">
                    There {missingInvoices === 1 ? 'is' : 'are'} {missingInvoices} open
                    {' '}order{missingInvoices === 1 ? '' : 's'}.
                </Alert>
            )}
            <SortableTable keyField="id" fields={fields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           rowClassName={rowClassName}
                           currentSort={sort}
                           onChangeSort={sortChangeHandler}
                           selected={selected?.id} onSelectRow={onSelect} tfoot={tfoot}/>
            <TablePagination page={page} onChangePage={pageChangeHandler}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={rowsPerPageChangeHandler}
                             count={list.length} showFirst showLast bsSize="sm"/>
        </Fragment>
    );
}

export default TransactionList;
