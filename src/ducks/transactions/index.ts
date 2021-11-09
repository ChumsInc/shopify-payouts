import {combineReducers} from "redux";
import {URL_TRANSACTIONS} from "../../constants";
import {ActionInterface, ActionPayload, buildPath, fetchJSON} from "chums-ducks";
import {ShopifyTransaction, ShopifyTransactionSortProps} from "../common-types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";

export const transactionsFetchRequested = 'transactions/fetchList/Requested';
export const transactionsFetchSucceeded = 'transactions/fetchList/Succeeded';
export const transactionsFetchFailed = 'transactions/fetchList/Failed';

export interface TransactionPayload extends ActionPayload {
    transactions?: ShopifyTransaction[],
}

export interface TransactionAction extends ActionInterface {
    payload?: TransactionPayload,
}

export interface TransactionThunkAction extends ThunkAction<any, RootState, any, TransactionAction> {
}

export const fetchTransactionsAction = (id: number): TransactionThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectTransactionsLoading(state)) {
                return;
            }
            dispatch({type: transactionsFetchRequested});
            const url = buildPath(URL_TRANSACTIONS, {id});
            const res = await fetchJSON(url, {cache: 'no-cache'});
            const transactions: ShopifyTransaction[] = res.transactions || [];
            dispatch({type: transactionsFetchSucceeded, payload: {transactions}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchTransactionsAction()", error.message);
                return dispatch({type: transactionsFetchFailed, payload: {error, context: transactionsFetchRequested}})
            }
            console.error("fetchTransactionsAction()", error);
        }
    };

export const selectTransactionList = (state: RootState) => state.transactions.list;
export const selectTransactionsLoading = (state: RootState) => state.transactions.loading;
export const selectSortedTransactionList = (sort: ShopifyTransactionSortProps) => (state: RootState) => state.transactions.list.sort(transactionSorter(sort));

const sortVal = (sort: ShopifyTransactionSortProps, tx: ShopifyTransaction): string | number | boolean => {
    switch (sort.field) {
    case 'name':
        return [tx.order?.customer.first_name || '', tx.order?.customer.last_name || ''].join(' ').trim();
    case 'customer':
        return [tx.order?.ARDivisionNo || '', tx.order?.CustomerNo || ''].join('-').trim();
    case 'invoice':
        return tx.order?.InvoiceNo || '';
    case 'SalesOrderNo':
        return tx.order?.sage_SalesOrderNo || '';
    default:
        if (sort.field !== 'order') {
            return tx[sort.field] || '';
        }
        return '';
    }
}

export const transactionSorter = (sort: ShopifyTransactionSortProps) => (a: ShopifyTransaction, b: ShopifyTransaction) => {
    const aVal = sortVal(sort, a);
    const bVal = sortVal(sort, b);
    return (aVal === bVal ? (a.id > b.id ? 1 : -1) : (aVal > bVal ? 1 : -1)) * (sort.ascending ? 1 : -1);
}

export const defaultTransactionSort: ShopifyTransactionSortProps = {
    field: "id",
    ascending: true,
}

const listReducer = (state: ShopifyTransaction[] = [], action: TransactionAction): ShopifyTransaction[] => {
    const {type, payload} = action;
    switch (type) {
    case transactionsFetchSucceeded:
        if (payload?.transactions) {
            return payload.transactions
                .filter(tx => tx.type !== 'payout')
                .sort(transactionSorter(defaultTransactionSort));
        }
        return [];
    case transactionsFetchFailed:
        return [];
    default:
        return state;
    }
};

const loadingReducer = (state = false, action: TransactionAction): boolean => {
    const {type} = action;
    switch (type) {
    case transactionsFetchRequested:
        return true;
    case transactionsFetchSucceeded:
    case transactionsFetchFailed:
        return false;
    default:
        return state;
    }
};

export default combineReducers({
    list: listReducer,
    loading: loadingReducer,
});
