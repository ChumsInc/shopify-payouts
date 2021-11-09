import {ActionInterface, ActionPayload} from "chums-ducks";
import {ShopifyOrder} from "../common-types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";


export interface PaypalPayload extends ActionPayload {
    orders?: ShopifyOrder[],
    order?: ShopifyOrder,
    orderIdList?: number[],
    orderId?: number,
}
export interface PaypalAction extends ActionInterface {
    payload?: PaypalPayload,
}

export interface PaypalThunkAction extends ThunkAction<any, RootState, unknown, PaypalAction> {}


export const paypalFetchOrderRequested = 'paypal/fetchOrder/requested';
export const paypalFetchOrderSucceeded = 'paypal/fetchOrder/succeeded';
export const paypalFetchOrderFailed = 'paypal/fetchOrder/failed';

export const paypalFetchOrdersRequested = 'paypal/fetchOrders/requested';
export const paypalFetchOrdersSucceeded = 'paypal/fetchOrders/succeeded';
export const paypalFetchOrdersFailed = 'paypal/fetchOrders/failed';

export const paypalApplyCash = 'paypal/applyCash';

