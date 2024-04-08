import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'




import classes from './index.module.scss'
import { RenderParams } from '@/components/blocks/RenderParams'
import { Button } from '@/components/blocks/Button'
import cookieBasedClient from '@/components/config/cookiebased-client'
import Icon from '@/components/utils/icon.util'

export default async function Orders() {
 

  let orders: any[] | null = null

  

  const {data: ordersData, errors} = await cookieBasedClient.models.Order.list({authMode: 'userPool'})
  const sortedOrders = ordersData.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  orders = sortedOrders
  console.log('orders',ordersData)
  console.log('errors', errors)

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
    <div className={classes.profile}>
       <div className={classes.profile_mobile_btn}>
        <div>
          <div>
            <Link href='/account' className={classes.profile_mobile_btn}>
              <Icon icon={['fas', 'chevron-left']}/>
              <span>Account</span>
            </Link>
          </div>
        </div>
      </div>
      <div className={classes.mainTitle_wrapper}>
      <h1>Orders</h1>
      <p>View your previous orders and their status. You can also create returns or exchanges for your orders if needed.</p>
      </div>
      {(!orders || !Array.isArray(orders) || orders?.length === 0) && (
        <p className={classes.noOrders}>You have no orders.</p>
      )}
      <RenderParams />
      <div className={classes.overview_main_recentOrders_wrapper}>
      {orders && orders.length > 0 && (
            <ul className={classes.overview_main_recentOrders_list_wrapper}>
                {orders?.map(order => (
                  <li key={order.id}>
                      <Link href={`/orders/${order.id}`}>
                        <div className={classes.overview_main_recentOrders_list_card}>
                          <div className={classes.overview_main_recentOrders_list_card_content}>
                            <span className={classes.overview_main_recentOrders_list_card_content_span_bold}>Date</span>
                            <span className={classes.overview_main_recentOrders_list_card_content_span_bold}>Order Id</span>
                            <span className={classes.overview_main_recentOrders_list_card_content_span_bold}>Total</span>
                            <span className={classes.overview_main_recentOrders_list_card_content_span}>{formatDate(order.createdAt)}</span>
                            <span className={classes.overview_main_recentOrders_list_card_content_span}>{order.id}</span>
                            <span className={classes.overview_main_recentOrders_list_card_content_span}>{formatPrice(order.total)}</span>
                          </div>
                          <div className={classes.overview_main_recentOrders_list_card_button}>
                            <Icon icon={['fas','chevron-right']}/>
                          </div>
                        </div>
                      </Link>
             
                  </li>
                ))}
            </ul>
            )}
          </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Orders',
  description: 'Your orders.',
}