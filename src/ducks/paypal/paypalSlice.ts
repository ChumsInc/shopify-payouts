import type {ExtendedSavedOrder, SortProps} from "chums-types";
import {createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {loadPaypalInvoices} from "@/ducks/paypal/actions.ts";
import {orderSorter} from "@/ducks/paypal/utils.ts";
import Decimal from "decimal.js";

const adapter = createEntityAdapter<ExtendedSavedOrder, string>({
    selectId: (arg) => String(arg.id),
    sortComparer: (a, b) => String(a.id).localeCompare(String(b.id)),
})

const selectors = adapter.getSelectors();


export interface PaypalState {
    status: 'idle' | 'loading' | 'rejected';
    current: ExtendedSavedOrder | null;
    cashApplied: Record<string, boolean>;
    sort: SortProps<ExtendedSavedOrder>
}

export const initialPaypalState: PaypalState = {
    status: "idle",
    current: null,
    cashApplied: {},
    sort: {field: 'sage_SalesOrderNo', ascending: true},
}

const paypalSlice = createSlice({
    name: 'paypal',
    initialState: adapter.getInitialState(initialPaypalState),
    reducers: {
        setSort: (state, action: { payload: SortProps<ExtendedSavedOrder> }) => {
            state.sort = action.payload;
        },
        setCurrentOrder: (state, action: PayloadAction<ExtendedSavedOrder | null | undefined>) => {
            state.current = action.payload ?? null;
        },
        toggleCashApplied: (state, action: PayloadAction<string>) => {
            state.cashApplied[action.payload] = !state.cashApplied[action.payload];
        },
        setCashApplied: (state, action: PayloadAction<string[]>) => {
            action.payload.forEach(id => {
                state.cashApplied[id] = true;
            });
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadPaypalInvoices.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loadPaypalInvoices.fulfilled, (state, action) => {
                state.status = 'idle';
                adapter.setAll(state, action.payload);
                state.cashApplied = {};
                action.payload.forEach((so) => {
                    state.cashApplied[String(so.id)] = false;
                })

                if (state.current) {
                    const [current] = action.payload.filter(row => row.id === state.current?.id);
                    state.current = current ?? null;
                }
            })
            .addCase(loadPaypalInvoices.rejected, (state) => {
                state.status = 'rejected';
            })
    },
    selectors: {
        selectPaypalList: (state) => selectors.selectAll(state),
        selectPaypalStatus: (state) => state.status,
        selectCurrentOrder: (state) => state.current,
        selectCashApplied: (state) => state.cashApplied,
        selectSort: (state) => state.sort,
    }
})

export const {setCashApplied, toggleCashApplied, setCurrentOrder, setSort} = paypalSlice.actions;
export const {
    selectPaypalStatus,
    selectPaypalList,
    selectCurrentOrder,
    selectCashApplied,
    selectSort
} = paypalSlice.selectors;


export const selectSortedList = createSelector(
    [selectPaypalList, selectSort],
    (list, sort) => {
        return [...list].sort(orderSorter(sort));
    }
)

export const selectCashAppliedTotal = createSelector(
    [selectPaypalList, selectCashApplied],
    (list, cashApplied) => {
        return list.filter(so => cashApplied[String(so.id)])
            .map(so => new Decimal(so.shopify_order?.total_price ?? 0))
            .reduce((pv, cv) => pv.add(cv), new Decimal(0))
            .toString();
    }
)

export const selectCashAppliedCount = createSelector(
    [selectPaypalList, selectCashApplied],
    (list, cashApplied) => {
        return list.filter(so => cashApplied[String(so.id)]).length;
    }
)


export default paypalSlice;
