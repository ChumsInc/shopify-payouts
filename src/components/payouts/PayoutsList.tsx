import {useEffect, useState} from 'react';
import {selectCurrentPayout, selectPayoutsStatus, selectSort, selectSortedList, setSort} from "@/ducks/payouts";
import numeral from "numeral";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import type {SortProps} from "chums-types";
import Decimal from "decimal.js";
import {loadTransactions} from "@/ducks/transactions/transactionsSlice.ts";
import {Button, Fade, ProgressBar} from "react-bootstrap";
import {SortableTable, type SortableTableField, TablePagination} from "@chumsinc/sortable-tables";
import {loadPayouts} from "@/ducks/payouts/actions";
import type {ShopifyPaymentsPayout} from "@/ducks/types.ts";
import dayjs from "dayjs";

const fields: SortableTableField<ShopifyPaymentsPayout>[] = [
    {field: 'issuedAt', title: 'Date', render: (row) => dayjs(row.issuedAt).format('MM/DD/YYYY')},
    {field: 'status', title: 'Status'},
    {
        field: 'net',
        title: 'Amount',
        className: 'text-end',
        render: (row) => numeral(row.net.amount).format('$0,0.00')
    },
    {field: 'net', title: 'Currency', render: row => row.net.currencyCode},
];

export default function PayoutsList() {
    const dispatch = useAppDispatch();
    const list = useAppSelector(selectSortedList);
    const current = useAppSelector(selectCurrentPayout);
    const status = useAppSelector(selectPayoutsStatus);
    const sort = useAppSelector(selectSort);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(loadPayouts());
    }, []);

    useEffect(() => {
        setPage(0)
    }, [list, rowsPerPage]);


    const onClickReload = () => dispatch(loadPayouts());
    const onSelectPayout = (payout: ShopifyPaymentsPayout) => dispatch(loadTransactions(payout.legacyResourceId));
    const onChangeSort = (sort: SortProps<ShopifyPaymentsPayout>) => dispatch(setSort(sort));

    const payoutsTotal = list.reduce((pv, cv) => pv.add(cv.net.amount), new Decimal(0));

    const tfoot = (
        <tfoot>
        <tr>
            <th colSpan={2}>Total</th>
            <td className="text-end">{numeral(payoutsTotal.toString()).format('$0,0.00')}</td>
            <td>USD</td>
        </tr>
        </tfoot>
    )
    return (
        <>
            <div className="row mb-1">
                <div className="col-auto">
                    <Button variant="primary" onClick={onClickReload} size="sm">
                        Reload Payouts
                    </Button>
                </div>
            </div>
            <Fade in={status === 'loading' || status === 'saving'}>
                <ProgressBar animated striped now={100} label={`${status}...`}/>
            </Fade>

            <SortableTable fields={fields} data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           selected={current?.id || 0}
                           onSelectRow={onSelectPayout}
                           currentSort={sort}
                           onChangeSort={onChangeSort}
                           keyField="id"
                           tfoot={tfoot}/>
            <TablePagination page={page} onChangePage={page => setPage(page)}
                             rowsPerPage={rowsPerPage}
                             rowsPerPageProps={{onChange: (rpp) => setRowsPerPage(rpp)}}
                             size="sm" count={list.length}/>
        </>
    );
}
