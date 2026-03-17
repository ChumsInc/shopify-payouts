const shopify_url = 'https://chumsinc.myshopify.com/admin/orders/:id';

export interface ShopifyLinkProps {
    id: string | null,
}

const ShopifyLink = ({id}: ShopifyLinkProps) => {
    if (!id) {
        return null;
    }
    if (id.startsWith('gid://shopify/Order/')) {
        id = id.replace('gid://shopify/Order/', '');
    }
    const url = shopify_url.replace(':id', encodeURIComponent(id));
    return (<a href={url} target="_blank">{id}</a>)
}
export default ShopifyLink;
