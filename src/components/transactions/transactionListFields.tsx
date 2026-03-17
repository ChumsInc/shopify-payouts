import type {SortableTableField} from "@chumsinc/sortable-tables";
import type {PayoutBalanceTransactionRow} from "@/ducks/types.ts";
import ShopifyLink from "@/components/ShopifyLink.tsx";
import SalesOrderLink from "@/components/SalesOrderLink.tsx";
import InvoiceLink from "@/components/InvoiceLink.tsx";
import ShopifyOrderStatus from "@/components/ShopifyOrderStatus.tsx";
import numeral from "numeral";
import dayjs from "dayjs";

export const transactionListFields: SortableTableField<PayoutBalanceTransactionRow>[] = [
    {field: 'type', title: 'Type', sortable: true},
    {
        field: 'id',
        title: 'Shopify Order #',
        render: row => (<ShopifyLink id={row.associatedOrderId ?? null}/>),
        sortable: true
    },
    {
        field: 'transactionDate',
        title: 'Tx Date',
        className: 'text-secondary',
        render: (row) => dayjs(row.transactionDate).format('MM/DD, hh:mm a')
    },
    {
        field: 'sage_SalesOrderNo',
        title: 'Sage SO #',
        render: row => <SalesOrderLink salesOrderNo={row.sage_SalesOrderNo ?? null}/>,
        sortable: true
    },
    {
        field: 'emailAddress',
        title: 'Email',
        render: row => row.emailAddress,
        sortable: true
    },
    {
        field: 'invoiceNo',
        title: 'Invoice #',
        render: row => row.status.refunded ? 'REFUNDED' : <InvoiceLink invoiceNo={row.invoiceNo}/>,
        sortable: true
    },
    {
        field: 'billToName',
        title: 'Name',
        render: row => row.billToName,
        sortable: true
    },
    {
        field: 'status.fulfillmentStatus',
        title: 'Status',
        render: (row) => (<ShopifyOrderStatus fulfillment_status={row.status.fulfillmentStatus}
                                              tags={row.status.tags}
                                              has_discount={row.status.hasDiscount}/>)
    },
    {
        field: 'response.amount.amount',
        title: 'Amount',
        align: 'end',
        sortable: true,
        render: (row) => numeral(row.response.amount.amount).format('0,0.00')
    },
    {
        field: 'response.fee.amount',
        title: 'Fee',
        align: 'end',
        sortable: true,
        render: (row) => numeral(row.response.fee.amount).format('0,0.00')
    },
    {
        field: 'response.net.amount',
        title: 'Amount',
        align: 'end',
        sortable: true,
        render: (row) => numeral(row.response.net.amount).format('0,0.00')
    },
];
