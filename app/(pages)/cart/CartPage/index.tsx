'use client'

import React, { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import CartItem from '../CartItem'

import classes from './index.module.scss'
import { Page, Settings } from '../../../../components/types/product-type'
import { useAuth } from '../../../../providers/Auth'
import { useCart } from '../../../../providers/Cart'
import { Button } from '../../../../components/blocks/Button'
import { LoadingShimmer } from '../../../../components/blocks/LoadingShimmer'
import config from '../../../../amplifyconfiguration.json';
import { Amplify } from "aws-amplify";
import dataClient from '@/components/config/data-server-client'
import { getUrl } from 'aws-amplify/storage'

Amplify.configure(config, {
  ssr: true
});

export const CartPage: React.FC<{
  settings: Settings
  page: Page
}> = props => {
  const { settings } = props
  const { productsPage } = settings || {}


  const { user } = useAuth()

  const { cart, cartIsEmpty, addItemToCart, cartTotal, hasInitializedCart } = useCart()
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true)
    const fetchCartItems = async () => {
      if (!cart?.items) return;

      const items = await Promise.all(cart.items.map(async (item) => {
        try {
          const { data: product } = await dataClient.models.Product.get({ id: (typeof item.product === 'string' ? item.product : item.product.id) });
          if (typeof product === 'object') {
            const { data: fetchImage } = await dataClient.models.Media.get({ id: product.images[0] });
            const { url: imageUrl } = await getUrl({ key: fetchImage.url });
            const metaImage = imageUrl.href;
            const quantity = item.quantity
            return {
              ...item,
              product,
              quantity,
              metaImage
            };
          }
        } catch (error) {
          console.error('Error fetching cart item data:', error);
        }
        return null;
      }));
      

      setCartItems(items.filter(Boolean));
      setIsLoading(false)
    };

    fetchCartItems();
  }, [cart,]);

  return (
    <div  className={classes.cartContainer}>
      <h3>Cart</h3>
    <Fragment>
      <br />
      {!hasInitializedCart || isLoading ? (
        <div className={classes.loading}>
          <LoadingShimmer />
        </div>
      ) : (
        <Fragment>
          {cartIsEmpty ? (
            <div className={classes.empty}>
              Your cart is empty.
              {typeof productsPage === 'object' && productsPage?.slug && (
                <Fragment>
                  {' '}
                  <Link href={`/${productsPage.slug}`}>Click here</Link>
                  {` to shop.`}
                </Fragment>
              )}
              {!user && (
                <Fragment>
                  {' '}
                  <Link href={`/login?redirect=%2Fcart`}>Log in</Link>
                  {` to view a saved cart.`}
                </Fragment>
              )}
            </div>
          ) : (
            <div className={classes.cartWrapper}>
              <div>
                {/* CART LIST HEADER */}
                <div className={classes.header}>
                  <p>Products</p>
                  <div className={classes.headerItemDetails}>
                    <p></p>
                    <p></p>
                    <p>Quantity</p>
                  </div>
                  <p className={classes.headersubtotal}>Subtotal</p>
                </div>
                {/* CART ITEM LIST */}
                <ul className={classes.itemsList}>
                  {cartItems.map( (item, index) => (
                    
                   


<div key={item.product.id}>
                        <CartItem
                          
                          product={item.product}
                          title={item.product?.title}
                          metaImage={item.metaImage}
                          qty={item.quantity}
                          addItemToCart={addItemToCart}
                        />

</div> 
                  ))}
                </ul>
              </div>

              <div className={classes.summary}>
                <div className={classes.row}>
                  <h6 className={classes.cartTotal}>Summary</h6>
                </div>

                <div className={classes.row}>
                  <p className={classes.cartTotal}>Delivery Charge</p>
                  <p className={classes.cartTotal}>$0</p>
                </div>

                <div className={classes.row}>
                  <p className={classes.cartTotal}>Grand Total</p>
                  <p className={classes.cartTotal}>{cartTotal.formatted}</p>
                </div>

                <Button
                  className={classes.checkoutButton}
                  href={user ? '/checkout' : '/login'}
                  label={user ? 'Checkout' : 'Login to checkout'}
                  appearance="primary"
                />
              </div>
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
    </div>
  )
}