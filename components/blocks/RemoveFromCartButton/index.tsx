import React from 'react'


import classes from './index.module.scss'
import Image from 'next/image'
import { Product } from '../../../components/types/product-type'
import { useCart } from '../../../providers/Cart'

export const RemoveFromCartButton: React.FC<{
  className?: string
  product: Product
}> = props => {
  const { className, product } = props

  const { deleteItemFromCart, isProductInCart } = useCart()

  const productIsInCart = isProductInCart(product.id)

  

  

  return (
    <button
      type="button"
      onClick={() => {
        deleteItemFromCart(product)
      }}
      className={[className, classes.removeFromCartButton].filter(Boolean).join(' ')}
    >
      <Image 
        src="/assets/icons/delete.svg"
        alt='deleate'
        width={24}
        height={24}
        className={classes.qtnBt}
      />
    </button>
  )
}
