import React from 'react';
import PayoutsList from "../ducks/payouts/PayoutsList";
import TransactionList from "../ducks/transactions/TransactionList";

const ShopifyPayments:React.FC = () => {
    return (
        <div className="row">
            <div className="col-lg-3 col-md-4 col-6">
                <PayoutsList />
            </div>
            <div className="col-lg-9 col-md-8 col-6">
                <TransactionList />
            </div>
        </div>
    )
};

export default ShopifyPayments;
