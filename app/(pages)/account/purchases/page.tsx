import React from 'react'
import Link from 'next/link'



import classes from './index.module.scss'
import { useAuth } from '@/providers/Auth'
import { Media } from '@/components/blocks/Media'
import { Price } from '@/components/blocks/Price'
import cookieBasedClient from '@/components/config/cookiebased-client'
import { getUrl } from 'aws-amplify/storage'

export default async function Purchases() {

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    return formattedDate;
  };
let purchases

const{data: itemsData} = await cookieBasedClient.models.OrderItem.list({authMode:'userPool'}) 
  const itemsWithProducts = await Promise.all(
    itemsData.map(async item => {
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
    
 purchases = itemsWithProducts
  

console.log(purchases)
  return (
    <div  className={classes.mainTitle}>
      <h5>Purchased Products</h5>
      <div>
        {purchases?.length || 0 > 0 ? (
          <ul className={classes.purchases}>
            {purchases?.map((purchase, index) => {
              return (
                <li key={index} className={classes.purchase}>
                  {typeof purchase === 'string' ? (
                    <p>{purchase} Test</p>
                  ) : (
                    <Link href={`/products/${purchase.slug}`} className={classes.item}>
                      <div className={classes.mediaWrapper}>
                        {!purchase.product.meta.image && (
                          <div className={classes.placeholder}>No image</div>
                        )}
                        {purchase.product.meta.image && typeof purchase.product.meta.image === 'string' && (
                          <Media imgClassName={classes.image} resource={purchase.product.meta.image} fill />
                        )}
                      </div>
                      <div className={classes.itemDetails}>
                        <h6>{purchase.product.title}</h6>
                        <Price product={purchase.product} />
                        <p className={classes.purchasedDate}>{`Purchased On: ${formatDateTime(purchase.createdAt)}`}</p>
                      </div>
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <div className={classes.noPurchases}>You have no purchases.</div>
        )}
      </div>
    </div>
  )
}