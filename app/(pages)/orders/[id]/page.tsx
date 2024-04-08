'use client'
import React, { Fragment, useEffect, useState } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'


import classes from './index.module.scss'
import { Gutter } from '@/components/blocks/gutter/gutter'
import { Media } from '@/components/blocks/Media'
import { Price } from '@/components/blocks/Price'
import { Button } from '@/components/blocks/Button'
import { getUrl } from 'aws-amplify/storage'
import cookieBasedClient from '@/components/config/cookiebased-client'
import Icon from '@/components/utils/icon.util'
import dataClientPrivate from '@/components/config/data-server-client-private'
import { useAuth } from '@/providers/Auth'
import CartItemSmall2 from '@/components/blocks/CartItemSmall2'
import dataClient from '@/components/config/data-server-client'

export default function Order({ params: { id } }) {
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const router = useRouter();
  const {userAttributes}=useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data: ordersData} = await dataClientPrivate.models.Order.get({id: id});
        console.log('ordersData', ordersData)
        if (!ordersData) {
          return;
        }
        let itemsData = [];

      // Assuming ordersData.orderItems is an array of IDs
      if (ordersData?.orderItems && ordersData?.orderItems.length > 0) {
        itemsData = await Promise.all(ordersData.orderItems.map(async (orderItemId) => {
          const {data: orderItemData} = await dataClientPrivate.models.OrderItem.get({id: orderItemId});
          return orderItemData;
        }));
      }
        console.log('itemsData', itemsData)
        const itemsWithProducts = await Promise.all(

          itemsData.map(async item => {
            console.log('item', item)
            if (typeof item.product === 'string') {
              const { data: productData, errors: productErrors } = await dataClient.models.Product.get({ id: item.product });
              console.log('productData', productData)
              console.log('productErrors', productErrors)
              let imageUrl = null;

              if (productData.images && productData.images.length > 0) {
                const { data: image } = await dataClient.models.Media.get({ id: productData.images[0] });
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

        setOrder(ordersData);
        setItems(itemsWithProducts);
        console.log('items',itemsWithProducts)
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchData();
  }, [id, router, userAttributes]);

  if (!order) {
    return <p>Loading...</p>;
  }

  function formatDate(dateInput: string | number | Date): string {
    const date = new Date(dateInput);
  
    // Get date components
    const dayOfMonth = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
  
    // Get time components
    const hour = date.getHours();
    const minute = date.getMinutes();
  
    // Get the ordinal suffix for the day
    const ordinalSuffix = getOrdinalSuffix(dayOfMonth);
  
    // Format the time with AM/PM
    const timeFormatted = new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  
    // Construct the full date string
    return `${month} ${dayOfMonth}${ordinalSuffix} ${year}, ${timeFormatted}`;
  }

  function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }

  function formatPrice(cents: number): string {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
  }
  
 

  return (
    <div className={classes.orderContainer}>
    <div className={classes.orderContainer_header_wrapper}>
      <h1>Order details</h1>
      <Link href='/account/orders'>
        <Icon icon={['fas', 'remove']}/>
        Back to overview
      </Link>
    </div>
    <div className={classes.orderContainer_main_wrapper}>
      <div>
        <p className={classes.orderContainer_main_wrapper_normal_p}>We have sent the order confirmation details to <span className={classes.orderContainer_main_wrapper_normal_p_span}>{userAttributes?.email}</span></p>
        <p className={classes.orderContainer_main_wrapper_normal_p}>{`Order date: ${formatDate(order?.createdAt)}`}</p>
        <p className={classes.orderContainer_main_wrapper_normal_p}>{`Order Id: ${order?.id}`}</p>
        <div className={classes.orderContainer_main_wrapper_status}>
          <p className={classes.orderContainer_main_wrapper_normal_p}>Order Status: <span className={classes.orderContainer_main_wrapper_normal_p_span_2}>{order.orderStatus}</span></p>
          <p className={classes.orderContainer_main_wrapper_normal_p}>Payment status: <span className={classes.orderContainer_main_wrapper_normal_p_span_2}>{order.paymentStatus}</span></p>
        </div>
      </div>
      <div className={classes.itemsList_container}>
      <ul className={classes.itemsList}>
                          {items.length > 0 && items?.map((item, index) => (




                              <div key={item.product.id}>
                                  <CartItemSmall2

                                      product={item.product}
                                      title={item.product?.title}
                                      metaImage={item.product.meta.image}
                                      qty={item.quantity}
                                  />

                              </div>
                          ))}
                      </ul>
      </div>
      <div className={classes.delivery_container}>
        <h2>Delivery</h2>
        <div className={classes.shipping_information_card}>
          <div>
            <div className={classes.shipping_information_content_wrapper}>
              <div className={classes.shipping_information_content_grid}>
                <div className={classes.shipping_information_content_column}>
                  <p className={classes.shipping_information_content_column_header}>Shipping Adress</p>
                  <p className={classes.shipping_information_content_value}>{`${order.shippingFirstName} ${order.shippingLastName}`}</p>
                  <p className={classes.shipping_information_content_value}>{`${order.shippingCompany}`}</p>
                  <p className={classes.shipping_information_content_value}>{`${order.shippingAddress1}`}</p>
                  <p className={classes.shipping_information_content_value}>{`${order.shippingZip} - ${order.shippingCity}`}</p>
                  <p className={classes.shipping_information_content_value}>{`${order.shippingCountry}`}</p>
                </div>
                <div className={classes.shipping_information_content_column}>
                <p className={classes.shipping_information_content_column_header}>Contact</p>
                  <p className={classes.shipping_information_content_value}>{`${userAttributes.email}`}</p>
                  <p className={classes.shipping_information_content_value}>{`${userAttributes.phone != undefined ? userAttributes.phone : ''}`}</p>
                </div>
                <div className={classes.shipping_information_content_column}>
                <p className={classes.shipping_information_content_column_header}>Billing Adress</p>
                  {!order.billingSame ? (
                    <Fragment>
                      <p className={classes.shipping_information_content_value}>{`${order.billingFirstName} ${order.billingLastName}`}</p>
                      <p className={classes.shipping_information_content_value}>{`${order.billingAddress}`}</p>
                      <p className={classes.shipping_information_content_value}>{`${order.billingZip} - ${order.billingCity}`}</p>
                      <p className={classes.shipping_information_content_value}>{`${order.billingCountry}`}</p>
                    </Fragment>):(<Fragment>
                      <p className={classes.shipping_information_content_value}>Billing- and delivery address are the same.</p>
                    </Fragment>)}
                </div>
                <div className={classes.shipping_information_content_column}>
                  <p className={classes.shipping_information_content_column_header}>Delivery Method</p>
                  <p className={classes.shipping_information_content_value}>{`${order.shippingMethod} `}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={classes.delivery_container_border}></div>
      </div>
      <div className={classes.summary_container}>
        <h2>Order summary</h2>
        <div className={classes.summary_content_container}>
          <div className={classes.summary_content_subtotal}>
            <span>Subtotal</span>
            <span>{formatPrice(order?.subTotal)}</span>
          </div>
          <div  className={classes.summary_content_additional}>
          <div className={classes.summary_content_additional_shipping}>
            <span>Shipping</span>
            <span>{formatPrice(order?.shippingCost)}</span>
          </div>
          <div className={classes.summary_content_additional_shipping}>
            <span>Tax</span>
            <span>0,00 €</span>
          </div>
          </div>
          <div className={classes.summary_container_border}></div>
          <div className={classes.summary_content_subtotal}>
            <span>Total</span>
            <span>{formatPrice(order?.total)}</span>
          </div>
        </div>
      </div>
     
    </div>
      </div>
    
  )
}

