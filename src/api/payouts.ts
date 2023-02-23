import {ExtendedSavedOrder, ShopifyPayment, ShopifyPaymentTransaction} from "chums-types";
import {fetchJSON} from "chums-components";

export async function fetchPayouts(): Promise<ShopifyPayment[]> {
    try {
        const url = '/api/shopify/payments/payouts';
        const {payouts} = await fetchJSON<{ payouts: ShopifyPayment[] }>(url);
        return payouts ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchPayouts()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchPayouts()", err);
        return Promise.reject(new Error('Error in fetchPayouts()'));
    }
}

export async function postPayoutComplete(id: number): Promise<ShopifyPayment[]> {
    try {
        const url = `/api/shopify/payments/payouts/complete/${encodeURIComponent(id)}`;
        const {payouts} = await fetchJSON<{ payouts: ShopifyPayment[] }>(url, {method: 'POST'});
        return payouts ?? []
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("putPayoutComplete()", err.message);
            return Promise.reject(err);
        }
        console.debug("putPayoutComplete()", err);
        return Promise.reject(new Error('Error in putPayoutComplete()'));
    }
}

export async function fetchPayoutTransactions(arg: number | string): Promise<ShopifyPaymentTransaction[]> {
    try {
        const url = '/api/shopify/payments/payouts/:id'
            .replace(':id', encodeURIComponent(arg));
        const {transactions} = await fetchJSON<{ transactions: ShopifyPaymentTransaction[] }>(url, {cache: 'no-cache'});
        return transactions ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchPayoutTransactions()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchPayoutTransactions()", err);
        return Promise.reject(new Error('Error in fetchPayoutTransactions()'));
    }
}


export async function fetchPaypalInvoices(): Promise<ExtendedSavedOrder[]> {
    try {
        const url = '/api/shopify/payments/paypal';
        const {orders} = await fetchJSON<{ orders: ExtendedSavedOrder[] }>(url, {cache: 'no-cache'});
        return orders ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchPaypalInvoices()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchPaypalInvoices()", err);
        return Promise.reject(new Error('Error in fetchPaypalInvoices()'));
    }
}

export async function fetchOrder(arg: number | string): Promise<ExtendedSavedOrder | null> {
    try {
        const url = '/api/shopify/orders/:id'
            .replace(':id', encodeURIComponent(arg));
        const {order} = await fetchJSON<{ order: ExtendedSavedOrder }>(url, {cache: 'no-cache'});
        return order ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchOrder()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchOrder()", err);
        return Promise.reject(new Error('Error in fetchOrder()'));
    }
}
