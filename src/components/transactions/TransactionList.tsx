import {Fragment, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import type {SortProps} from "chums-types";
import classNames from "classnames";
import {SortableTable, TablePagination} from "@chumsinc/sortable-tables";
import type {PayoutBalanceTransactionRow, TransactionsTotal} from "@/ducks/types.ts";
import {
    selectSort,
    selectSortedTransactionList,
    selectTransactionsStatus,
    setSort
} from "@/ducks/transactions/transactionsSlice.ts";
import {Alert, Fade, ProgressBar} from "react-bootstrap";
import {totalReducer} from "@/ducks/transactions/utils.ts";
import TransactionListBar from "@/components/transactions/TransactionListBar.tsx";
import {transactionListFields} from "@/components/transactions/transactionListFields.tsx";
import TransactionListFooter from "@/components/transactions/TransactionListFooter.tsx";
import type {PayoutBalanceTransaction} from "chums-types/shopify";


const rowClassName = (row: PayoutBalanceTransaction) => {
    return classNames({
        'table-warning': row.type === 'CHARGE' && !row.invoiceNo && !row.status.refunded,
        'text-danger': row.type === 'REFUND' || row.status.refunded,
        'text-info': row.type === 'adjustment',
    })
};

const countMissingInvoices = (list: PayoutBalanceTransaction[]) => {
    return list.filter(tx => tx.type === 'CHARGE' && !tx.invoiceNo && !tx.status.refunded).length;
}

const TransactionList = () => {
    const dispatch = useAppDispatch();
    const sort = useAppSelector(selectSort);
    const loading = useAppSelector(selectTransactionsStatus);
    const list = useAppSelector(selectSortedTransactionList);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selected, setSelected] = useState<PayoutBalanceTransactionRow | null>(null);
    const [total, setTotal] = useState<TransactionsTotal>(totalReducer(list));
    const [refunded, setRefunded] = useState<TransactionsTotal>(totalReducer(list.filter(tx => tx.type === 'REFUND')));
    const [missingInvoices, setMissingInvoices] = useState(countMissingInvoices(list));

    useEffect(() => {
        setPage(0);
        setTotal(totalReducer(list));
        setRefunded(totalReducer(list.filter(tx => tx.type === 'REFUND')));
        setMissingInvoices(countMissingInvoices(list));
    }, [list]);

    const onSelect = (row: PayoutBalanceTransactionRow) => {
        setSelected(row || null);
    }

    const sortChangeHandler = (sort: SortProps<PayoutBalanceTransactionRow>) => {
        dispatch(setSort(sort));
    }

    const rowsPerPageChangeHandler = (rpp: number) => {
        setRowsPerPage(rpp);
        setPage(0);
    }

    return (
        <Fragment>
            <TransactionListBar/>
            <Fade in={loading === 'loading'}>
                <ProgressBar striped animated now={100} className="mb-1" label="Loading..."/>
            </Fade>

            {!!missingInvoices && (
                <Alert variant="warning" title="Open Orders:">
                    There {missingInvoices === 1 ? 'is' : 'are'} {missingInvoices} open
                    {' '}order{missingInvoices === 1 ? '' : 's'}.
                </Alert>
            )}
            <SortableTable keyField="id" fields={transactionListFields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           rowClassName={rowClassName}
                           currentSort={sort}
                           onChangeSort={sortChangeHandler}
                           selected={selected?.id} onSelectRow={onSelect}
                           tfoot={
                               <TransactionListFooter total={total} refunded={refunded}
                                                      showEllipsis={list.length > rowsPerPage}/>
                           }/>
            <TablePagination page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: rowsPerPageChangeHandler}}
                             count={list.length} showFirst showLast size="sm"/>
        </Fragment>
    );
}

export default TransactionList;
