import React, {Fragment} from 'react';
import {Badge, BootstrapColor} from "chums-ducks";

const paymentBadgeType = (st:string):BootstrapColor => {
    switch (st) {
    case 'authorized':
    case 'partial':
        return 'warning';
    case 'paid':
    case 'fulfilled':
        return 'success';
    default:
        return 'light';
    }
};
const daysType = (days:number):BootstrapColor => {
    if (days > 4) {
        return 'danger';
    } else if (days > 2) {
        return 'warning';
    }
    return 'light';
};

const gwBadgeName = (gateway:string) => {
    switch (gateway) {
    case 'paypal':
        return 'PP';
    case 'shopify_payments':
        return 'SP';
    default:
        return gateway;
    }
};

export interface GatewayBadgeProps {
    gateway: string,
}
const GatewayBadge:React.FC<GatewayBadgeProps> = ({gateway}) => {
    return (
        <Badge color="dark" text={gwBadgeName(gateway)}/>
    )
};

export interface PaymentBadgeProps {
    financial_status: string,
    fulfillment_status: string,
}
const PaymentBadge:React.FC<PaymentBadgeProps> = ({financial_status, fulfillment_status}) => {
    return (
        <Fragment>
            {financial_status !== 'paid' && (
                <Badge text={financial_status} color={paymentBadgeType(financial_status)}/>)}
            <Badge text={fulfillment_status} color={paymentBadgeType(fulfillment_status)}/>
        </Fragment>
    )
};

export interface ShopifyOrderStatusProps {
    financial_status: string,
    gateway: string,
    tags: string,
    fulfillment_status: string|null,
    processed_at: string,
    total_discounts: string,
}

const ShopifyOrderStatus: React.FC<ShopifyOrderStatusProps> = ({
                                                                   financial_status,
                                                                   gateway,
                                                                   tags,
                                                                   fulfillment_status,
                                                                   processed_at,
                                                                   total_discounts
                                                               }) => {
    const hasDiscount = Number(total_discounts) > 0;

    return (
        <Fragment>
            {hasDiscount && (<Badge color="primary" text="discount"/>)}
            {tags.split(' ')
                .filter(tag => tag !== 'printed')
                .map(tag => (<Badge color="info">{tag}</Badge>))}
        </Fragment>
    );
}

export default ShopifyOrderStatus;
