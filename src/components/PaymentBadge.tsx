import React, {Fragment} from "react";
import {Badge, BootstrapColor} from "chums-components";

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

export default PaymentBadge;
