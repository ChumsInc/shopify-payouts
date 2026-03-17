import type {PayoutBalanceTransaction, ShopifyPaymentTransaction} from "chums-types/shopify";
import type {PayoutBalanceTransactionRow, TransactionsTotal} from "@/ducks/types.ts";
import type {SortProps} from "chums-types";
import Decimal from "decimal.js";

export const transactionTableSorter = (sort: SortProps<PayoutBalanceTransactionRow>) =>
    (a: PayoutBalanceTransaction, b: PayoutBalanceTransaction) => {
        const {field, ascending} = sort;
        const sortMod = ascending ? 1 : -1;
        switch (field) {
            case 'type':
                return (
                    a.type === b.type
                        ? String(a.id).localeCompare(String(b.id))
                        : (a.type > b.type ? 1 : -1)
                ) * sortMod;
            case 'associatedOrderId':
            case 'sage_SalesOrderNo':
            case 'emailAddress':
            case 'invoiceNo':
                return (
                    (a[field] ?? '') === (b[field] ?? '')
                        ? a.id.localeCompare(b.id)
                        : (a[field] ?? '').localeCompare((b[field] ?? ''))
                ) * sortMod;

            default:
                return (String(a.id).localeCompare(String(b.id))) * sortMod;
        }
    }

export const transactionSorter = (a: ShopifyPaymentTransaction, b: ShopifyPaymentTransaction) => {
    return a.id > b.id ? 1 : -1;
}

export const totalReducer = (list: PayoutBalanceTransaction[]): TransactionsTotal => {
    return list
        .filter(row => row.type !== 'TRANSFER')
        .reduce((total, row) => {
            return {
                count: total.count + 1,
                amount: new Decimal(total.amount).add(row.response.amount.amount ?? 0).toString(),
                fee: new Decimal(total.fee).add(row.response.fee.amount ?? 0).toString(),
                net: new Decimal(total.net).add(row.response.net.amount ?? 0).toString(),
            }
        }, {
            count: 0,
            amount: 0,
            fee: 0,
            net: 0,
        } as TransactionsTotal);
}
