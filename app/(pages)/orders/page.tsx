import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'



import classes from './index.module.scss'
import { Gutter } from '@/components/blocks/gutter/gutter'
import { RenderParams } from '@/components/blocks/RenderParams'
import { Button } from '@/components/blocks/Button'
import cookieBasedClient from '@/components/config/cookiebased-client'

export default async function Orders() {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    return formattedDate;
  };

  let orders: any[] | null = null

  const {data: ordersData, errors} = await cookieBasedClient.models.Order.list({authMode: 'userPool'})
  orders = ordersData

  return (
    <Gutter className={classes.orders}>
      <h1>Orders</h1>
      {(!orders || !Array.isArray(orders) || orders?.length === 0) && (
        <p className={classes.noOrders}>You have no orders.</p>
      )}
      <RenderParams />
      {orders && orders.length > 0 && (
        <ul className={classes.ordersList}>
          {orders?.map((order, index) => (
            <li key={order.id} className={classes.listItem}>
              <Link className={classes.item} href={`/orders/${order.id}`}>
                <div className={classes.itemContent}>
                  <h4 className={classes.itemTitle}>{`Order (${order.id})`}</h4>
                  <div className={classes.itemMeta}>
                    <p>{`Ordered On: ${formatDateTime(order.createdAt)}`}</p>
                    <p>
                      {'Total: '}
                      {new Intl.NumberFormat('de-DE', {
                        style: 'currency',
                        currency: 'eur',
                      }).format(order.total / 100)}
                    </p>
                  </div>
                </div>
                <Button
                  appearance='secondary'
                  label="View Order"
                  className={classes.button}
                  el="button"
                />
              </Link>
              {index !== orders.length - 1 }
            </li>
          ))}
        </ul>
      )}
      <Button href="/account/orders" appearance="primary" label="Go to account" />
    </Gutter>
  )
}

export const metadata: Metadata = {
  title: 'Orders',
  description: 'Your orders.',
}
