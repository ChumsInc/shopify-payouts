import {useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentOrder} from "@/ducks/paypal/paypalSlice.ts";
import dayjs from "dayjs";
import LegacyOrderInfo from "@/components/paypal/LegacyOrderInfo.tsx";
import OrderInfoDetail from "@/components/paypal/OrderInfoDetail.tsx";
import {Alert} from "react-bootstrap";

export default function OrderInfo() {
    const selected = useAppSelector(selectCurrentOrder);

    if (!selected) {
        return null;
    }
    if (!selected.graphqlOrder) {
        return <LegacyOrderInfo/>
    }

    const orderStatusUrl = `https://admin.shopify.com/store/chumsinc/orders/${selected.graphqlOrder.legacyResourceId}`;


    return (
        <div>
            <h3>
                <a href={orderStatusUrl} target="_blank">
                    {selected.graphqlOrder.name}
                </a>
            </h3>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{selected.graphqlOrder.billingAddress?.name}</h5>
                    <div>{selected.graphqlOrder.email}</div>
                    <div>
                        Order Date:
                        <span className="ms-1">{dayjs(selected.graphqlOrder.createdAt).format('MM/DD/YYYY')}</span>
                        <small className="ms-1">{dayjs(selected.graphqlOrder.createdAt).format('hh:mm a')}</small>
                    </div>
                </div>
            </div>
            <OrderInfoDetail/>
            {selected.import_result && selected.import_result.error && (
                <Alert variant="danger" title="Import Error:">{selected.import_result.error}</Alert>
            )}
        </div>
    )
}
