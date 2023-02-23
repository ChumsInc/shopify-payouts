import React from 'react';
import {useSelector} from 'react-redux';
import {selectCurrentOrder} from "./selectors";
import OrderInfoDetail from "./OrderInfoDetail";
import {Alert} from "chums-components";
import {format, parseJSON} from "date-fns";

// const detailFields = [
//     {field: 'sku', title: 'SKU'},
//     {field: 'name', title: 'Description'},
//     {field: 'quantity', title: 'Quantity', className: 'right'},
//     {field: 'price', title: 'Price', className: 'right'},
// ];

const OrderInfo = () => {
    const selected = useSelector(selectCurrentOrder);
    if (!selected || !selected.shopify_order) {
        return null;
    }
    const {
        import_status,
        sage_SalesOrderNo,
        import_result
    } = selected;
    const {
        order_status_url,
        name,
        customer,
        created_at,
    } = selected.shopify_order;

    return (
        <div>
            <h3><a href={order_status_url} target="_blank">{name}</a></h3>
            {import_status === 'linked' && (
                <h4>{name} linked to {sage_SalesOrderNo}</h4>
            )}
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{customer.first_name} {customer.last_name}</h5>
                    <div>{customer.email}</div>
                    {!!created_at && (
                        <div>Order Date: {format(parseJSON(created_at), 'MM/dd/yyyy')}
                            {' '}
                            <small>{format(parseJSON(created_at), 'hh:mm b')}</small>
                        </div>
                    )}
                </div>
            </div>

            <OrderInfoDetail/>
            {!!import_result && !!import_result.error && (
                <Alert color="danger" title="Import Error:">{import_result.error}</Alert>
            )}
        </div>
    );
}
export default OrderInfo;
