import {SortableTableField, SorterProps} from "chums-ducks";
import {EmptyObject} from "redux";

export interface ShopifyCustomer {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
}

export interface ShopifyLineItem {
    id:number,
    quantity: number,
    price: string,
    price_set: ShopifyPriceSet,
    sku: string,
    name: string,
    gift_card: boolean,
    total_discount: string,
    total_discount_set: ShopifyPriceSet,
}

export interface ShopifyShippingLine {
    code: string,
    title: string,
    price_set:ShopifyPriceSet,
}
export interface ShopifyMoney {
    amount: string,
    currency_code: string,
}
export interface ShopifyPriceSet {
    presentment_money: ShopifyMoney,
    shop_money: ShopifyMoney,
}

export interface ShopifyTaxLine {
    title: string,
    price_set: ShopifyPriceSet,
}

export interface ImportResult {
    error: string,
}

export interface ShopifyOrder {
    id: number,
    name: string,
    created_at: string,
    ARDivisionNo: string,
    CustomerNo: string,
    customer: ShopifyCustomer,
    line_items: ShopifyLineItem[],
    subtotal_price: string,
    shipping_lines: ShopifyShippingLine[],
    total_shipping_price_set: ShopifyPriceSet,
    tax_lines: ShopifyTaxLine[],
    total_price: string,
    total_discounts: string,
    total_line_items_price: string,
    import_result: ImportResult,
    order_status_url: string,
    import_status: string,
    sage_Company: string,
    sage_SalesOrderNo: string,
    InvoiceNo: string,
    financial_status: string,
    gateway: string,
    tags: string,
    fulfillment_status: string|null,
    processed_at: string,
    total_price_usd: string,
}

export type ShopifyOrderField = keyof ShopifyOrder;

export interface ShopifyOrderSorterProps extends SorterProps {
    field: ShopifyOrderField,
}

export interface ShopifyPayout {
    id: number,
    currency: string,
    date: string,
    amount: string,
    status: string,
}
export type ShopifyPayoutField = keyof ShopifyPayout;
export interface ShopifyPayoutTableField extends SortableTableField {
    field: keyof ShopifyPayout
}

export interface ShopifyTransaction {
    id: number,
    type: string,
    test: boolean,
    payout_id: number,
    payout_status: string,
    currency: string,
    amount: string,
    fee: string,
    net: string,
    source_id: number,
    source_type: string,
    source_order_id: number|null,
    source_order_transaction_id: number|null,
    processed_at: string,
    order: ShopifyOrder|null,
}

export type ShopifyTransactionField = keyof ShopifyTransaction;

export interface ShopifyTransactionTableField extends SortableTableField {
    field: keyof ShopifyTransaction | 'customer' | 'name' | 'invoice' | 'SalesOrderNo',
}

export interface ShopifyTransactionSortProps extends SorterProps {
    field: keyof ShopifyTransaction | 'customer' | 'name' | 'invoice' | 'SalesOrderNo',
}
