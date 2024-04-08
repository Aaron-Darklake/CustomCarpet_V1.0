'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'


import classes from './index.module.scss'
import { Media } from '../Media'
import { Price } from '../Price'
import Icon from '@/components/utils/icon.util'
import { RemoveFromCartButton } from '../RemoveFromCartButton'

const CartItemSmall2 = ({ product, title, metaImage, qty }) => {

  

  return (
    <li className={classes.item} key={title}>

      <div className={classes.mediaWrapper}>
      <Link href={`/products/${product.slug}`} >
        {!metaImage && <span>No image</span>}
        {metaImage && typeof metaImage === 'string' && (
          <Media className={classes.media} imgClassName={classes.image} resource={metaImage} fill />
        )}
      </Link>
      </div>

      <div className={classes.itemDetails}>
        <div className={classes.titleWrapper}>
          <h6>{title}</h6>
          <p>{`Quantity: ${qty}`}</p>
        </div>

        
      </div>

      <div className={classes.subtotalWrapper}>
      
      <div className={classes.quantity}>
      <Price product={product} button={false} />
        </div>
        
      </div>
    </li>
  )
}

export default CartItemSmall2