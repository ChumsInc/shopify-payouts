import numeral from "numeral";
import type {TransactionsTotal} from "@/ducks/types.ts";

export interface TransactionListFooterProps {
    refunded: TransactionsTotal;
    total: TransactionsTotal;
    showEllipsis?: boolean;
}
export default function TransactionListFooter({refunded, total, showEllipsis}: TransactionListFooterProps) {
    return (
        <tfoot>
        {showEllipsis && (
            <tr>
                <td colSpan={11}>...</td>
            </tr>
        )}
        {refunded.count > 0 && (<tr className="text-danger">
                <td colSpan={8}>Refunded ({refunded.count})</td>
                <td className="text-end">{numeral(refunded.amount).format('$0,0.00')}</td>
                <td className="text-end">{numeral(refunded.fee).format('$0,0.00')}</td>
                <td className="text-end">{numeral(refunded.net).format('$0,0.00')}</td>
            </tr>
        )}
        <tr>
            <td colSpan={8}>Total for {total.count} orders</td>
            <td className="text-end">{numeral(total.amount).format('$0,0.00')}</td>
            <td className="text-end">{numeral(total.fee).format('$0,0.00')}</td>
            <td className="text-end">{numeral(total.net).format('$0,0.00')}</td>
        </tr>
        </tfoot>
    )
}
