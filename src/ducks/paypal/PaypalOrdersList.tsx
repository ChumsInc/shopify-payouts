import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {format} from 'date-fns';
import numeral from 'numeral';

import ShopifyOrderStatus from "../../components/ShopifyOrderStatus";
import ApplyCashCheckbox from "./ApplyCashCheckbox";
import ShopifyLink from "../../components/ShopifyLink";
import SalesOrderLink from "../../components/SalesOrderLink";
import InvoiceLink from "../../components/InvoiceLink";
import {
    selectCashApplied,
    selectCurrentOrder,
    selectLoading,
    selectPage,
    selectRowsPerPage,
    selectSort,
    selectSortedList
} from "./selectors";
import {SortableTable, SortableTableField, SpinnerButton, TablePagination} from "chums-components";
import PayPalOrdersFooter from "./PayPalOrdersFooter";
import {ExtendedSavedOrder, ShopifyOrder, SortProps} from "chums-types";
import {loadPaypalInvoices, setCashApplied, setCurrentOrder, setPage, setRowsPerPage, setSort} from "./index";
import {useAppDispatch} from "../../app/configureStore";


const renderOrderDate = (created_at?: string) => {
    if (!created_at) {
        return null;
    }
    const date = new Date(created_at);
    return (
        <span>
            {format(date, 'MM/dd/yyyy')}
            {' '}
            <small>{format(date, 'hh:mm b')}</small>
        </span>
    )
};


const fieldList: SortableTableField[] = [
    {
        field: 'name',
        title: 'Shopify Order #',
        sortable: true,
        render: (row: ExtendedSavedOrder) => <ShopifyLink id={row.shopify_order?.id} name={row.shopify_order?.name}/>
    },
    {
        field: 'created_at',
        title: 'Date',
        sortable: true,
        render: (row: ExtendedSavedOrder) => renderOrderDate(row.shopify_order?.created_at)
    },
    {
        field: 'CustomerNo',
        title: 'Customer #',
        render: (row: ExtendedSavedOrder) => [row.ARDivisionNo, row.CustomerNo].join('-')
    },
    {
        field: 'customer',
        title: 'Customer',
        sortable: true,
        render: (row: ExtendedSavedOrder) => `${row.shopify_order?.customer.first_name ?? ''} ${row.shopify_order?.customer.last_name ?? ''}`,
    },
    {
        field: 'sage_SalesOrderNo',
        title: 'Sage SO #',
        sortable: true,
        render: (row: ExtendedSavedOrder) => <SalesOrderLink sage_SalesOrderNo={row.sage_SalesOrderNo}
                                                             sage_Company={row.sage_Company}/>
    },
    {
        field: 'InvoiceNo',
        title: 'Invoice #',
        sortable: true,
        render: (row: ExtendedSavedOrder) => <InvoiceLink sage_Company={row.sage_Company} invoiceNo={row.InvoiceNo}/>
    },
    {
        field: 'fulfillment_status',
        title: 'Status',
        className: 'status-badges',
        sortable: false,
        render: (row: ExtendedSavedOrder) => (
            <ShopifyOrderStatus fulfillment_status={row.shopify_order?.fulfillment_status}
                                total_discounts={row.shopify_order?.total_discounts} tags={row.shopify_order?.tags}/>)
    },
    {
        field: 'apply',
        title: (<ApplyCashCheckbox id={0}/>),
        render: (row: ExtendedSavedOrder) => <ApplyCashCheckbox id={Number(row.shopify_order?.id ?? 0)}/>
    },
    {
        field: 'total_price_usd',
        title: 'Total',
        sortable: true,
        render: (row: ExtendedSavedOrder) => numeral(row.shopify_order?.total_price ?? '0').format('$0,0.00'),
        className: 'right',
    },
];


const PaypalOrdersList: React.FC = () => {
    const dispatch = useAppDispatch();
    const sort = useSelector(selectSort);
    const list = useSelector(selectSortedList);
    const selectedOrder = useSelector(selectCurrentOrder);
    const page = useSelector(selectPage);
    const rowsPerPage = useSelector(selectRowsPerPage);
    const cashApplied = useSelector(selectCashApplied);
    const loading = useSelector(selectLoading);


    useEffect(() => {
        dispatch(loadPaypalInvoices());
    }, []);

    const onSelectOrder = (order: ExtendedSavedOrder) => {
        dispatch(setCurrentOrder(order));
    }

    const onReloadOrders = () => dispatch(loadPaypalInvoices());

    const onSelectAll = () => {
        const idList = list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => Number(row.id));
        dispatch(setCashApplied(idList))
    }

    const sortChangeHandler = (sort: SortProps) => {
        dispatch(setSort(sort));
    }

    const pageChangeHandler = (page: number) => dispatch(setPage(page));
    const rowsPerPageChangeHandler = (rpp: number) => dispatch(setRowsPerPage(rpp));

    return (
        <div>
            <div className="row g-3 mb-1">
                <div className="col-auto">
                    <SpinnerButton spinning={loading} color="primary" size="sm" onClick={onReloadOrders}>
                        Reload
                    </SpinnerButton>
                </div>
                <div className="col-auto">
                    <button className="btn btn-sm btn-outline-secondary" onClick={onSelectAll}>Select All</button>
                </div>
            </div>

            <SortableTable data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           fields={fieldList}
                           currentSort={sort}
                           onChangeSort={sortChangeHandler}
                           keyField="id" selected={selectedOrder?.id} size="sm"
                           onSelectRow={onSelectOrder}
                           tfoot={(<PayPalOrdersFooter/>)}
                           rowClassName={(row) => ({'table-info': cashApplied.includes(row.id)})}/>
            <TablePagination page={page} onChangePage={pageChangeHandler}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={rowsPerPageChangeHandler}
                             bsSize="sm"
                             count={list.length}/>
        </div>
    );
}

export default PaypalOrdersList;
