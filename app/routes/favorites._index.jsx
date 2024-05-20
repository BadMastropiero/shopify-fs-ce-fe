import {json} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = () => {
  return [{title: `Hydrogen | Favorites`}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, params, context}) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const favAPI = context.env.API_URL;
  const favoritesRes = await fetch(`${favAPI}/favorites`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  let favorites = await favoritesRes.json();
  favorites = favorites.map((f) => f.productId);

  const {nodes} = await storefront.query(PRODUCTS_BY_IDS_QUERY, {
    variables: {ids: favorites, ...paginationVariables},
  });

  return json({nodes});
}

export default function Favorites() {
  /** @type {LoaderReturnData} */
  const {nodes} = useLoaderData();
  return (
    <div className="favorites">
      <h1>Favorites</h1>
      <p className="favorites-description">All times favorite items</p>
      <ProductsGrid products={nodes} />
    </div>
  );
}

/**
 * @param {{products: ProductItemFragment[]}}
 */
function ProductsGrid({products}) {
  return (
    <div className="products-grid">
      {products.map((product, index) => {
        return (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        );
      })}
    </div>
  );
}

/**
 * @param {{
 *   product: ProductItemFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
function ProductItem({product, loading}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {product.featuredImage && (
        <Image
          alt={product.featuredImage.altText || product.title}
          aspectRatio="1/1"
          data={product.featuredImage}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4>{product.title}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;

const PRODUCTS_BY_IDS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query ProductsByIds(
    $ids: [ID!]!
    ) {
    nodes(
      ids: $ids
    ) {
      ... on Product {
        ...ProductItem
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
