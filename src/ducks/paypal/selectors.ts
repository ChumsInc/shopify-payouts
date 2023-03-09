import {RootState} from "../../app/configureStore";
import {ExtendedSavedOrder, SortProps} from "chums-types";
import {createSelector} from "@reduxjs/toolkit";
import Decimal from "decimal.js";

const orderSorter = (sort: SortProps) => (a: ExtendedSavedOrder, b: ExtendedSavedOrder) => {
    const {field, ascending} = sort;
    const sortMod = ascending ? 1 : -1;
    switch (field) {
    case 'name':
    case 'created_at':
    case 'total_price_usd':
        return (
            ((a.shopify_order ?? {})[field] ?? '') === (b.shopify_order ?? {})[field] ?? ''
                ? (Number(a.id) - Number(b.id))
                : (((a.shopify_order ?? {})[field] ?? '') > ((b.shopify_order ?? {})[field] ?? '') ? 1 : -1)
        ) * sortMod;
    case 'InvoiceNo':
    case 'sage_SalesOrderNo':
        return ((a[field] ?? '') === (b[field] ?? '')
            ? Number(a.id) - Number(b.id)
            : (a[field] ?? '') > (b[field] ?? '') ? 1 : -1) * sortMod;
    default:
        return (Number(a.id) - Number(b.id)) * sortMod;
    }
}

export const selectList = (state: RootState) => state.paypal.list;
export const selectSort = (state: RootState) => state.paypal.sort;
export const selectLoading = (state: RootState): boolean => state.paypal.loading;
export const selectCurrentOrder = (state: RootState): ExtendedSavedOrder | null => state.paypal.current;
export const selectCashApplied = (state: RootState): number[] => state.paypal.cashApplied;
export const selectOrderCashApplied = (state: RootState, id: number): boolean => state.paypal.cashApplied.includes(id);
export const selectPage = (state: RootState) => state.paypal.page;
export const selectRowsPerPage = (state: RootState) => state.paypal.rowsPerPage;

export const selectSortedList = createSelector(
    [selectList, selectSort],
    (list, sort) => {
        return [...list].sort(orderSorter(sort));
    }
)

export const selectCashAppliedTotal = createSelector(
    [selectList, selectCashApplied],
    (list, cashApplied) => {
        return list.filter(so => cashApplied.includes(Number(so.id)))
            .map(so => new Decimal(so.shopify_order?.total_price ?? 0))
            .reduce((pv, cv) => pv.add(cv), new Decimal(0))
            .toString();
    }
)
