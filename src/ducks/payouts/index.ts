import {createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {SortProps} from "chums-types";
import {defaultPayoutsSort, payoutsSorter} from "@/ducks/payouts/utils.ts";
import {dismissAlert} from "@chumsinc/alert-list";
import type {ShopifyPaymentsPayout} from "@/ducks/types.ts";
import {loadPayouts, markPayoutComplete} from "@/ducks/payouts/actions.ts";
import {loadTransactions} from "@/ducks/transactions/transactionsSlice.ts";

const adapter = createEntityAdapter<ShopifyPaymentsPayout, string>({
    selectId: (transaction) => transaction.id,
    sortComparer: (a, b) => a.id.localeCompare(b.id),
})

const selectors = adapter.getSelectors();

export interface PayoutsState {
    status: 'idle' | 'loading' | 'saving' | 'rejected';
    current: ShopifyPaymentsPayout | null;
    sort: SortProps<ShopifyPaymentsPayout>;
}

const extraState: PayoutsState = {
    status: 'idle',
    current: null,
    sort: defaultPayoutsSort,
}

const payoutsSlice = createSlice({
    name: 'payouts',
    initialState: adapter.getInitialState(extraState),
    reducers: {
        setSort: (state, action: PayloadAction<SortProps<ShopifyPaymentsPayout>>) => {
            state.sort = action.payload;
        },
        setCurrentPayout: (state, action: PayloadAction<ShopifyPaymentsPayout | null>) => {
            state.current = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadPayouts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadPayouts.fulfilled, (state, action) => {
                state.status = 'idle';
                adapter.setAll(state, action.payload);
                if (state.current) {
                    const [current] = action.payload.filter(row => row.id === state.current?.id);
                    state.current = current ?? null;
                }
            })
            .addCase(loadPayouts.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(markPayoutComplete.pending, (state) => {
                state.status = 'saving';
            })
            .addCase(markPayoutComplete.fulfilled, (state, action) => {
                state.status = 'idle';
                adapter.setAll(state, action.payload);
                if (state.current) {
                    const [current] = action.payload.filter(row => row.id === state.current?.id);
                    state.current = current ?? null;
                }
            })
            .addCase(markPayoutComplete.rejected, (state) => {
                state.status = 'rejected'
            })
            .addCase(loadTransactions.pending, (state, action) => {
                const current = selectors.selectAll(state).find(tx => tx.legacyResourceId === action.meta.arg);
                state.current = current ?? null;
            })
            .addCase(loadTransactions.fulfilled, (state, action) => {
                if (state.current && !action.payload?.payout) {
                    adapter.removeOne(state, state.current.id)
                } else if (action.payload?.payout) {
                    adapter.addOne(state, action.payload.payout)
                }
                state.current = action.payload?.payout ?? null;
            })
            .addCase(dismissAlert, (state, action) => {
                if (action.payload.context?.startsWith('payouts/')) {
                    state.status = 'idle';
                }
            })
    },
    selectors: {
        selectPayoutsList: (state) => selectors.selectAll(state),
        selectPayoutsStatus: (state) => state.status,
        selectSort: (state) => state.sort,
        selectCurrentPayout: (state) => state.current,
    }
});

export const {setSort} = payoutsSlice.actions;
export const {selectPayoutsStatus, selectPayoutsList, selectSort, selectCurrentPayout} = payoutsSlice.selectors;

export const selectSortedList = createSelector(
    [selectPayoutsList, selectSort],
    (list, sort) => {
        return [...list].sort(payoutsSorter(sort));
    }
)

export default payoutsSlice;

