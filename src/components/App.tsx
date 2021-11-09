import React, {Component, useEffect} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import {selectCurrentTab, Tab, TabList, tabListCreatedAction, AlertList} from "chums-ducks";
import ShopifyPayments from "./ShopifyPayments";
import PayPalOrders from "../ducks/paypal/PayPalOrders";

const tabs:Tab[] = [
    {id: 'shopify-payments', title: 'Shopify Payments'},
    {id: 'paypal-orders', title: 'Paypal Orders'}
];

const tabSetID = 'app-tabs';

const App:React.FC = () =>  {
    const dispatch = useDispatch();
    const currentTab = useSelector(selectCurrentTab(tabSetID));

    useEffect(() => {
        dispatch(tabListCreatedAction(tabs, tabSetID));
    })

    return (
        <main>
            <TabList tabKey={tabSetID} className="mb-3" />
            <AlertList />
            {currentTab === 'shopify-payments' && <ShopifyPayments/>}
            {currentTab === 'paypal-orders' && <PayPalOrders/>}

        </main>
    )
}

export default App;
