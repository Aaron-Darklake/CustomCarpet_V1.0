'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { UserInfo } from './UserInfo'

import classes from './index.module.scss'
import { Gutter } from '@/components/blocks/gutter/gutter'
import Icon from '@/components/utils/icon.util'
import Navbar from '@/layout/navbar'
import Footer from '@/layout/footer'
import ConfigureAmplifyClientSide from '@/components/config/ConfigureAmplifyClientSide'
import { signOut } from 'aws-amplify/auth'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/providers/Auth'



export default function Layout({ children }: { children: React.ReactNode }) {
  const router=useRouter()
  const pathname = usePathname()
  const{setUser, setUserAttributes}= useAuth()
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', checkIsMobile);
    checkIsMobile();

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
      setUser(null)
      setUserAttributes(null)
    
    console.log('Succesfully signe out from edit')
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

  const profileNavItems = [
    {
      title: 'Overview',
      url: '/account',
      icon: ['far', 'user'],
    },
    {
      title: 'Profile',
      url: '/account/profile',
      icon: ['far', 'user'],
    },
    {
      title: 'Addresses',
      url: '/account/address',
      icon: ['far', 'user'],
    },
    {
      title: 'Orders',
      url: '/account/orders',
      icon: ['fas', 'box'],
    },
   
  ]
  return (
    <>
    <Navbar/>
    <ConfigureAmplifyClientSide/>
    <div className={classes.container} >
      {isMobile ? (
      <Gutter className={classes.mobile_gutter}>
         {children}
      </Gutter>
      ) :( 
      <Gutter>
      <h3>Account</h3>
        <div className={classes.account} >
          <div className={classes.nav}>
            <UserInfo />

            <ul>
              {profileNavItems.map(item => (
                <li key={item.title}>
                  <Link href={item.url} className={`${classes.navItem} ${pathname === item.url ? classes.active : ''}`}>
                    <p>{item.title}</p>
                  </Link>
                </li>
              ))}
               <li >
                  <button type='button' onClick={handleSignOut} className={classes.navItem} style={{padding:'20px', fontWeight:'600', color: 'var(--primary)'}}>
                    <p>Logout</p>
                  </button>
                </li>
            </ul>
          </div>
          {children}
        </div>
      </Gutter>
      )}
     
      
    </div>
    <Footer/>
    </>
  )
}