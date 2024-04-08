import React, { Fragment } from 'react'
import { Metadata } from 'next'


import classes from './index.module.scss'
import { Gutter } from '@/components/blocks/gutter/gutter'
import { CheckoutPageStart } from './CheckoutPageStart'

export default async function Checkout() {
 

  let settings: {} | null = null

  try {
    settings = {}
  } catch (error) {
    // no need to redirect to 404 here, just simply render the page with fallback data where necessary
    console.error(error) // eslint-disable-line no-console
  }

  return (
    <div className={classes.checkout}>
      <Gutter className={classes.gutter}>
        <CheckoutPageStart settings={settings} />
      </Gutter>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Account',
  description: 'Create an account or log in to your existing account.',
  
}