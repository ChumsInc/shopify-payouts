import {combineReducers} from 'redux';
import {ShopifyPayout} from "../common-types";
import {
    PayoutAction,
    payoutSelected,
    payoutsFetchFailed,
    payoutsFetchRequested,
    payoutsFetchSucceeded
} from "./actionTypes";
import {RootState} from "../index";

export const selectPayoutsList = (state:RootState):ShopifyPayout[] => state.payouts.list;
export const selectPayoutsLoading = (state:RootState):boolean => state.payouts.loading;
export const selectSelectedPayout = (state:RootState):ShopifyPayout|null => state.payouts.selected;

const list = (state:ShopifyPayout[] = [], action:PayoutAction):ShopifyPayout[] => {
    const {type, payload} = action;
    switch (type) {
    case payoutsFetchSucceeded:
        if (payload?.payouts) {
            return [...payload.payouts];
        }
        return [];
    default:
        return state;
    }
};

const loading = (state:boolean = false, action:PayoutAction):boolean => {
    const {type} = action;
    switch (type) {
    case payoutsFetchRequested:
        return true;
    case payoutsFetchSucceeded:
    case payoutsFetchFailed:
        return false;
    default:
        return state;
    }
};

const selected = (state:ShopifyPayout|null = null, action:PayoutAction):ShopifyPayout|null => {
    const {type, payload} = action;
    switch (type) {
    case payoutSelected:
        if (payload?.payout) {
            return payload.payout;
        }
        return null;
    default:
        return state;
    }
};

export default combineReducers({
    list,
    loading,
    selected,
})
