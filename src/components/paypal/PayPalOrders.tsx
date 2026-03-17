import PaypalOrdersList from "./PaypalOrdersList.tsx";
import {ErrorBoundary} from "react-error-boundary";
import ErrorBoundaryFallback from "@/components/ErrorBoundaryFallback.tsx";
import OrderInfo from "@/components/paypal/OrderInfo.tsx";

const PayPalOrders = () => {
    return (
        <div className="row g-3">
            <div className="col-lg-9 col-md-8 col-6">
                <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
                    <PaypalOrdersList/>
                </ErrorBoundary>
            </div>
            <div className="col-lg-3 col-md-4 col-6">
                <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
                    <OrderInfo/>
                </ErrorBoundary>
            </div>
        </div>
    )
}

export default PayPalOrders;
