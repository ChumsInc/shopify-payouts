import Nav, {type NavProps} from "react-bootstrap/Nav";

export interface AppTabsProps extends NavProps {
    activeKey: string;
    onSetActiveKey: (key: string|null) => void;
}
export default function AppTabs({activeKey, onSetActiveKey}:AppTabsProps) {
    const selectHandler = (key: string|null) => {
        onSetActiveKey(key);
    }
    return (
        <Nav variant="tabs" activeKey={activeKey} onSelect={selectHandler} defaultActiveKey="shopify-payments">
            <Nav.Item>
                <Nav.Link eventKey="shopify-payments">Shopify Payments</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="paypal-orders">Paypal Orders</Nav.Link>
            </Nav.Item>
        </Nav>
    )
}
