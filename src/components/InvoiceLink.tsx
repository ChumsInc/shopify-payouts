import React from "react";

const inv_url = `/reports/account/invoice/?company=:Company&invoice=:InvoiceNo`;

export interface InvoiceLinkProps {
    invoiceNo?: string|null,
    sage_Company?: string,
}
const InvoiceLink:React.FC<InvoiceLinkProps> = ({invoiceNo, sage_Company}) =>  {
    if (!invoiceNo || !sage_Company) {
        return null;
    }
    const url = inv_url.replace(':Company', encodeURIComponent(sage_Company))
        .replace(':InvoiceNo', encodeURIComponent(invoiceNo));
    return (<a href={url} target="_blank">{invoiceNo}</a>)
}

export default InvoiceLink;
