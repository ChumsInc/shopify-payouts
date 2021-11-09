import React from "react";
import {useSelector} from "react-redux";
import {selectCashApplied, selectCashAppliedTotal} from "./selectors";
import numeral from "numeral";

const PayPalOrdersFooter:React.FC = () => {
    const total = useSelector(selectCashAppliedTotal);
    const cashApplied = useSelector(selectCashApplied);
    return (
        <tfoot>
        <tr>
            <th>Total</th>
            <td colSpan={6} />
            <th>{numeral(cashApplied.length).format('0,0')}</th>
            <th className="text-end">{numeral(total).format('$0,0.00')}</th>
        </tr>
        </tfoot>
    )
}
export default PayPalOrdersFooter;
