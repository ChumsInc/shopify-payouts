import type {SortProps} from "chums-types";
import Decimal from "decimal.js";
import type {ShopifyPaymentsPayout} from "@/ducks/types.ts";
import dayjs from 'dayjs'


export const payoutsSorter = (sort: SortProps<ShopifyPaymentsPayout>) =>
    (a: ShopifyPaymentsPayout, b: ShopifyPaymentsPayout) => {
        const {field, ascending} = sort;
        const sortMod = ascending ? 1 : -1;
        switch (field) {
            case "net":
                return (!new Decimal(a.net.amount).eq(b.net.amount)
                        ? (a.id.localeCompare(b.id))
                        : (new Decimal(a.net.amount).gt(b.net.amount) ? 1 : -1)
                ) * sortMod;
            case 'issuedAt':
                return (
                    dayjs(a.issuedAt).isSame(dayjs(b.issuedAt), 'day')
                        ? (a.id.localeCompare(b.id))
                        : (dayjs(a.issuedAt).isAfter(dayjs(b.issuedAt)) ? 1 : -1)
                ) * sortMod
            case 'id':
            default:
                return (a[field].toLowerCase() === b[field].toLowerCase()
                        ? (a.id.localeCompare(b.id))
                        : (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1)
                ) * sortMod;
        }
    }

export const defaultPayoutsSort: SortProps<ShopifyPaymentsPayout> = {
    field: 'id',
    ascending: true,
}
