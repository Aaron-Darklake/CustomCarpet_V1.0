'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'


import classes from './index.module.scss'
import { Media } from '../Media'
import { Price } from '../Price'
import Icon from '@/components/utils/icon.util'
import { RemoveFromCartButton } from '../RemoveFromCartButton'

const CartItemSmall = ({ product, title, metaImage, qty, addItemToCart }) => {
  const [quantity, setQuantity] = useState(qty)

  const decrementQty = () => {
    const updatedQty = quantity > 1 ? quantity - 1 : 1

    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty) })
  }

  const incrementQty = () => {
    const updatedQty = quantity + 1

    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty) })
  }

  const enterQty = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedQty = Number(e.target.value)

    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty) })
  }

  return (
    <li className={classes.item} key={title}>

      <div className={classes.mediaWrapper}>
      <div className={classes.remove_wrapper}><RemoveFromCartButton product={product} /></div>
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
          <Price product={product} button={false} />
        </div>

        
      </div>

      <div className={classes.subtotalWrapper}>
      
      <div className={classes.quantity}>
          <div className={classes.quantityBtn} onClick={decrementQty}>
            <Icon icon={['fas', 'minus']} className={classes.qtnBt}/>
          </div>

          <input
            type="text"
            className={classes.quantityInput}
            value={quantity}
            onChange={enterQty}
          />

          <div className={classes.quantityBtn} onClick={incrementQty}>
          <Icon icon={['fas', 'plus']} className={classes.qtnBt}/>
          </div>
        </div>
        
      </div>
    </li>
  )
}

export default CartItemSmall