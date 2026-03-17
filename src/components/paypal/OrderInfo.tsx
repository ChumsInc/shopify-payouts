import {selectCurrentOrder} from "@/ducks/paypal/paypalSlice.ts";
import OrderInfoDetail from "./OrderInfoDetail.tsx";
import dayjs from "dayjs";
import {Alert} from "react-bootstrap";
import {useAppSelector} from "@/app/configureStore.ts";

// const detailFields = [
//     {field: 'sku', title: 'SKU'},
//     {field: 'name', title: 'Description'},
//     {field: 'quantity', title: 'Quantity', className: 'right'},
//     {field: 'price', title: 'Price', className: 'right'},
// ];

const OrderInfo = () => {
    const selected = useAppSelector(selectCurrentOrder);
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
                        <div>Order Date: {dayjs(created_at).format("MM/DD/YYYY")}
                            {' '}
                            <small>{dayjs(created_at).format('hh:mm a')}</small>
                        </div>
                    )}
                </div>
            </div>

            <OrderInfoDetail/>
            {!!import_result && !!import_result.error && (
                <Alert variant="danger" title="Import Error:">{import_result.error}</Alert>
            )}
        </div>
    );
}
export default OrderInfo;
