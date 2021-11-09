import React from "react";

const so_url = `/reports/account/salesorder/?company=:Company&salesorderno=:SalesOrderNo`;

export interface SalesOrderLinkProps {
    sage_SalesOrderNo?: string,
    sage_Company?: string,
}
const SalesOrderLink:React.FC<SalesOrderLinkProps> = ({sage_SalesOrderNo, sage_Company}) => {
    if (!sage_SalesOrderNo || !sage_Company) {
        return null;
    }
    const url = so_url.replace(':Company', encodeURIComponent(sage_Company))
        .replace(':SalesOrderNo', encodeURIComponent(sage_SalesOrderNo));
    return (<a href={url} target="_blank">{sage_SalesOrderNo}</a>)
}

export default SalesOrderLink;
