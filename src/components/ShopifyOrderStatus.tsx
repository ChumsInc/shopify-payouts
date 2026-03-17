import {Fragment} from 'react';
import {Badge} from "react-bootstrap";

export interface ShopifyOrderStatusProps {
    tags?: string
    fulfillment_status?: string | null
    has_discount?: boolean
}

const ShopifyOrderStatus = ({
                                tags,
                                fulfillment_status,
                                has_discount
                            }: ShopifyOrderStatusProps) => {

    return (
        <Fragment>
            {has_discount && (<Badge bg="primary" text="discount" className="me-1"/>)}
            {(tags ?? '').split(' ')
                .filter(tag => tag.toLocaleLowerCase() !== 'printed')
                .map(tag => (<Badge bg="info" key={tag} className="me-1">{tag}</Badge>))}
            {fulfillment_status?.toLowerCase() === 'fulfilled' && <Badge bg="success">Fulfilled</Badge>}
        </Fragment>
    );
}

export default ShopifyOrderStatus;
