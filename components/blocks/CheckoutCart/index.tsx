'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'



import classes from './index.module.scss'
import { useCart } from '@/providers/Cart'
import { getUrl } from 'aws-amplify/storage'
import dataClient from '@/components/config/data-server-client'
import CartItemSmall from '../CartItemSidebar'
import CartItemSmall2 from '../CartItemSmall2'








const CheckoutCart =  ({  }) => {
    const{cart,cartTotal, addItemToCart, subtotal, additionalCosts}=useCart()
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
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
        };
    
        fetchCartItems();
      }, [cart]);

  return (
    <div className={classes.cart_container}>
        <div className={classes.cart_wrapper}>
            <h2>In Your Cart</h2>
            <div className={classes.cart_devider}></div>
            <div>
                <div className={classes.cart_details_wrapper}>
                    <div className={classes.cart_details}>
                        <span>Subtotal</span>
                        <span>{subtotal.formatted}</span>
                    </div>
                    <div className={classes.cart_details}>
                        <span>Shipping</span>
                        <span>{(additionalCosts.shipping / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                    <div className={classes.cart_details}>
                        <span>Taxes</span>
                        <span>0,00 €</span>
                    </div>
                </div>
                <div className={classes.cart_devider_small}></div>
                <div className={classes.cart_details}>
                    <span style={{fontSize:'16px', fontWeight:'500'}}>Total</span>
                    <span style={{fontSize:'18px', fontWeight:'600'}}>{cartTotal.formatted}</span>
                </div>
                <div className={classes.cart_devider_small}></div>
                <ul className={classes.itemsList}>
                          {cartItems.map((item, index) => (




                              <div key={item.product.id}>
                                  <CartItemSmall2

                                      product={item.product}
                                      title={item.product?.title}
                                      metaImage={item.metaImage}
                                      qty={item.quantity}
                                  />

                              </div>
                          ))}
                      </ul>
            </div>
        </div>
    </div>
  );
}

export default CheckoutCart