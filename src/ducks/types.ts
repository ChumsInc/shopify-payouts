import type {
    ExtendedSavedOrder,
    PayoutBalanceTransaction,
    ShopifyOrder,
    ShopifyPaymentTransaction
} from "chums-types/shopify";

export interface TransactionTableRow extends Pick<ShopifyPaymentTransaction, 'type' | 'payout_id' | 'currency' | 'amount' | 'fee' | 'net' | 'order'>,
    Pick<ExtendedSavedOrder, 'sage_SalesOrderNo' | 'id' | 'InvoiceNo' | 'BillToName' | 'OrderStatus' | 'shopify_order'>,
    Pick<ShopifyOrder, 'tags' | 'total_discounts' | 'fulfillment_status' | 'name' | 'email'> {
}

export interface Money {
    amount: number;
    currencyCode: string;
}

export interface ShopifyPaymentsPayout {
    id: string;
    issuedAt: string;
    net: Money;
    status: string;
    legacyResourceId: string;
}

export interface ShopifyPaymentsBalanceTransactionAssociatedPayout {
    id: string;
}

export interface ShopifyPaymentsBalanceTransaction {
    id: string;
    type: string;
    associatedPayout: ShopifyPaymentsBalanceTransactionAssociatedPayout;
    transactionDate: string;
    associatedOrder: ShopifyPaymentsAssociatedOrder|null;
    net: Money;
    amount: Money;
    fee: Money;
    test: boolean;
}

export interface ShopifyPaymentsAssociatedOrder {
    id: string;
    name: string;
}

export interface PayoutBalanceTransactionRow extends PayoutBalanceTransaction {
    "status.fulfillmentStatus"?: string|null;
    "status.hasDiscount"?: boolean;
    "status.tags"?: string;
    "response.net.amount"?: string;
    "response.fee.amount"?: string;
    "response.amount.amount"?: string;
}

export interface PayoutTransactionsResponse {
    payout: ShopifyPaymentsPayout|null;
    transactions: PayoutBalanceTransaction[];
}

export interface TransactionsTotal {
    count: number;
    amount: number | string;
    fee: number | string;
    net: number | string;
}
