import {ActionInterface, ActionPayload} from "chums-ducks";
import {ShopifyPayout} from "../common-types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {PaypalAction} from "../paypal/actionTypes";


export interface PayoutPayload extends ActionPayload {
    payouts?: ShopifyPayout[],
    payout?: ShopifyPayout,
}

export interface PayoutAction extends ActionInterface {
    payload?: PayoutPayload,
}

export interface PayoutThunkAction extends ThunkAction<any, RootState, any, PayoutAction> {}

export const payoutsFetchRequested = 'payouts/fetchList/requested';
export const payoutsFetchSucceeded = 'payouts/fetchList/succeeded';
export const payoutsFetchFailed = 'payouts/fetchList/failed';

export const payoutsMarkCompletedRequested = 'payouts/markCompleted/requested';
export const payoutsMarkCompletedSucceeded = 'payouts/markCompleted/succeeded';
export const payoutsMarkCompletedFailed = 'payouts/markCompleted/failed';

export const payoutSelected = 'payouts/selected';
