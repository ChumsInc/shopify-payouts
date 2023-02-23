import {ShopifyPaymentTransaction, SortProps} from "chums-types";
import {TransactionTableFields} from "../types";
import {createAction, createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {fetchPayoutTransactions} from "../../api/payouts";
import {RootState} from "../../app/configureStore";

const defaultSort: SortProps<TransactionTableFields> = {field: "id", ascending: true};

export const transactionTableSorter = (sort: SortProps<TransactionTableFields>) =>
    (a: ShopifyPaymentTransaction, b: ShopifyPaymentTransaction) => {
        const {field, ascending} = sort;
        const sortMod = ascending ? 1 : -1;
        switch (field) {
        case 'type':
            return (a.type === b.type ? a.id - b.id : (a.type > b.type ? 1 : -1)) * sortMod;
        case 'id':
            return ((a.order?.id ?? 0) === (b.order?.id ?? 0)
                ? (a.id - b.id)
                : ((a.order?.id ?? 0) > (b.order?.id ?? 0) ? 1 : -1)) * sortMod;
        case 'sage_SalesOrderNo':
        case 'InvoiceNo':
        case 'BillToName':
            return (((a.order ?? {})[field] ?? '') === ((b.order ?? {})[field] ?? '')
                    ? (a.id - b.id)
                    : (((a.order ?? {})[field] ?? '') > ((b.order ?? {})[field] ?? '') ? 1 : -1)
            ) * sortMod;
        case 'amount':
        case 'net':
        case 'fee':
            return (Number(a[field]) - Number(b[field])) * sortMod;
        case 'email':
            return ((a.order?.shopify_order?.email ?? '').toLowerCase() === (b.order?.shopify_order?.email ?? '').toLowerCase()
                    ? (a.id - b.id)
                    : ((a.order?.shopify_order?.email ?? '').toLowerCase() > (b.order?.shopify_order?.email ?? '').toLowerCase() ? 1 : -1)
            ) * sortMod;
        default:
            return (a.id - b.id) * sortMod;
        }
    }

export const transactionSorter = (a: ShopifyPaymentTransaction, b: ShopifyPaymentTransaction) => {
    return a.id > b.id ? 1 : -1;
}

export interface TransactionsState {
    payout_id: number;
    list: ShopifyPaymentTransaction[];
    loading: boolean;
    page: number;
    rowsPerPage: number;
    sort: SortProps<TransactionTableFields>;
}

export const initialTransactionsState: TransactionsState = {
    payout_id: 0,
    list: [],
    loading: false,
    page: 0,
    rowsPerPage: 10,
    sort: {...defaultSort}
}


export const loadTransactions = createAsyncThunk<ShopifyPaymentTransaction[], number>(
    'transactions/load',
    async (arg) => {
        return fetchPayoutTransactions(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectTransactionsLoading(state);
        }
    }
)
export const setPage = createAction<number>('transactions/setPage');
export const setRowsPerPage = createAction<number>('transactions/setRowsPerPage');
export const setSort = createAction<SortProps<TransactionTableFields>>('transactions/setSort');


const transactionsReducer = createReducer(initialTransactionsState, (builder) => {
    builder
        .addCase(loadTransactions.pending, (state, action) => {
            state.loading = true;
            if (state.payout_id !== action.meta.arg) {
                state.list = [];
            }
            state.payout_id = action.meta.arg;
        })
        .addCase(loadTransactions.fulfilled, (state, action) => {
            state.list = action.payload.sort(transactionSorter);
            state.loading = false;
            state.page = 0;
        })
        .addCase(loadTransactions.rejected, (state) => {
            state.loading = false;
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            state.rowsPerPage = action.payload;
            state.page = 0;
        })
        .addCase(setSort, (state, action) => {
            state.page = 0;
            state.sort = action.payload;
        })
});


export const selectTransactionList = (state: RootState) => state.transactions.list;
export const selectTransactionsLoading = (state: RootState) => state.transactions.loading;
export const selectPage = (state: RootState) => state.transactions.page;
export const selectRowsPerPage = (state: RootState) => state.transactions.rowsPerPage;
export const selectSort = (state: RootState) => state.transactions.sort;
export const selectSortedTransactionList = createSelector(
    [selectTransactionList, selectSort],
    (list, sort) => {
        return [...list].sort(transactionTableSorter(sort));
    }
)


export default transactionsReducer;
