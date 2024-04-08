import React, { Fragment } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'





import classes from './index.module.scss'
import { Media } from '@/components/blocks/Media'
import { Price } from '@/components/blocks/Price'
import cookieBasedClient from '@/components/config/cookiebased-client'
import { getUrl } from 'aws-amplify/storage'
import Icon from '@/components/utils/icon.util'

export default async function Order({ params: { id } }) {
 

  let order
  let items

  const {data: ordersData, errors} = await cookieBasedClient.models.Order.get({id: id},{authMode:'userPool'})
  const {data, errors: errors2} = await ordersData.items()
  items = data
  order = ordersData
  const itemsWithProducts = await Promise.all(
    data.map(async item => {
      if (typeof item.product === 'string') {
        const { data: productData } = await cookieBasedClient.models.Product.get({ id: item.product });
        let imageUrl = null;

        if (productData.images && productData.images.length > 0) {
          const { data: image } = await cookieBasedClient.models.Media.get({ id: productData.images[0] });
          if (image && image.url) {
            const {url: urlObj} = await getUrl({ key: image.url });
            imageUrl = urlObj.href;
          }
        }

        return { 
          ...item, 
          product: {
            ...productData,
            meta: {
              ...productData.meta,
              image: imageUrl
            }
          }
        };
      
      }
      return item;
    })
  );

  items = itemsWithProducts;

  console.log('items', items)


  if (!order) {
    notFound()
  }

  return (
    <div className={classes.orderContainer}>
      <div className={classes.orderContainer_header_wrapper}>
        <h1>Order details</h1>
        <Link href='/account/orders'>
          <Icon icon={['fas', 'cancel']}/>
          Back to overview
        </Link>
      </div>
      <div className={classes.itemMeta}>
        <p>{`ID: ${order.id}`}</p>
        <p>{`Payment Intent: ${order?.stripePaymentIntentID}`}</p>
        <p>{`Ordered On: ${order.createdAt}`}</p>
        <p className={classes.total}>
          {'Total: '}
          {new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'eur',
          }).format(order.total / 100)}
        </p>
      </div>

      <div className={classes.order}>
        {items?.map((item, index) => {
          if (typeof item.product === 'object') {
            const {
              quantity,
              product,
              product: { id, title, meta, stripeProductID },
            } = item
            console.log('meta', meta)
            const metaImage = meta.image

            return (
              <Fragment key={index}>
                <div className={classes.row}>
                  <Link href={`/products/${product.slug}`} className={classes.mediaWrapper}>
                    {!metaImage && <span className={classes.placeholder}>No image</span>}
                    {metaImage && typeof metaImage === 'string' && (
                      <Media
                        className={classes.media}
                        imgClassName={classes.image}
                        resource={metaImage}
                        fill
                      />
                    )}
                  </Link>
                  <div className={classes.rowContent}>
                    {!stripeProductID && (
                      <p className={classes.warning}>
                        {'This product is not yet connected to Stripe. To link this product, '}
                        <Link
                          href={`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/products/${id}`}
                        >
                          edit this product in the admin panel
                        </Link>
                        {'.'}
                      </p>
                    )}
                    <h6 className={classes.title}>
                      <Link href={`/products/${product.slug}`} className={classes.titleLink}>
                        {title}
                      </Link>
                    </h6>
                    <p>{`Quantity: ${quantity}`}</p>
                    <Price product={product} button={false} quantity={quantity} />
                  </div>
                </div>
              </Fragment>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: { id } }): Promise<Metadata> {
  return {
    title: `Order ${id}`,
    description: `Order details for order ${id}.`,
   
  }
}