import {RootState} from "../../app/configureStore";
import {createAction, createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {fetchPayouts, postPayoutComplete} from "../../api/payouts";
import {ShopifyPayment, SortProps} from "chums-types";
import Decimal from "decimal.js";
import {loadTransactions} from "../transactions";

export const payoutsSorter = (sort: SortProps<ShopifyPayment>) =>
    (a: ShopifyPayment, b: ShopifyPayment) => {
        const {field, ascending} = sort;
        const sortMod = ascending ? 1 : -1;
        switch (field) {
        case "amount":
            return (a[field] === b[field]
                    ? (a.id - b.id)
                    : (new Decimal(a[field]).gt(b[field]) ? 1 : -1)
            ) * sortMod;
        case 'id':
        case 'summary':
            return a.id - b.id;
        default:
            return (a[field].toLowerCase() === b[field].toLowerCase()
                    ? (a.id - b.id)
                    : (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1)
            ) * sortMod;
        }
    }

export const defaultPayoutsSort: SortProps<ShopifyPayment> = {
    field: 'id',
    ascending: true,
}

export interface PayoutsState {
    list: ShopifyPayment[],
    loading: boolean;
    current: ShopifyPayment | null;
    page: number;
    rowsPerPage: number;
    sort: SortProps<ShopifyPayment>;
}

const initialPayoutsState: PayoutsState = {
    list: [],
    loading: false,
    current: null,
    page: 0,
    rowsPerPage: 10,
    sort: defaultPayoutsSort,
}

export const loadPayouts = createAsyncThunk<ShopifyPayment[]>(
    'payouts/load',
    async () => {
        return await fetchPayouts();
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectPayoutsLoading(state);
        }
    }
)

export const markPayoutComplete = createAsyncThunk<ShopifyPayment[], number>(
    'payouts/complete',
    async (arg) => {
        return await postPayoutComplete(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            if (!arg) {
                return false;
            }
            return !selectPayoutsLoading(state);
        }
    }
)


export const setPage = createAction<number>('payouts/setPage');
export const setRowsPerPage = createAction<number>('payouts/setRowsPerPage');
export const setSort = createAction<SortProps<ShopifyPayment>>('payouts/setSort');


export const selectPayoutsList = (state: RootState): ShopifyPayment[] => state.payouts.list;
export const selectPayoutsLoading = (state: RootState): boolean => state.payouts.loading;
export const selectCurrentPayout = (state: RootState): ShopifyPayment | null => state.payouts.current;
export const selectPage = (state: RootState) => state.payouts.page;
export const selectRowsPerPage = (state: RootState) => state.payouts.rowsPerPage;
export const selectSort = (state: RootState) => state.payouts.sort;

export const selectSortedList = createSelector(
    [selectPayoutsList, selectSort],
    (list, sort) => {
        return [...list].sort(payoutsSorter(sort));
    }
)

const payoutsReducer = createReducer(initialPayoutsState, (builder) => {
    builder
        .addCase(loadPayouts.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadPayouts.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload.sort(payoutsSorter(defaultPayoutsSort));
            state.page = 0;
            if (state.current) {
                const [current] = state.list.filter(row => row.id === state.current?.id);
                state.current = current ?? null;
            }
        })
        .addCase(loadPayouts.rejected, (state) => {
            state.loading = false;
        })
        .addCase(markPayoutComplete.pending, (state) => {
            state.loading = true;
        })
        .addCase(markPayoutComplete.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload.sort(payoutsSorter(defaultPayoutsSort));
            state.page = 0;
            if (state.current) {
                const [current] = state.list.filter(row => row.id === state.current?.id);
                state.current = current ?? null;
            }
        })
        .addCase(markPayoutComplete.rejected, (state) => {
            state.loading = false;
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            state.page = 0;
            state.rowsPerPage = action.payload;
        })
        .addCase(setSort, (state, action) => {
            state.page = 0;
            state.sort = action.payload;
        })
        .addCase(loadTransactions.pending, (state, action) => {
            const [current] = state.list.filter(row => row.id === action.meta.arg);
            state.current = current ?? null;
        })

});


export default payoutsReducer;
