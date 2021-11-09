import React from 'react';
import PaypalOrdersList from "./PaypalOrdersList";
import OrderInfo from "./OrderInfo";
import {ErrorBoundary} from "chums-ducks";

const PayPalOrders: React.FC = () => {
    return (
        <div className="row g-3">
            <div className="col-lg-9 col-md-8 col-6">
                <ErrorBoundary>
                    <PaypalOrdersList/>
                </ErrorBoundary>
            </div>
            <div className="col-lg-3 col-md-4 col-6">
                <ErrorBoundary>
                    <OrderInfo/>
                </ErrorBoundary>
            </div>
        </div>
    )
}

export default PayPalOrders;
