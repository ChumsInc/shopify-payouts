const inv_url = `/reports/account/invoice/?company=chums&invoice=:InvoiceNo`;

export interface InvoiceLinkProps {
    invoiceNo: string | null,
}

const InvoiceLink = ({invoiceNo}: InvoiceLinkProps) => {
    if (!invoiceNo) {
        return null;
    }
    const url = inv_url.replace(':InvoiceNo', encodeURIComponent(invoiceNo));
    return (<a href={url} target="_blank">{invoiceNo}</a>)
}

export default InvoiceLink;
