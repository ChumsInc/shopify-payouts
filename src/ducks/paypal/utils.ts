import type {ExtendedSavedOrder, SortProps} from "chums-types";

export const orderSorter = (sort: SortProps<ExtendedSavedOrder>) => (a: ExtendedSavedOrder, b: ExtendedSavedOrder) => {
    const {field, ascending} = sort;
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        // case 'name':
        // case 'created_at':
        // case 'total_price_usd':
        //     return (
        //         ((a.shopify_order ?? {})[field] ?? '') === (b.shopify_order ?? {})[field] ?? ''
        //             ? (Number(a.id) - Number(b.id))
        //             : (((a.shopify_order ?? {})[field] ?? '') > ((b.shopify_order ?? {})[field] ?? '') ? 1 : -1)
        //     ) * sortMod;
        case 'InvoiceNo':
        case 'sage_SalesOrderNo':
            return ((a[field] ?? '') === (b[field] ?? '')
                ? Number(a.id) - Number(b.id)
                : (a[field] ?? '') > (b[field] ?? '') ? 1 : -1) * sortMod;
        default:
            return (Number(a.id) - Number(b.id)) * sortMod;
    }
}
