'use client'

import React, { useEffect, useState } from 'react';
import Icon from '../components/utils/icon.util';
import css from './styles/navbar.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/providers/Auth';
import { useModal } from '@faceless-ui/modal';
import { useCart } from '@/providers/Cart';
import { Button } from '@/components/blocks/Button';
import { UserInfo } from '@/app/(pages)/account/UserInfo';
import { useRouter } from 'next/navigation';
import { signOut } from 'aws-amplify/auth';
import { useTheme } from '@/providers/Theme';

// Extend the Window interface to include sticky
declare global {
  interface Window {
    sticky: any;
  }
}

const Navbar: React.FC = () => {
  const [menuState, setMenuState] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [profileDropDown, setProfileDropDown] = useState(false)
  const { user, userAttributes } = useAuth()
  const{theme} = useTheme()
  const { cart } = useCart()
  const { toggleModal } = useModal()
  const router = useRouter()
  const { setUser, setUserAttributes } = useAuth()
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


  useEffect(() => {
    setMenuState(false);
    
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', checkIsMobile);
    checkIsMobile();

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  useEffect(() => {
    class ScrollEvents {
      lastY: number = window.scrollY;

      constructor() {
        console.log(
          '%c▼  Navigation Scroll Events Loaded',
          'background: #060708; color: #fff; padding: .125rem .75rem; border-radius: 5px; font-weight: 900;'
        );

        window.sticky = window.sticky || {};
        window.sticky.nav = document.querySelector('nav');

        this.addEventListeners();
      }

      addEventListeners() {
        if (window.sticky?.nav) {
          window.addEventListener('DOMContentLoaded', this.maybeHideNav, false);
          document.addEventListener('scroll', this.maybeHideNav, false);
        }
      }

      removeEventListeners() {
        if (window.sticky?.nav) {
          window.removeEventListener('DOMContentLoaded', this.maybeHideNav, false);
          document.removeEventListener('scroll', this.maybeHideNav, false);
        }
      }

      maybeHideNav = () => {
        const nC = window.sticky.nav?.classList;
        const hiddenAt = window.innerHeight / 2;

        if (window.scrollY > this.lastY && window.scrollY > hiddenAt && !nC?.contains(css.hidden)) {
          nC?.add(css.hidden);
          setProfileDropDown(false);
        } else if (window.scrollY < this.lastY && nC?.contains(css.hidden)) {
          nC?.remove(css.hidden);
        }

        this.lastY = window.scrollY;
        
      };
      
    }

    const scrollEvents = new ScrollEvents();

    return () => {
      scrollEvents.removeEventListeners();
    };
  }, []);

  const toggleMenu = () => {
    setMenuState(!menuState);
  };

  const handleNavigation = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMenuState(false);
      const navbar = window.sticky?.nav;
      if (navbar && !navbar.classList.contains(css.hidden)) {
        navbar.classList.add(css.hidden);
      }
    }
  };

  const toggleProfileDropDown = () => {
    setProfileDropDown(!profileDropDown);
  };

  useEffect(() => {
    // Event listener to close the profile dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (profileDropDown && event.target.closest(`.${css.profileDropDown}`) === null) {
        setProfileDropDown(false);
        console.log('theme',theme)
      }
    };

    if (profileDropDown) {
      // Add event listener when the dropdown is open
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      // Clean up the event listener
      document.removeEventListener('click', handleClickOutside);
    };
  }, [profileDropDown]); // Depend on the profileDropDown state

  useEffect(() => {

    console.log('theme', theme)
  }, [theme])


  return (
    <nav id="Navbar" className={css.container}>
      <ul className={css.menu}>
        {/* Left section */}
        <li data-open={menuState} className={css.menuContent}>
          <button onClick={() => toggleModal('sidebar-drawer')} className={css.mobileToggle} data-open={menuState}>
            <div>
              <span></span>
              <span></span>
            </div>
          </button>
        </li>


        {/* Center section */}
        <li className={css.menuHeader}>
          <Link href='/' className={css.logo}>
            <Image src={theme === 'light' ? '/logo-black.svg' : '/logo-white.svg' } alt="logo" width={170} height={50} />
          </Link>

        </li>
        <li className={css.rightButton}>
            <div className={css.social}>

        {/* Right section */}
        {!isMobile && (
         
                <div className={css.buttonWrapper}>
                 
                 
                   
                  { userAttributes && userAttributes?.email !== undefined ? (
                     <>
                     <button onClick={toggleProfileDropDown} className={css.accountButton}>
                     <Icon icon={['fas', 'circle-user']} />
                   </button>
                   
                {profileDropDown && (
                    <div className={css.profileDropDown}>
                      <ul className={css.dropDown_list}>
                        <li className={css.dropdown_title}>
                          <div className={css.profile}>
                            <Icon icon={['far', 'user-circle']} />
                            <div className={css.profileInfo}>
                              <p className={css.name}>{`${userAttributes?.given_name} ${userAttributes?.family_name}`}</p>
                              <p className={css.email}>{userAttributes?.email}</p>
                            </div>
                          </div>
                        </li>
                        <li className={css.dropdown_item}>
                          <Link href={'/account'} className={css.dropdown_item_wrapper}>
                            <div className={css.dropdown_icon_wrapper}>
                              <Icon icon={['far', 'user']} />
                            </div>
                            <div className={css.link}>
                              My Account
                            </div>
                          </Link>
                        </li>
                        <li className={css.dropdown_item}>
                          <Link href={'/account/purchases'} className={css.dropdown_item_wrapper}>
                            <div className={css.dropdown_icon_wrapper}>
                              <Icon icon={['far', 'credit-card']} />
                            </div>
                            <div className={css.link}>
                              My Purchases
                            </div>
                          </Link>
                        </li>
                        <li className={`${css.dropdown_item} ${css.dropdown_item_last}`}>
                          <Link href={'/account'} className={css.dropdown_item_wrapper}>
                            <div className={css.dropdown_icon_wrapper}>
                              <Icon icon={['fas', 'box']} />
                            </div>
                            <div className={css.link}>
                              My Orders
                            </div>
                          </Link>
                        </li>
                        <li className={css.dropdown_title}>
                          <button type='button' onClick={handleSignOut} className={css.navItem}>
                            <Icon icon={['fas', 'arrow-right-from-bracket']} className='fa-rotate-180' />

                            <p>Logout</p>
                          </button>
                        </li>
                      </ul>
                    </div>

                   

                
              )} 
              </>

               
               ): (<><Link href={userAttributes && userAttributes?.email !== undefined ? '/account' : '/login'}>
               <Icon icon={['fas', 'circle-user']} />
               </Link></>)}
             
               

                </div>
             
        )}
        <button type='button' onClick={() => toggleModal('cart-drawer')} className={css.cart}>
                {cart.items.length > 0 && <div className={css.cart_pinup}>{cart.items.length}</div>}
                <Icon icon={['fas', 'cart-shopping']} />
              </button>
            </div>
          </li>
      </ul>
      <span onClick={toggleMenu} className={css.menuBlackout} data-open={menuState}></span>
    </nav>
  );
};

export default Navbar;
