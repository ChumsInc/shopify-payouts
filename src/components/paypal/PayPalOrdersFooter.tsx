import React from "react";
import {selectCashAppliedCount, selectCashAppliedTotal} from "@/ducks/paypal/paypalSlice.ts";
import numeral from "numeral";
import {useAppSelector} from "@/app/configureStore.ts";

const PayPalOrdersFooter: React.FC = () => {
    const total = useAppSelector(selectCashAppliedTotal);
    const cashApplied = useAppSelector(selectCashAppliedCount);
    return (
        <tfoot>
        <tr>
            <th>Total</th>
            <td colSpan={6}/>
            <th>{numeral(cashApplied).format('0,0')}</th>
            <th className="text-end">{numeral(total).format('$0,0.00')}</th>
        </tr>
        </tfoot>
    )
}
export default PayPalOrdersFooter;
