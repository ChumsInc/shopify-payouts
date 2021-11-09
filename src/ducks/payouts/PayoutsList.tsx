import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPayoutsAction, selectPayoutAction} from './actions';

import {selectPayoutsList, selectPayoutsLoading, selectSelectedPayout} from "./index";
import {SortableTable, SpinnerButton} from "chums-ducks";
import {ShopifyPayout, ShopifyPayoutTableField} from "../common-types";
import numeral from "numeral";

const fields: ShopifyPayoutTableField[] = [
    {field: 'date', title: 'Date'},
    {field: 'status', title: 'Status'},
    {
        field: 'amount',
        title: 'Amount',
        className: 'text-end',
        render: (row: ShopifyPayout) => numeral(row.amount).format('$0,0.00')
    },
    {field: 'currency', title: 'Currency'},
];

const PayoutsList: React.FC = () => {
    const dispatch = useDispatch();
    const list = useSelector(selectPayoutsList);
    const selected = useSelector(selectSelectedPayout);
    const loading = useSelector(selectPayoutsLoading)

    useEffect(() => {
        dispatch(fetchPayoutsAction());
    }, []);

    const onClickReload = () => dispatch(fetchPayoutsAction());
    const onSelectPayout = (payout: ShopifyPayout) => dispatch(selectPayoutAction(payout));

    const payoutsTotal = list.map(pay => Number(pay.amount)).reduce((pv, cv) => pv + cv, 0);

    const tfoot = (
        <tfoot>
        <tr>
            <th colSpan={2}>Total</th>
            <td className="text-end">{numeral(payoutsTotal).format('$0,0.00')}</td>
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
            <SortableTable fields={fields} data={list} selected={selected?.id || 0} onSelectRow={onSelectPayout}
                           keyField="id" tableKey="shopify-payouts-list"
                           tfoot={tfoot}/>
        </>
    );
}

export default PayoutsList;
