import {useState} from "react";
import ShopifyPayments from "../components/ShopifyPayments";
import PayPalOrders from "@/components/paypal/PayPalOrders.tsx";
import AppTabs from "@/components/AppTabs.tsx";
import AppAlertList from "@/components/AppAlertList.tsx";


const App = () => {
    const [tab, setTab] = useState<string | null>('shopify-payments');

    return (
        <div>
            <AppTabs activeKey={tab ?? 'shopify-payments'} onSetActiveKey={setTab} className="mb-3"/>
            <AppAlertList/>
            {tab === 'shopify-payments' && <ShopifyPayments/>}
            {tab === 'paypal-orders' && <PayPalOrders/>}
        </div>
    )
}

export default App;
