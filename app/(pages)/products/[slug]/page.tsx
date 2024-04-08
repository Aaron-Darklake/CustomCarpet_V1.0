import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'


import fetchedProducts from '../../../../content/index/products.json'
import classes from './index.module.scss'



import { Product, Product as ProductType } from '../../../../components/types/product-type'
import { Blocks } from '../../../../components/sections/Blocks'
import { ProductHero } from '../../../../components/heros/Product'
import { generateMeta } from '../../../../components/utils/generateMeta'

import config from '../../../../amplifyconfiguration.json';
import { Amplify } from 'aws-amplify'
import cookieBasedClient from '@/components/config/cookiebased-client'
Amplify.configure(config, {
  ssr: true
});


// Force this page to be dynamic so that Next.js does not cache it
// See the note in '../../../[slug]/page.tsx' about this
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'

interface Params {
  slug: string;
}

interface ProductPageProps {
  params: Params;
}

const product = async ({ params }: ProductPageProps) => {
  const { isEnabled: isDraftMode } = draftMode()
  const { slug } = params;

  let product: any | null = null

  try {
    const {data: fetchedProduct} = await cookieBasedClient.models.Product.list();

    product = fetchedProduct.find(product => product.slug === slug) || null;
    console.log('fetchedProduct:', fetchedProduct)
    if (product) {
      // Fetch related products details
      const relatedProductsPromises = product.relatedProducts.map(async (productId) => {
        const { data: relatedProduct } = await cookieBasedClient.models.Product.get({ id: productId, authMode:'apiKey'  });
        return relatedProduct;
      });
      const relatedProductsDetails = await Promise.all(relatedProductsPromises);
      product.relatedProducts = relatedProductsDetails;
    }
    

  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  if (!product) {
    notFound()
  }
  console.log('product:', product)

  const  relatedProducts  = product.relatedProducts
  console.log('related products:',  JSON.stringify(relatedProducts))
  return (
    <div className={classes.home}>
      <ProductHero product={product} />
      <Blocks
        disableTopPadding
        blocks={[
          {
            blockType: 'relatedProducts',
            blockName: 'Related Product',
            relationTo: 'products',
            introContent: [
              {
                type: 'h3',
                children: [
                  {
                    text: 'Related Products',
                  },
                ],
              },
            ],
            docs: relatedProducts || undefined,
          },
        ]}
      />
    </div>
  )
}

export default product




export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode()
  const { slug } = params;

  let product: Product | null = null

  try {
    product = fetchedProducts.find(product => product.slug === slug) || null;
  } catch (error) {}

  return generateMeta({ doc: product as ProductType })
}

export async function generateStaticParams() {
  // Map over your products to return an array of params objects
 
  const params = fetchedProducts.map((product) => {
    return { slug: JSON.stringify(product.slug) };
  });
  
  return params;
}