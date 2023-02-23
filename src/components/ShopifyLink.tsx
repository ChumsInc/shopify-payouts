import React from "react";

const shopify_url = 'https://chumsinc.myshopify.com/admin/orders/:id';

export interface ShopifyLinkProps {
    id?: number|string|null,
    name?: string|null,
}
const ShopifyLink:React.FC<ShopifyLinkProps> = ({id, name}) => {
    if (!id) {
        return null;
    }

    const url = shopify_url.replace(':id', encodeURIComponent(id));
    return (<a href={url} target="_blank">{name ?? id}</a>)
}
export default ShopifyLink;
