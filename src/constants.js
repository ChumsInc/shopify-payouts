export const FETCH_INIT = 'FETCH_INIT';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAILURE = 'FETCH_FAILURE';

export const SET_ALERT = 'SET_ALERT';
export const DISMISS_ALERT = 'DISMISS_ALERT';

export const SET_TAB = 'SET_TAB';

export const FETCH_ORDER = 'FETCH_ORDER';
export const FETCH_PAYPAL_ORDERS = 'FETCH_PAYPAL_ORDERS';
// export const FETCH_IMPORT_ORDER = 'FETCH_IMPORT_ORDER';
// export const FETCH_FULFILL_ORDERS = 'FETCH_FULFILL_ORDERS';
export const FETCH_PAYOUTS = 'FETCH_PAYOUTS';
export const FETCH_TRANSACTIONS = 'FETCH_TRANSACTIONS';
export const FETCH_PAYOUT_COMPLETE = 'FETCH_PAYOUT_COMPLETE';

export const SELECT_PAYOUT = 'SELECT_PAYOUT';
export const SELECT_ORDER = 'SELECT_ORDER';
export const UPDATE_SO = 'UPDATE_SO';
export const SET_STATUS = 'SET_STATUS';
export const SET_PAGE = 'SET_PAGE';
export const SET_ROWS_PER_PAGE = 'SET_ROWS_PER_PAGE';
export const SET_PP_PAGE = 'SET_PP_PAGE';
export const SET_PP_ROWS_PER_PAGE = 'SET_PP_ROWS_PER_PAGE';
export const APPLY_CASH = 'APPLY_CASH';
export const APPLY_CASH_NONE = 'APPLY_CASH_NONE';
export const APPLY_CASH_ALL = 'APPLY_CASH_ALL';

export const URL_PAYOUTS = '/api/shopify/payments/payouts';
export const URL_TRANSACTIONS = '/api/shopify/payments/payouts/:id';
export const URL_PAYOUT_COMPLETE = '/api/shopify/payments/payouts/complete/:id';
export const URL_PAYPAL_ORDERS = '/api/shopify/payments/paypal';
export const URL_ORDER = '/api/shopify/orders/:id';

export const TAB_LIST = [
    {active: true, id: 'payouts', title: 'Shopify Payments'},
    {active: false, id: 'paypal', title: 'Paypal Orders'},
];
