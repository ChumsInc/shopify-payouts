import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {format} from 'date-fns';
import numeral from 'numeral';

import ShopifyOrderStatus from "../../components/ShopifyOrderStatus";
import ApplyCashCheckbox from "./ApplyCashCheckbox";
import ShopifyLink from "../../components/ShopifyLink";
import SalesOrderLink from "../../components/SalesOrderLink";
import InvoiceLink from "../../components/InvoiceLink";
import {
    selectCashApplied,
    selectCashAppliedTotal,
    selectPaypalOrdersLoading,
    selectSelectedOrder,
    selectSortedPaypalOrders
} from "./selectors";
import {ShopifyCustomer, ShopifyOrder, ShopifyOrderSorterProps} from "../common-types";
import {
    addPageSetAction, PagerDuck,
    selectPagedData,
    selectTableSort,
    SortableTable,
    SortableTableField,
    SpinnerButton,
    tableAddedAction
} from "chums-ducks";
import {applyCashToOrdersAction, fetchPaypalOrdersAction, selectPaypalOrderAction} from "./actions";
import PayPalOrdersFooter from "./PayPalOrdersFooter";


const ReloadButton:React.FC = () => {
    const dispatch = useDispatch();
    const loading = useSelector(selectPaypalOrdersLoading);
    const onReloadOrders = () => dispatch(fetchPaypalOrdersAction());

    return (
        <SpinnerButton type="button" color="primary" size="sm" spinning={loading} onClick={onReloadOrders}>
            Reload
        </SpinnerButton>
    )
}

const renderOrderDate = ({created_at}: ShopifyOrder) => {
    const date = new Date(created_at);
    return (
        <span>
            {format(date, 'MM/dd/yyyy')}
            {' '}
            <small>{format(date, 'hh:mm b')}</small>
        </span>
    )
};

const renderShipping = ({shipping_lines}: ShopifyOrder) => shipping_lines.map(line => line.title).join('; ');


const fieldList: SortableTableField[] = [
    {
        field: 'name',
        title: 'Shopify Order #',
        sortable: true,
        render: (row: ShopifyOrder) => <ShopifyLink id={row.id} name={row.name}/>
    },
    {field: 'created_at', title: 'Date', sortable: true, render: renderOrderDate},
    {
        field: 'CustomerNo',
        title: 'Customer #',
        render: (row: ShopifyOrder) => [row.ARDivisionNo, row.CustomerNo].join('-')
    },
    {
        field: 'customer',
        title: 'Customer',
        sortable: true,
        render: ({customer}: ShopifyOrder) => `${customer.first_name} ${customer.last_name}`,
    },
    {
        field: 'sage_SalesOrderNo',
        title: 'Sage SO #',
        sortable: true,
        render: (row: ShopifyOrder) => <SalesOrderLink {...row} />
    },
    {field: 'InvoiceNo', title: 'Invoice #', sortable: true, render: (row: ShopifyOrder) => <InvoiceLink {...row}/>},
    {
        field: 'fulfillment_status',
        title: 'Status',
        className: 'status-badges',
        sortable: false,
        render: (row: ShopifyOrder) => (<ShopifyOrderStatus {...row}/>)
    },
    {
        field: 'apply',
        title: (<ApplyCashCheckbox id={0}/>),
        render: ({id}: ShopifyOrder) => <ApplyCashCheckbox id={id}/>
    },
    {
        field: 'total_price_usd',
        title: 'Total',
        sortable: true,
        render: (row: ShopifyOrder) => numeral(row.total_price_usd).format('$0,0.00'),
        className: 'right',
    },
];

export const ppOrdersTableID = 'paypal-orders';

const PaypalOrdersList: React.FC = () => {
    const dispatch = useDispatch();
    const sort = useSelector(selectTableSort(ppOrdersTableID)) as ShopifyOrderSorterProps;
    const list = useSelector(selectSortedPaypalOrders(sort));
    const selectedOrder = useSelector(selectSelectedOrder);
    const pagedList = useSelector(selectPagedData(ppOrdersTableID, list));
    const cashApplied = useSelector(selectCashApplied);


    useEffect(() => {
        dispatch(tableAddedAction({key: ppOrdersTableID, field: 'name', ascending: true}))
        dispatch(addPageSetAction({key: ppOrdersTableID, rowsPerPage: 10}));
        dispatch(fetchPaypalOrdersAction());
    }, []);

    const onSelectOrder = (order: ShopifyOrder) => {
        console.log('dispatching selectPaypalOrderAction')
        dispatch(selectPaypalOrderAction(order));
    }

    const onReloadOrders = () => dispatch(fetchPaypalOrdersAction());

    const onSelectAll = () => {
        dispatch(applyCashToOrdersAction([...new Set([...cashApplied, ...pagedList.map(so => so.id)])]));
    }

    return (
        <div>
            <div className="row g-3 mb-1">
                <div className="col-auto">
                    <ReloadButton />
                </div>
                <div className="col-auto">
                    <button className="btn btn-sm btn-outline-secondary" onClick={onSelectAll}>Select All</button>
                </div>
            </div>

            <SortableTable data={pagedList} fields={fieldList} keyField="id" selected={selectedOrder?.id} size="sm"
                           tableKey={ppOrdersTableID} onSelectRow={onSelectOrder}
                           tfoot={(<PayPalOrdersFooter />)}
                           rowClassName={(row) => ({'table-info': cashApplied.includes(row.id)})}/>
            <PagerDuck pageKey={ppOrdersTableID} dataLength={list.length}/>
        </div>
    );
}

export default PaypalOrdersList;
