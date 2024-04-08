'use client'
import React, { useEffect, useState } from 'react'

import classes from './index.module.scss'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dataClientPrivate from '@/components/config/data-server-client-private'
import Icon from '@/components/utils/icon.util'
import { getCurrentUser, signOut } from 'aws-amplify/auth'

export default function Account() {
  const {userAttributes,user, setUser, setUserAttributes}=useAuth()
  const router = useRouter()
  const [recentOrders, setRecentOrders]= useState([])
  const [totalOrders, setTotalOrders]=useState(0)
   const [totalAddresses, setTotalAddresses]=useState(0)
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

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        console.log(`The username: ${username}`);
        console.log(`The userId: ${userId}`);
        console.log('The signInDetails:', signInDetails);
        if(!userId){
          router.push('/')
        }
      } catch (err) {
        console.log(err);
        router.push('/')
      }
    };

    checkUser();
  }, []);
  

  useEffect(() => {
    if (userAttributes === undefined) {
      router.push(
        `/login?error=${encodeURIComponent(
          'You must be logged in to view this page.',
        )}&redirect=${encodeURIComponent('/account')}`,
      )
    }

    const fetchOrders = async ()=>{
      const{data: fetchedOrders}= await dataClientPrivate.models.Order.list()
      setTotalOrders(fetchedOrders.length)
      const sortedOrders = fetchedOrders.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
      const lastFiveOrders = sortedOrders.slice(0, 5);

      setRecentOrders(lastFiveOrders);
    }
    const fetchAddresses = async () => {
      const { data: addresses } = await dataClientPrivate.models.Address.list();
      console.log('addresses', addresses)
      setTotalAddresses(addresses.length)
    }

    fetchOrders();
    fetchAddresses();
   
  }, [user, router, userAttributes])

  const profileNavItems = [
    {
      title: 'Profile',
      url: '/account/profile',
      icon: ['far', 'user'],
    },
    {
      title: 'Addresses',
      url: '/account/address',
      icon: ['fas', 'location-dot'],
    },
    {
      title: 'Orders',
      url: '/account/orders',
      icon: ['fas', 'box'],
    },
   
  ]

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

  return (
   <>
        {isMobile ? (
        <div className={classes.mobile_container}>
          <div>
           <div>
            <div>
              <div className={classes.mobile_container_header}>{`Hello ${userAttributes?.given_name}`}</div>
              <div className={classes.mobile_content}>
              <ul>
              {profileNavItems.map(item => (
                <li >
                  <Link href={item.url} className={classes.navItem_mobile}>
                    <div className={classes.navItem_mobile_title}> 
                      <Icon icon={item.icon}/>
                      <p>{item.title}</p>
                    </div>
                    <Icon icon={['fas', 'chevron-right']}/>
                  </Link>
                </li>
              ))}
               <li >
                  <button type='button' onClick={handleSignOut} className={classes.navItem_mobile} >
                  <div className={classes.navItem_mobile_title_button}> 
                      <Icon icon={['fas', 'arrow-right-from-bracket']}/>
                      <p>Logout</p>
                    </div>
                    <Icon icon={['fas', 'chevron-right']}/>
                  </button>
                </li>
            </ul>
              </div>
            </div>
           </div>
           <div className={classes.mobile_support_container}>
              <div className={classes.mobile_support_content}>
                <h3>Got questions?</h3>
                <span>You can find frequently asked questions and answers on our customer service page.</span>
              </div>
              <div className={classes.mobile_support_button}>
                <Link href='/account' className={classes.mobile_support_button_link}>
                <p className={classes.mobile_support_button_link_p}>Customer Service</p>
                <Icon icon={['fas', 'arrow-right']}/>
                </Link>
              </div>
           </div>
          </div>
        </div>
        ):(
          <div >
          <div>
          <div className={classes.overview_header_container}>
          <span className={classes.overview_header_span_name}>{`Hello ${userAttributes.given_name},`}</span>
          <span className={classes.overview_header_span_email}>Signed in with:<span className={classes.overview_header_span_mail}>{` ${userAttributes.email}`}</span></span>
        </div>
      <div className={classes.overview_main_container}>
        <div className={classes.overview_main_wrapper}>
          <div className={classes.overview_main_buttons}>
            <div className={classes.overview_main_buttons_card}>
              <div className={classes.overview_main_buttons_card_header}>
                <Link href='/account/profile'>
                  <h3>
                  Profile
                  </h3>
                </Link>
              </div>
             <div className={classes.overview_main_buttons_card_content}>
              <span className={classes.overview_main_buttons_card_content_span}>Mail</span>
              <span className={classes.overview_main_buttons_card_content_span_uppercase}>verified</span>
             </div>
            </div>
            <div className={classes.overview_main_buttons_card}>
              <div className={classes.overview_main_buttons_card_header}>
                <Link href='/account/address'>
                  <h3>
                  Adresses
                  </h3>
                </Link>
              </div>
             <div className={classes.overview_main_buttons_card_content}>
              <span className={classes.overview_main_buttons_card_content_span}>{totalAddresses}</span>
              <span className={classes.overview_main_buttons_card_content_span_uppercase}>saved</span>
             </div>
            </div>
            <div className={classes.overview_main_buttons_card}>
              <div className={classes.overview_main_buttons_card_header}>
                <Link href='/account/orders'>
                <h3>
                  Orders
                </h3>
                </Link>
              </div>
             <div className={classes.overview_main_buttons_card_content}>
              <span className={classes.overview_main_buttons_card_content_span}>{totalOrders}</span>
              <span className={classes.overview_main_buttons_card_content_span_uppercase}>ordered</span>
             </div>
            </div>
          </div>
          <div className={classes.overview_main_recentOrders_wrapper}>
            <div className={classes.overview_main_recentOrders_header}>
              <h3>Recent orders</h3>
            </div>
            <ul className={classes.overview_main_recentOrders_list_wrapper}>
                {recentOrders.map((order, index) => (
                  <li key={index}>
                      <Link href={`/orders/${order.id}`}>
                        <div className={classes.overview_main_recentOrders_list_card}>
                          <div className={classes.overview_main_recentOrders_list_card_content}>
                            <span className={classes.overview_main_recentOrders_list_card_content_span_bold}>Date placed</span>
                            <span className={classes.overview_main_recentOrders_list_card_content_span_bold}>Order Id</span>
                            <span className={classes.overview_main_recentOrders_list_card_content_span_bold}>Total amount</span>
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
          </div>
        </div>
      </div>
      </div>
    </div>
        )}
        </>
      
  )
}

