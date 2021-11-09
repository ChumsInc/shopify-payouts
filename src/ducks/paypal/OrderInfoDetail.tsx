import React from "react";
import {useSelector} from "react-redux";
import {selectSelectedOrder} from "./selectors";

const OrderInfoDetail: React.FC = () => {
    const selected = useSelector(selectSelectedOrder);
    if (!selected) {
        return null;
    }

    const footerData = [
        {id: 'items_total', name: 'Item Subtotal', price: selected.total_line_items_price},
        {id: 'discount', name: 'Discount', price: selected.total_discounts},
        {id: 'subtotal', name: 'Subtotal', price: selected.subtotal_price},
        {
            id: 'shipping',
            name: 'Shipping: ' + selected.shipping_lines.map(row => row.title).join(', '),
            price: selected.total_shipping_price_set.shop_money.amount
        },
        selected.tax_lines.map(tax => {
            return {
                id: tax.title,
                name: tax.title,
                price: tax.price_set.shop_money.amount
            };
        }),
        {id: 'total', name: 'Total', price: selected.total_price},
    ];

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
            {selected.line_items.map(line => (
                <tr key={line.id}>
                    <td>{line.sku}</td>
                    <td>{line.name}</td>
                    <td className="text-end">{line.quantity}</td>
                    <td className="text-end">{line.price_set.shop_money.amount}</td>
                </tr>
            ))}
            </tbody>
            <tfoot>
            <tr>
                <td>&nbsp;</td>
                <th>Items Subtotal</th>
                <td colSpan={2} className="text-end">{selected.total_line_items_price}</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <th>Discount</th>
                <td colSpan={2} className="text-end">{selected.total_discounts}</td>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <th>Subtotal</th>
                <td colSpan={2} className="text-end">{selected.subtotal_price}</td>
            </tr>
            {selected.tax_lines.map((tax, index) => (
                <tr key={index}>
                    <td>&nbsp;</td>
                    <th>{tax.title}</th>
                    <td colSpan={2} className="text-end">{tax.price_set.shop_money.amount}</td>
                </tr>
            ))}
            {selected.shipping_lines.map((ship, index) => (
                <tr key={index}>
                    <td>&nbsp;</td>
                    <th>{ship.title}</th>
                    <td colSpan={2} className="text-end">{ship.price_set.shop_money.amount}</td>
                </tr>
            ))}
            <tr>
                <td>&nbsp;</td>
                <th>Total</th>
                <td colSpan={2} className="text-end">{selected.total_price}</td>
            </tr>
            </tfoot>
        </table>
    )
}

export default OrderInfoDetail;
