import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import SalesOrderLink from "../../components/SalesOrderLink";
import InvoiceLink from "../../components/InvoiceLink";
import ShopifyLink from "../../components/ShopifyLink";
import {
    defaultTransactionSort,
    fetchTransactionsAction,
    selectSortedTransactionList,
    selectTransactionsLoading
} from "./index";
import {
    addPageSetAction,
    Alert,
    ErrorBoundary,
    FormCheck,
    PagerDuck,
    selectPagedData,
    selectTableSort,
    SortableTable,
    SpinnerButton,
    tableAddedAction
} from 'chums-ducks';
import {ShopifyTransaction, ShopifyTransactionSortProps, ShopifyTransactionTableField} from "../common-types";
import {markPayoutCompletedAction} from "../payouts/actions";
import {selectSelectedPayout} from "../payouts";
import numeral from "numeral";
import ShopifyOrderStatus from "../../components/ShopifyOrderStatus";

const fields: ShopifyTransactionTableField[] = [
    {field: 'type', title: 'Type', sortable: true},
    {field: 'source_id', title: 'Shopify Order #', render: row => (<ShopifyLink {...row.order}/>), sortable: true},
    {
        field: 'SalesOrderNo',
        title: 'Sage SO #',
        render: row => <SalesOrderLink {...row.order}/>,
        sortable: true
    },
    {field: 'invoice', title: 'Invoice #', render: row => <InvoiceLink {...row.order} />, sortable: true},
    {
        field: 'customer',
        title: 'Customer #',
        render: row => [row.order.ARDivisionNo, row.order.CustomerNo].join('-'),
        sortable: true
    },
    {
        field: 'name',
        title: 'Name',
        render: row => row.order.BillToName,
        sortable: true
    },
    {field: 'payout_status', title: 'Status', render: (row) => (<ShopifyOrderStatus {...row.order} />)},
    {field: 'amount', title: 'Amount', className: 'text-end', sortable: true},
    {field: 'fee', title: 'Fee', className: 'text-end', sortable: true},
    {field: 'net', title: 'Net', className: 'text-end', sortable: true},
];

const rowClassName = (row: ShopifyTransaction) => {
    switch (row.type) {
    case 'refund':
        return 'table-warning';
    case 'adjustment':
        return 'table-info';
    default:
        return ''
    }
};

const tableId = 'shopify-transactions-list';

const TransactionList: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(addPageSetAction({key: tableId, rowsPerPage: 10}));
        dispatch(tableAddedAction({key: tableId, ...defaultTransactionSort}));
    }, []);

    const selectedPayout = useSelector(selectSelectedPayout);
    const sort = useSelector(selectTableSort(tableId));
    const loading = useSelector(selectTransactionsLoading);
    const list = useSelector(selectSortedTransactionList(sort as ShopifyTransactionSortProps));
    const pagedList = useSelector(selectPagedData(tableId, list));
    const [selected, setSelected] = useState(null as ShopifyTransaction | null);
    const [completed, setCompleted] = useState(false);

    const total = list.reduce((total, row) => {
        return {
            amount: total.amount + Number(row.amount),
            fee: total.fee + Number(row.fee),
            net: total.net + Number(row.net),
        }
    }, {
        amount: 0,
        fee: 0,
        net: 0,
    })

    const missingInvoices = list.filter(tx => tx.type !== 'payout').filter(tx => !tx.order || !tx.order?.InvoiceNo).length;

    const onReloadTransactions = () => {
        if (!selectedPayout) {
            return;
        }
        dispatch(fetchTransactionsAction(selectedPayout.id));
    }
    const onClickCompleted = () => {
        setCompleted(!completed);
    }

    const onComplete = () => {
        if (!completed) {
            return;
        }
        dispatch(markPayoutCompletedAction());
    }

    const onSelect = (row: ShopifyTransaction) => {
        setSelected(row || null);
    }

    const tfoot = (
        <tfoot>
        {pagedList.length < list.length && (
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
                        <FormCheck label="Mark Complete" checked={completed} onClick={onClickCompleted}
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
            <ErrorBoundary>
                <SortableTable tableKey={tableId} keyField="id" fields={fields} data={pagedList}
                               rowClassName={rowClassName}
                               selected={selected?.id} onSelectRow={onSelect} tfoot={tfoot}/>
            </ErrorBoundary>
            <ErrorBoundary>
                <PagerDuck pageKey={tableId} dataLength={list.length}/>
            </ErrorBoundary>
        </Fragment>
    );
}

export default TransactionList;
