import type {ExtendedSavedOrder} from "chums-types";
import {fetchJSON} from "@chumsinc/ui-utils";
import type {PayoutTransactionsResponse, ShopifyPaymentsPayout} from "@/ducks/types.ts";

export async function fetchPayouts(): Promise<ShopifyPaymentsPayout[]> {
    try {
        const url = '/api/shopify/graphql/query/payments/payouts/current.json';
        const res = await fetchJSON<{ payouts: ShopifyPaymentsPayout[] }>(url, {cache: 'no-cache'});
        return res?.payouts ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchPayouts()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchPayouts()", err);
        return Promise.reject(new Error('Error in fetchPayouts()'));
    }
}

export async function postPayoutComplete(id: number | string): Promise<ShopifyPaymentsPayout[]> {
    try {
        const url = `/api/shopify/payments/payouts/complete/${encodeURIComponent(id)}.json`;
        const res = await fetchJSON<{ payouts: ShopifyPaymentsPayout[] }>(url, {method: 'POST'});
        return res?.payouts ?? []
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("putPayoutComplete()", err.message);
            return Promise.reject(err);
        }
        console.debug("putPayoutComplete()", err);
        return Promise.reject(new Error('Error in putPayoutComplete()'));
    }
}

export async function fetchPayoutTransactions(arg: number | string): Promise<PayoutTransactionsResponse | null> {
    try {
        const url = '/api/shopify/graphql/query/payments/payouts/:id/transactions.json'
            .replace(':id', encodeURIComponent(arg));
        const res = await fetchJSON<PayoutTransactionsResponse>(url, {cache: 'no-cache'});
        return res ?? null
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
        const url = '/api/shopify/payments/paypal.json';
        const res = await fetchJSON<{ orders: ExtendedSavedOrder[] }>(url, {cache: 'no-cache'});
        return res?.orders ?? [];
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
        const res = await fetchJSON<{ order: ExtendedSavedOrder }>(url, {cache: 'no-cache'});
        return res?.order ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchOrder()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchOrder()", err);
        return Promise.reject(new Error('Error in fetchOrder()'));
    }
}
