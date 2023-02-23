import React, {Fragment} from 'react';
import {Badge} from "chums-components";

export interface ShopifyOrderStatusProps {
    tags?: string,
    fulfillment_status?: string | null,
    total_discounts?: string,
}

const ShopifyOrderStatus: React.FC<ShopifyOrderStatusProps> = ({
                                                                   tags,
                                                                   fulfillment_status,
                                                                   total_discounts
                                                               }) => {
    const hasDiscount = Number(total_discounts ?? '0') > 0;

    return (
        <Fragment>
            {hasDiscount && (<Badge color="primary" text="discount"/>)}
            {(tags ?? '').split(' ')
                .filter(tag => tag !== 'printed')
                .map(tag => (<Badge color="info">{tag}</Badge>))}
            {fulfillment_status === 'fulfilled' && <Badge color="success">Fulfilled</Badge>}
        </Fragment>
    );
}

export default ShopifyOrderStatus;
