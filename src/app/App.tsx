import React, {useState} from "react";
import {Tab, TabList} from "chums-components";
import AlertList from "../ducks/alerts/AlertList";
import ShopifyPayments from "../components/ShopifyPayments";
import PayPalOrders from "../ducks/paypal/PayPalOrders";

const tabs: Tab[] = [
    {id: 'shopify-payments', title: 'Shopify Payments'},
    {id: 'paypal-orders', title: 'Paypal Orders'}
];

const App = () => {
    const [tab, setTab] = useState<string>(tabs[0].id);

    return (
        <div>
            <TabList tabs={tabs} currentTabId={tab} onSelectTab={(tab) => setTab(tab.id)} className="mb-3"/>
            <AlertList/>
            {tab === tabs[0].id && <ShopifyPayments/>}
            {tab === tabs[1].id && <PayPalOrders/>}
        </div>
    )
}

export default App;
