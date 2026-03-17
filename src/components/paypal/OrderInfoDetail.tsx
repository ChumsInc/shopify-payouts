import {useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentOrder} from "@/ducks/paypal/paypalSlice.ts";
import LegacyOrderInfoDetail from "@/components/paypal/LegacyOrderInfoDetail.tsx";

export default function OrderInfoDetail() {
    const current = useAppSelector(selectCurrentOrder);
    if (!current) {
        return null;
    }
    if (!current.graphqlOrder) {
        return (
            <LegacyOrderInfoDetail />
        )
    }

    return (
        <table className="table table-xs table-hover">
            <thead>
            <tr>
                <th>SKU</th>
                <th>Description</th>
                <th className="text-end">Quantity</th>
                <th className="text-end">Price</th>
            </tr>
            </thead>
            <tbody>
            {current.graphqlOrder.lineItems.nodes.map(line => (
                <tr key={line.id}>
                    <td>{line.sku}</td>
                    <td>{line.name}</td>
                    <td className="text-end">{line.quantity}</td>
                    <td className="text-end">{line.originalTotalSet.shopMoney.amount}</td>
                </tr>
            ))}
            </tbody>
            <tfoot>
            <tr>
                <td>&nbsp;</td>
                <th>Discount</th>
                <td colSpan={2} className="text-end">{current.graphqlOrder.totalDiscountsSet?.shopMoney.amount}</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <th>Subtotal</th>
                <td colSpan={2} className="text-end">{current.graphqlOrder.currentSubtotalPriceSet.shopMoney.amount}</td>
            </tr>
            {current.graphqlOrder.taxLines.map((tax, index) => (
                <tr key={index}>
                    <td>&nbsp;</td>
                    <th>{tax.title}</th>
                    <td colSpan={2} className="text-end">{tax.priceSet.shopMoney.amount}</td>
                </tr>
            ))}
            {current.graphqlOrder.shippingLines.nodes.map((ship, index: number) => (
                <tr key={index}>
                    <td>&nbsp;</td>
                    <th>{ship.code}</th>
                    <td colSpan={2} className="text-end">{ship.discountedPriceSet.shopMoney.amount}</td>
                </tr>
            ))}
            <tr>
                <td>&nbsp;</td>
                <th>Total</th>
                <td colSpan={2} className="text-end">{current.graphqlOrder.currentTotalPriceSet.shopMoney.amount}</td>
            </tr>
            </tfoot>
        </table>
    )
}
