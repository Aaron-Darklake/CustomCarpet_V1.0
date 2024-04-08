'use client'

import React, { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { Modal, ModalToggler, useModal } from '@faceless-ui/modal';
import classes from '../styles/structure/cartSidebar.module.scss'
import Icon from '@/components/utils/icon.util';
import { useCart } from '@/providers/Cart';
import dataClient from '@/components/config/data-server-client';
import { getUrl } from 'aws-amplify/storage';
import CartItemSmall from '@/components/blocks/CartItemSidebar';
import { Button } from '@/components/blocks/Button';
import { useAuth } from '@/providers/Auth';
import { useRouter } from 'next/navigation';

const modalSlug = 'cart-drawer';

const CartSidebar: React.FC = () => {

  const {user}=useAuth()
  const router = useRouter()
  const { cart, cartIsEmpty, addItemToCart, cartTotal, hasInitializedCart } = useCart()
  const [cartItems, setCartItems] = useState([]);
  const{toggleModal} = useModal()

  

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

  const handleClickButton = () => {
    router.push('/checkout')
    toggleModal('cart-drawer')
  }


  return (
    <Fragment>
        <Modal
        slug={modalSlug}
        className={classes.modal}
      >
         <ModalToggler
            slug={modalSlug}
            className={classes.close}
          >
          </ModalToggler>
        <div className={classes.wrapper}>
            <div className={classes.modal_header}>
                <div className={classes.modal_header_container}>
                <p>Cart</p>
                <Link href='/cart' onClick={() => toggleModal('cart-drawer')}>view</Link>
                </div>
                
                  <ModalToggler
                      slug={modalSlug}
                      className={classes.collection_list_header_btn_close}
                  >
                      <Icon icon={['fas', 'close']} />
                  </ModalToggler>
                  </div>
          <div className={classes.content}>
                      {/* CART ITEM LIST */}
                      <ul className={classes.itemsList}>
                          {cartItems.map((item, index) => (




                              <div key={item.product.id}>
                                  <CartItemSmall

                                      product={item.product}
                                      title={item.product?.title}
                                      metaImage={item.metaImage}
                                      qty={item.quantity}
                                      addItemToCart={addItemToCart}
                                  />

                              </div>
                          ))}
                      </ul>
                      <div className={classes.summary}>
                <div className={classes.row}>
                  <p className={classes.cartTotal}>Delivery Charge</p>
                  <p className={classes.cartTotal}>Calculated at checkout</p>
                </div>

                <div className={classes.row}>
                  <p className={classes.cartTotal}>Total</p>
                  <p className={classes.cartTotal_value}>{cartTotal.formatted}</p>
                </div>  
                </div>
                <Button
                  className={classes.checkoutButton}
                  href={user ? '/checkout' : '/login'}
                  label={user ? 'Checkout' : 'Login to checkout'}
                  appearance="primary"
                  onClick={handleClickButton}
                />
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default CartSidebar;
