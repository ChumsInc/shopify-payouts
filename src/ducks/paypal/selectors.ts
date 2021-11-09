import {RootState} from "../index";
import {ShopifyOrder, ShopifyOrderSorterProps} from "../common-types";

const orderSorter = (sort: ShopifyOrderSorterProps) => (a: ShopifyOrder, b: ShopifyOrder) => {
    let aVal = a[sort.field] || '';
    let bVal = b[sort.field] || '';
    if (sort.field === 'customer') {
        aVal = `${a.customer.first_name} ${a.customer.last_name}`.toLowerCase().trim();
        bVal = `${b.customer.first_name} ${b.customer.last_name}`.toLowerCase().trim();
    }
    return (
        aVal === bVal
            ? a.id - b.id
            : (aVal > bVal ? 1 : -1)
    ) * (sort.ascending ? 1 : -1);
}

export const selectPaypalOrdersList = (state: RootState) => state.paypal.list;

export const selectSortedPaypalOrders = (sort: ShopifyOrderSorterProps) => (state: RootState): ShopifyOrder[] => {
    return state.paypal.list.sort(orderSorter(sort));
}

export const selectPaypalOrdersLoading = (state: RootState): boolean => state.paypal.loading;

export const selectSelectedOrder = (state: RootState): ShopifyOrder | null => state.paypal.selected.order;
export const selectSelectedLoading = (state: RootState): boolean => state.paypal.selected.loading;

export const selectCashApplied = (state: RootState): number[] => state.paypal.cashApplied;
export const selectOrderCashApplied = (id:number) => (state: RootState): boolean => state.paypal.cashApplied.includes(id);

export const selectCashAppliedTotal = (state: RootState): number => {
    const cashApplied = selectCashApplied(state);
    const list = selectPaypalOrdersList(state);
    return list.filter(so => cashApplied.includes(so.id))
        .map(so => Number(so.total_price_usd))
        .reduce((pv, cv) => pv + cv, 0);
}
