import {BootstrapColor} from "chums-components";
import {ExtendedSavedOrder, ShopifyOrder, ShopifyPaymentTransaction} from "chums-types";

export interface ErrorAlert {
    id: number;
    context: string;
    message: string;
    count: number;
    color?: BootstrapColor;
}


export interface TransactionTableFields extends Pick<ShopifyPaymentTransaction, 'type' | 'payout_id' | 'currency' | 'amount' | 'fee' | 'net' | 'order'>,
    Pick<ExtendedSavedOrder, 'sage_SalesOrderNo' | 'id' | 'InvoiceNo' | 'BillToName' | 'OrderStatus' | 'shopify_order'>,
    Pick<ShopifyOrder, 'tags' | 'total_discounts' | 'fulfillment_status' | 'name' | 'email'> {
}
