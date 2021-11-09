import {ShopifyOrder} from "../common-types";
import {
    paypalApplyCash,
    paypalFetchOrderFailed,
    paypalFetchOrderRequested,
    paypalFetchOrdersFailed,
    paypalFetchOrdersRequested,
    paypalFetchOrdersSucceeded,
    paypalFetchOrderSucceeded,
    PaypalThunkAction
} from "./actionTypes";
import {selectPaypalOrdersLoading, selectSelectedLoading} from "./selectors";
import {URL_ORDER, URL_PAYPAL_ORDERS} from "../../constants";
import {buildPath, fetchJSON} from "chums-ducks";


export const selectPaypalOrderAction = (order: ShopifyOrder): PaypalThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectPaypalOrdersLoading(state) || selectSelectedLoading(state)) {
                return;
            }
            dispatch({type: paypalFetchOrderRequested, payload: {order}});
            const url = buildPath(URL_ORDER, {id: order.id});
            const res = await fetchJSON(url, {cache: "no-cache"});
            const {order: refreshedOrder} = res;
            dispatch({type: paypalFetchOrderSucceeded, payload: {order: refreshedOrder}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("selectOrder()", error.message);
                return dispatch({type: paypalFetchOrderFailed, payload: {error, context: paypalFetchOrderRequested}})
            }
            console.error("selectOrder()", error);
        }
    }

export const fetchPaypalOrdersAction = (): PaypalThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectPaypalOrdersLoading(state)) {
                return;
            }
            dispatch({type: paypalFetchOrdersRequested});
            const url = buildPath(URL_PAYPAL_ORDERS);

            const res = await fetchJSON(url, {cache: 'no-cache'});
            const {orders} = res;
            dispatch({type: paypalFetchOrdersSucceeded, payload: {orders}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchPaypalOrders()", error.message);
                return dispatch({type: paypalFetchOrdersFailed, payload: {error, context: paypalFetchOrdersRequested}})
            }
            console.error("fetchPaypalOrders()", error);
        }

    };

export const toggleApplyCashAction = (orderId: number) => ({type: paypalApplyCash, payload: {orderId}});
export const applyCashToOrdersAction = (orderIdList: number[] = []) => ({type: paypalApplyCash, payload: {orderIdList}});
