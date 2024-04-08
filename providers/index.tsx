'use client'

import React from 'react'

import { FilterProvider } from './Filter'
import { CartProvider } from './Cart'
import { AuthProvider } from './Auth'
import { NotificationProvider } from './Notification'
import { ModalContainer, ModalProvider } from '@faceless-ui/modal'
import { MediaProvider } from './Media'
import { ScrollInfoProvider } from '@faceless-ui/scroll-info';
import { ThemeProvider } from './Theme'
import { CheckoutProvider } from './Checkout'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CheckoutProvider>
        <ScrollInfoProvider>
        <ModalProvider transTime={250}>
        <FilterProvider>
          <NotificationProvider>
            <MediaProvider>
          <CartProvider>{children}</CartProvider>
          </MediaProvider>
          </NotificationProvider>
          <ModalContainer />
        </FilterProvider>
        </ModalProvider>
        </ScrollInfoProvider>
        </CheckoutProvider>
      </AuthProvider>
      </ThemeProvider>
  )
}
