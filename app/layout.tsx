
import '../styles/css/variables.css';
import '../styles/css/global.css';
import "../node_modules/the-new-css-reset/css/reset.css";
import { Inter } from 'next/font/google';
import React, { ReactNode } from 'react';
import { Providers } from '../providers';
import { Amplify } from 'aws-amplify';
import config from '../amplifyconfiguration.json';
import ConfigureAmplifyClientSide from '../components/config/ConfigureAmplifyClientSide';
import CartSidebar from '@/layout/cartSidebar';
import NavSidebar from '@/layout/navSidebar';
import { AddressModal } from '@/components/blocks/AddressModal';
import { AddressEditModal } from '@/components/blocks/AddressEditModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

interface RootLayoutProps {
  children: ReactNode;
}

Amplify.configure(config, {
  ssr: true
},
    );

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <CartSidebar/>
          <NavSidebar/>
          <AddressModal/>
          <AddressEditModal/>
        <div>
          <React.Fragment>
          <ConfigureAmplifyClientSide />
          {children}
          </React.Fragment>
        </div>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
