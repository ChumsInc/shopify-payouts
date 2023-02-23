import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {
    loadPayouts,
    selectCurrentPayout,
    selectPage,
    selectPayoutsLoading,
    selectRowsPerPage,
    selectSort,
    selectSortedList,
    setPage,
    setRowsPerPage,
    setSort
} from "./index";
import {SortableTable, SortableTableField, SpinnerButton, TablePagination} from "chums-components";
import numeral from "numeral";
import {useAppDispatch} from "../../app/configureStore";
import {ShopifyPayment, SortProps} from "chums-types";
import Decimal from "decimal.js";
import {loadTransactions} from "../transactions";

const fields: SortableTableField<ShopifyPayment>[] = [
    {field: 'date', title: 'Date'},
    {field: 'status', title: 'Status'},
    {
        field: 'amount',
        title: 'Amount',
        className: 'text-end',
        render: (row: ShopifyPayment) => numeral(row.amount).format('$0,0.00')
    },
    {field: 'currency', title: 'Currency'},
];

const PayoutsList: React.FC = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectSortedList);
    const page = useSelector(selectPage);
    const rowsPerPage = useSelector(selectRowsPerPage);
    const selected = useSelector(selectCurrentPayout);
    const loading = useSelector(selectPayoutsLoading)
    const sort = useSelector(selectSort);

    useEffect(() => {
        dispatch(loadPayouts());
    }, []);

    const onClickReload = () => dispatch(loadPayouts());
    const onSelectPayout = (payout: ShopifyPayment) => dispatch(loadTransactions(payout.id));
    const onChangeSort = (sort: SortProps) => dispatch(setSort(sort));

    const payoutsTotal = list.reduce((pv, cv) => pv.add(cv.amount), new Decimal(0));

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
                    <SpinnerButton spinning={loading}
                                   onClick={onClickReload} size="sm" color="primary">
                        Reload Payouts
                    </SpinnerButton>
                </div>
            </div>
            <SortableTable fields={fields} data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           selected={selected?.id || 0}
                           onSelectRow={onSelectPayout}
                           currentSort={sort}
                           onChangeSort={onChangeSort}
                           keyField="id"
                           tfoot={tfoot}/>
            <TablePagination page={page} onChangePage={page => dispatch(setPage(page))}
                             rowsPerPage={rowsPerPage}
                             onChangeRowsPerPage={(rpp) => dispatch(setRowsPerPage(rpp))}
                             bsSize="sm" count={list.length}/>
        </>
    );
}

export default PayoutsList;
