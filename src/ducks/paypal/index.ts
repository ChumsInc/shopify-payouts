import {combineReducers} from "redux";
import {ShopifyOrder} from "../common-types";
import {
    PaypalAction,
    paypalApplyCash,
    paypalFetchOrderFailed,
    paypalFetchOrderRequested,
    paypalFetchOrdersFailed,
    paypalFetchOrdersRequested,
    paypalFetchOrdersSucceeded,
    paypalFetchOrderSucceeded
} from "./actionTypes";

const orderSort = (a: ShopifyOrder, b: ShopifyOrder): number => a.id - b.id;

const listReducer = (state: ShopifyOrder[] = [], action: PaypalAction): ShopifyOrder[] => {
    const {type, payload} = action;
    switch (type) {
    case paypalFetchOrdersSucceeded:
        if (payload?.orders) {
            return payload.orders.sort(orderSort);
        }
        return [];
    case paypalFetchOrderSucceeded:
        if (payload?.order) {
            return [
                ...state.filter(ord => ord.id !== payload.order?.id),
                {...payload.order},
            ].sort(orderSort);
        }
        return state;
    default:
        return state;
    }
};

const loadingReducer = (state: boolean = false, action: PaypalAction): boolean => {
    switch (action.type) {
    case paypalFetchOrdersRequested:
        return true;
    case paypalFetchOrdersSucceeded:
    case paypalFetchOrdersFailed:
        return false;
    default:
        return state;
    }
};

const cashAppliedReducer = (state: number[] = [], action: PaypalAction): number[] => {
    const {type, payload} = action;
    switch (type) {
    case paypalApplyCash:
        if (payload?.orderIdList) {
            return payload.orderIdList.sort();
        }
        if (payload?.orderId) {
            if (state.includes(payload.orderId)) {
                return state.filter(id => id !== payload.orderId).sort();
            }
            return [...state, payload.orderId].sort();
        }
        return state;
    default:
        return state;
    }
};


const selectedOrderReducer = (state: ShopifyOrder | null = null, action: PaypalAction): ShopifyOrder | null => {
    const {type, payload} = action;
    switch (type) {
    case paypalFetchOrderRequested:
    case paypalFetchOrderSucceeded:
        if (payload?.order) {
            return {...payload.order};
        }
        return null;
    default:
        return state;
    }
};

const selectedLoadingReducer = (state: boolean = false, action: PaypalAction) => {
    switch (action.type) {
    case paypalFetchOrderRequested:
        return true;
    case paypalFetchOrderSucceeded:
    case paypalFetchOrderFailed:
        return false;
    default:
        return state;
    }
};

export default combineReducers({
    list: listReducer,
    loading: loadingReducer,
    selected: combineReducers({
        order: selectedOrderReducer,
        loading: selectedLoadingReducer,
    }),
    cashApplied: cashAppliedReducer,
});
