import React from 'react';
import {connect, useSelector} from 'react-redux';
import {format, parseJSON} from "date-fns";
import {selectSelectedLoading, selectSelectedOrder} from "./selectors";
import OrderInfoDetail from "./OrderInfoDetail";
import {Alert, LoadingProgressBar} from "chums-ducks";

const detailFields = [
    {field: 'sku', title: 'SKU'},
    {field: 'name', title: 'Description'},
    {field: 'quantity', title: 'Quantity', className: 'right'},
    {field: 'price', title: 'Price', className: 'right'},
];

const OrderInfo: React.FC = () => {
    const selected = useSelector(selectSelectedOrder);
    const loading = useSelector(selectSelectedLoading);
    if (!selected) {
        return null;
    }
    const {
        order_status_url,
        name,
        import_status,
        sage_SalesOrderNo,
        customer,
        created_at,
        line_items,
        import_result
    } = selected;
    return (
        <div>
            <h3><a href={order_status_url} target="_blank">{name}</a></h3>
            {loading && (<LoadingProgressBar striped={true}/>)}
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
