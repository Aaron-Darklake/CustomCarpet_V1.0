import React, { Suspense } from 'react'
import { Metadata } from 'next'

import { OrderConfirmationPage } from './OrderConfirmationPage'

import classes from './index.module.scss'
import { Gutter } from '@/components/blocks/gutter/gutter'

export default async function OrderConfirmation() {
  return (
    <div className={classes.confirmationPage}>
      <Suspense fallback={<div>Loading...</div>}>
        <OrderConfirmationPage />
      </Suspense>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Order Confirmation',
  description: 'Your order has been confirmed.',
}
