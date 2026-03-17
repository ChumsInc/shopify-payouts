const so_url = `/reports/account/salesorder/?company=chums&salesorderno=:salesOrderNo`;

export interface SalesOrderLinkProps {
    salesOrderNo: string | null,
}

const SalesOrderLink = ({salesOrderNo}: SalesOrderLinkProps) => {
    if (!salesOrderNo) {
        return null;
    }
    const url = so_url.replace(':salesOrderNo', encodeURIComponent(salesOrderNo));
    return (<a href={url} target="_blank">{salesOrderNo}</a>)
}

export default SalesOrderLink;
