import React from "react";

const inv_url = `/reports/account/invoice/?company=:Company&invoice=:InvoiceNo`;

export interface InvoiceLinkProps {
    InvoiceNo?: string,
    sage_Company?: string,
}
const InvoiceLink:React.FC<InvoiceLinkProps> = ({InvoiceNo, sage_Company}) =>  {
    if (!InvoiceNo || !sage_Company) {
        return null;
    }
    const url = inv_url.replace(':Company', encodeURIComponent(sage_Company))
        .replace(':InvoiceNo', encodeURIComponent(InvoiceNo));
    return (<a href={url} target="_blank">{InvoiceNo}</a>)
}

export default InvoiceLink;
