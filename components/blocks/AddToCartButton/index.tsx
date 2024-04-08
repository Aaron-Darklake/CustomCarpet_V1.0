'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'



import { Button, Props } from '../Button'

import classes from './index.module.scss'
import { Product } from '../../../components/types/product-type'
import { useCart } from '../../../providers/Cart'
import { useModal } from '@faceless-ui/modal'

export const AddToCartButton: React.FC<{
  product: any
  quantity?: number
  className?: string
  appearance?: Props['appearance']
}> = props => {
  const { product, quantity = 1, className, appearance = 'primary' } = props

  const { cart, addItemToCart, isProductInCart, hasInitializedCart } = useCart()
  const{toggleModal}=useModal()

  const [isInCart, setIsInCart] = useState<boolean>()
  const router = useRouter()

  useEffect(() => {
    setIsInCart(isProductInCart(product.id))
  }, [isProductInCart, product, cart])
console.log('product to card:', product)
console.log('product in cart', isProductInCart)
  return (
    <Button
      href={isInCart ? '/cart' : undefined}
      type={!isInCart ? 'button' : undefined}
      label={isInCart ? `✓ View in cart` : `Add to cart`}
      el={isInCart ? 'link' : undefined}
      appearance={appearance}
      className={[
        className,
        classes.addToCartButton,
        appearance === 'default' && isInCart && classes.green,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={
        !isInCart
          ? () => {
              addItemToCart({
                product,
                quantity,
              })

              toggleModal('cart-drawer')
            }
          : undefined
      }
    />
  )
}
