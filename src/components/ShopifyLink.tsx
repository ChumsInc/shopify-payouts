import React from "react";

const shopify_url = 'https://chumsinc.myshopify.com/admin/orders/:id';

export interface ShopifyLinkProps {
    id: number,
    name: string,
}
const ShopifyLink:React.FC<ShopifyLinkProps> = ({id, name}) => {
    const url = shopify_url.replace(':id', encodeURIComponent(id));
    return (<a href={url} target="_blank">{name}</a>)
}
export default ShopifyLink;
