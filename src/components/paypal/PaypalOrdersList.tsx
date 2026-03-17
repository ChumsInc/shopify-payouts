import {useEffect, useState} from 'react';
import numeral from 'numeral';
import ShopifyOrderStatus from "../ShopifyOrderStatus.tsx";
import ApplyCashCheckbox from "./ApplyCashCheckbox.tsx";
import ShopifyLink from "../ShopifyLink.tsx";
import SalesOrderLink from "../SalesOrderLink.tsx";
import InvoiceLink from "../InvoiceLink.tsx";
import {
    selectCashApplied,
    selectCurrentOrder,
    selectPaypalStatus,
    selectSort,
    selectSortedList,
    setCashApplied,
    setCurrentOrder,
    setSort
} from "@/ducks/paypal/paypalSlice.ts";
import PayPalOrdersFooter from "./PayPalOrdersFooter.tsx";
import type {ExtendedSavedOrder, SortProps} from "chums-types";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import dayjs from "dayjs";
import {SortableTable, type SortableTableField, TablePagination} from "@chumsinc/sortable-tables";
import {Button, ProgressBar} from "react-bootstrap";
import {loadPaypalInvoices} from "@/ducks/paypal/actions.ts";
import Decimal from "decimal.js";


const renderOrderDate = (created_at?: string) => {
    if (!created_at) {
        return null;
    }
    const date = new Date(created_at);
    return (
        <span>
            {dayjs(date).format('MM/DD/YYYY')}
            {' '}
            <small>{dayjs(date).format('hh:mm a')}</small>
        </span>
    )
};


const fieldList: SortableTableField<ExtendedSavedOrder>[] = [
    {
        field: 'id',
        title: 'Shopify Order #',
        sortable: true,
        render: (row: ExtendedSavedOrder) => <ShopifyLink id={row.id.toString() ?? null}/>
    },
    {
        field: 'created_at',
        title: 'Date',
        sortable: true,
        render: (row: ExtendedSavedOrder) => renderOrderDate(row.graphqlOrder?.createdAt ?? row.shopify_order?.created_at)
    },
    {
        field: 'CustomerNo',
        title: 'Customer #',
        render: (row: ExtendedSavedOrder) => [row.ARDivisionNo, row.CustomerNo].join('-')
    },
    {
        field: 'BillToName',
        title: 'Customer',
        sortable: true,
        render: (row: ExtendedSavedOrder) => row.graphqlOrder?.billingAddress?.name ?? `${row.shopify_order?.customer.first_name ?? ''} ${row.shopify_order?.customer.last_name ?? ''}`,
    },
    {
        field: 'sage_SalesOrderNo',
        title: 'Sage SO #',
        sortable: true,
        render: (row: ExtendedSavedOrder) => <SalesOrderLink salesOrderNo={row.sage_SalesOrderNo}/>
    },
    {
        field: 'InvoiceNo',
        title: 'Invoice #',
        sortable: true,
        render: (row: ExtendedSavedOrder) => <InvoiceLink invoiceNo={row.InvoiceNo}/>
    },
    {
        field: 'import_status',
        title: 'Status',
        className: 'status-badges',
        sortable: false,
        render: (row: ExtendedSavedOrder) => (
            <ShopifyOrderStatus fulfillment_status={row.graphqlOrder?.displayFulfillmentStatus ?? row.shopify_order?.fulfillment_status}
                                has_discount={new Decimal(row.graphqlOrder?.totalDiscountsSet?.shopMoney?.amount ?? row.shopify_order?.total_discounts ?? 0).gt(0)}
                                tags={row.graphqlOrder?.tags?.join(', ') ?? row.shopify_order?.tags}/>)
    },
    {
        field: 'id',
        title: (<ApplyCashCheckbox id={null}/>),
        render: (row: ExtendedSavedOrder) => <ApplyCashCheckbox id={row.id ?? null}/>
    },
    {
        field: 'shopify_order',
        title: 'Total',
        sortable: true,
        render: (row: ExtendedSavedOrder) => numeral(row.graphqlOrder?.currentTotalPriceSet?.shopMoney?.amount ?? row.shopify_order?.total_price ?? '0').format('$0,0.00'),
        className: 'right',
    },
];


const PaypalOrdersList = () => {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectPaypalStatus);
    const sort = useAppSelector(selectSort);
    const list = useAppSelector(selectSortedList);
    const selectedOrder = useAppSelector(selectCurrentOrder);
    const cashApplied = useAppSelector(selectCashApplied);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(loadPaypalInvoices());
    }, [dispatch]);

    useEffect(() => {
        setPage(0);
    }, [status]);

    const onSelectOrder = (order: ExtendedSavedOrder) => {
        dispatch(setCurrentOrder(order));
    }

    const onReloadOrders = () => dispatch(loadPaypalInvoices());

    const onSelectAll = () => {
        const idList = list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(row => String(row.id));
        dispatch(setCashApplied(idList))
    }

    const sortChangeHandler = (sort: SortProps<ExtendedSavedOrder>) => {
        dispatch(setSort(sort));
    }

    const pageChangeHandler = (page: number) => {
        setPage(page);
    };
    const rowsPerPageChangeHandler = (rpp: number) => {
        setRowsPerPage(rpp);
        setPage(0);
    }

    return (
        <div className="mt-1">
            <div className="row g-3 mb-1 align-items-center">
                <div className="col-auto">
                    <Button variant="primary" size="sm" onClick={onReloadOrders}>
                        Reload
                    </Button>
                </div>
                <div className="col-auto">
                    <button className="btn btn-sm btn-outline-secondary" onClick={onSelectAll}>Select All</button>
                </div>
                <div className="col">
                    {status === 'loading' && <ProgressBar now={100} striped animated label="Loading..."/>}
                </div>
            </div>

            <SortableTable data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           fields={fieldList}
                           currentSort={sort}
                           onChangeSort={sortChangeHandler}
                           keyField="id" selected={selectedOrder?.id} size="sm"
                           onSelectRow={onSelectOrder}
                           tfoot={(<PayPalOrdersFooter/>)}
                           rowClassName={(row) => ({'table-info': cashApplied[String(row.id)]})}/>
            <TablePagination page={page} onChangePage={pageChangeHandler}
                             rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: rowsPerPageChangeHandler}}
                             showFirst showLast
                             size="sm"
                             count={list.length}/>
        </div>
    );
}

export default PaypalOrdersList;
