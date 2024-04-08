import React, { ReactNode } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import CartSidebar from './cartSidebar';
import NavSidebar from './navSidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <NavSidebar/>
      <CartSidebar/>
      
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
