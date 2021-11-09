import {
    payoutSelected,
    payoutsFetchFailed,
    payoutsFetchRequested,
    payoutsFetchSucceeded,
    payoutsMarkCompletedFailed,
    payoutsMarkCompletedRequested,
    payoutsMarkCompletedSucceeded,
    PayoutThunkAction
} from "./actionTypes";
import {selectPayoutsLoading, selectSelectedPayout} from "./index";
import {buildPath, fetchJSON} from "chums-ducks";
import {URL_PAYOUT_COMPLETE, URL_PAYOUTS} from "../../constants";
import {ShopifyPayout} from "../common-types";
import {fetchTransactionsAction} from "../transactions";


export const fetchPayoutsAction = (): PayoutThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectPayoutsLoading(state)) {
                return;
            }
            dispatch({type: payoutsFetchRequested});
            const response = await fetchJSON(URL_PAYOUTS, {cache: 'no-cache'});
            const payouts: ShopifyPayout[] = response.payouts || [];
            dispatch({type: payoutsFetchSucceeded, payload: {payouts}});
            if (payouts.length === 1) {
                dispatch(selectPayoutAction(payouts[0]));
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchPayoutsAction()", error.message);
                return dispatch({type: payoutsFetchFailed, payload: {error, context: payoutsFetchRequested}})
            }
            console.error("fetchPayoutsAction()", error);
        }
    };

export const selectPayoutAction = (payout: ShopifyPayout): PayoutThunkAction =>
    (dispatch, getState) => {
        dispatch({type: payoutSelected, payload: {payout}});
        if (payout) {
            dispatch(fetchTransactionsAction(payout.id));
        }
    };

export const markPayoutCompletedAction = (): PayoutThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const selected = selectSelectedPayout(state);
            if (!selected || selectPayoutsLoading(state)) {
                return;
            }
            dispatch({type: payoutsMarkCompletedRequested});
            const url = buildPath(URL_PAYOUT_COMPLETE, {id: selected.id});
            const res = await fetchJSON(url, {method: 'POST'});
            const payouts: ShopifyPayout[] = res.payouts || [];
            dispatch({type: payoutsMarkCompletedSucceeded, payload: {payouts}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("markPayoutCompleted()", error.message);
                return dispatch({
                    type: payoutsMarkCompletedFailed,
                    payload: {error, context: payoutsMarkCompletedRequested}
                })
            }
            console.error("markPayoutCompleted()", error);
        }
    };

