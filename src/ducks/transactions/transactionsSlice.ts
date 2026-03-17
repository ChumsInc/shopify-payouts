import type {SortProps} from "chums-types";
import type {PayoutBalanceTransactionRow, PayoutTransactionsResponse} from "../types";
import {createAsyncThunk, createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {transactionTableSorter} from "@/ducks/transactions/utils.ts";
import type {RootState} from "@/app/configureStore.ts";
import {fetchPayoutTransactions} from "@/api/payouts.ts";
import {dismissAlert} from "@chumsinc/alert-list";

const defaultSort: SortProps<PayoutBalanceTransactionRow> = {field: "id", ascending: true};

const adapter = createEntityAdapter<PayoutBalanceTransactionRow, string>({
    selectId: (transaction) => `${transaction.id}`,
    sortComparer: (a, b) => `${a.id}`.localeCompare(`${b.id}`),
})

const selectors = adapter.getSelectors();

export interface TransactionsState {
    payout_id: string;
    status: 'idle' | 'loading' | 'rejected';
    sort: SortProps<PayoutBalanceTransactionRow>;
}

export const extraState: TransactionsState = {
    payout_id: '0',
    status: 'idle',
    sort: {...defaultSort}
}

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState: adapter.getInitialState(extraState),
    reducers: {
        setSort: (state, action: PayloadAction<SortProps<PayoutBalanceTransactionRow>>) => {
            state.sort = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(dismissAlert, (state, action) => {
                if (action.payload.context?.startsWith('transactions/')) {
                    state.status = 'idle'
                }
            })
            .addAsyncThunk(loadTransactions, {
                pending: (state, action) => {
                    state.status = 'loading';
                    if (state.payout_id !== String(action.meta.arg)) {
                        adapter.removeAll(state);
                    }
                    state.payout_id = String(action.meta.arg);
                },
                fulfilled: (state, action) => {
                    state.status = 'idle';
                    adapter.setAll(state, action.payload?.transactions ?? []);
                },
                rejected: (state) => {
                    state.status = 'rejected';
                }
            })

    },
    selectors: {
        selectTransactionList: (state) => selectors.selectAll(state),
        selectTransactionsStatus: (state) => state.status,
        selectSort: (state) => state.sort,
    }
})

export const {setSort} = transactionsSlice.actions;
export const {selectTransactionsStatus, selectTransactionList, selectSort} = transactionsSlice.selectors;


export const selectSortedTransactionList = createSelector(
    [selectTransactionList, selectSort],
    (list, sort) => {
        return [...list].sort(transactionTableSorter(sort));
    }
)


export default transactionsSlice;

export const loadTransactions = createAsyncThunk<PayoutTransactionsResponse | null, string, { state: RootState }>(
    'transactions/load',
    async (arg) => {
        return fetchPayoutTransactions(arg);
    }, {
        condition: (_, {getState}) => {
            const state = getState();
            return selectTransactionsStatus(state) === 'idle';
        }
    }
)
