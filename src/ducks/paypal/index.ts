import {ExtendedSavedOrder, SortProps} from "chums-types";
import {createAction, createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {fetchPaypalInvoices} from "../../api/payouts";
import {RootState} from "../../app/configureStore";
import {selectLoading} from "./selectors";

const orderSort = (a: ExtendedSavedOrder, b: ExtendedSavedOrder): number => Number(a.id) - Number(b.id);

export interface PaypalState {
    list: ExtendedSavedOrder[];
    loading: boolean;
    current: ExtendedSavedOrder | null;
    cashApplied: number[];
    page: number;
    rowsPerPage: number;
    sort: SortProps
}

export const initialPaypalState: PaypalState = {
    list: [],
    loading: false,
    current: null,
    cashApplied: [],
    page: 0,
    rowsPerPage: 10,
    sort: {field: 'sage_SalesOrderNo', ascending: true},
}

export const loadPaypalInvoices = createAsyncThunk<ExtendedSavedOrder[]>(
    'paypal/loadInvoices',
    async () => {
        return await fetchPaypalInvoices();
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectLoading(state);
        }
    }
)

export const setCurrentOrder = createAction<ExtendedSavedOrder | undefined>('paypal/setCurrentOrder');
export const toggleCashApplied = createAction<number>('paypal/toggleApplyCash');
export const setCashApplied = createAction<number[]>('paypal/applyCash');
export const setPage = createAction<number>('paypal/setPage');
export const setRowsPerPage = createAction<number>('paypal/setRowsPerPage');
export const setSort = createAction<SortProps>('paypal/setSort');

const paypalReducer = createReducer(initialPaypalState, (builder) => {
    builder
        .addCase(loadPaypalInvoices.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadPaypalInvoices.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload.sort(orderSort);
            state.cashApplied = [];
            if (state.current) {
                const [current] = state.list.filter(row => row.id === state.current?.id);
                state.current = current ?? null;
            }
        })
        .addCase(loadPaypalInvoices.rejected, (state) => {
            state.loading = false;
        })
        .addCase(setCurrentOrder, (state, action) => {
            state.current = action.payload ?? null;
        })
        .addCase(toggleCashApplied, (state, action) => {
            if (state.cashApplied.includes(action.payload)) {
                state.cashApplied = state.cashApplied.filter(id => id !== action.payload).sort();
            } else {
                state.cashApplied = [...state.cashApplied, action.payload].sort();
            }
        })
        .addCase(setCashApplied, (state, action) => {
            state.cashApplied = [
                ...state.cashApplied,
                ...action.payload.filter(id => !state.cashApplied.includes(id))
            ];
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            state.rowsPerPage = action.payload;
            state.page = 0;
        })
        .addCase(setSort, (state, action) => {
            state.sort = action.payload;
            state.page = 0;
        });
});

export default paypalReducer;
