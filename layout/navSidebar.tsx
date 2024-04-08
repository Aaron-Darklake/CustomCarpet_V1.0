'use client'

import React, { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { Modal, ModalToggler, useModal } from '@faceless-ui/modal';
import classes from '../styles/structure/navSidebar.module.scss'
import Icon from '@/components/utils/icon.util';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { CaretDownIcon } from '@radix-ui/react-icons';
import Categories from '@/components/sections/Categories';
import dataClient from '@/components/config/data-server-client';
import CategoryCard from '@/components/sections/Categories/CategoryCard';
import { useFilter } from '@/providers/Filter';
import CategoryCardSmall from '@/components/blocks/CategoryCardSmall';
import { useAuth } from '@/providers/Auth';
import { ThemeSelector } from '@/providers/Theme/ThemeSelector';
import { useRouter } from 'next/navigation';


const modalSlug = 'sidebar-drawer';
interface ListItemProps {
  href: string;
  title: string;
  children: React.ReactNode;
}

const ListItem: React.FC<ListItemProps> = ({ href, title, children }) => (
  <li>
    <NavigationMenu.Link asChild>
      <a className={classes.ListItemLink}href={href}>
        <div className={classes.ListItemHeading}>{title}</div>
        <p className={classes.ListItemText}>{children}</p>
      </a>
    </NavigationMenu.Link>
  </li>
);

const NavSidebar: React.FC = () => {

  
  const{toggleModal} = useModal()
  const{user, userAttributes}=useAuth()
  const router = useRouter()
  const[categories, setCategories]= useState([])
  const{categoryFilters, setCategoryFilters, setSort}= useFilter()
  const[isMobile,setIsMobile]=useState(false)

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

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const { data,errors } = await dataClient.models.Category.list({
        authMode: 'apiKey'
      });
      console.log('fetched categoreis',data);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Handle the error appropriately
    }
  };
  console.log('userAttributes', userAttributes)
  fetchCategories();

},[])
  

const handleAll = () =>{
   const allCategoryIds = categories.map(category => category.id);
   setCategoryFilters(allCategoryIds)
   setSort('-createdAt')
   toggleModal('sidebar-drawer')
   router.push('/products')
 }


  return (
    <Fragment>
        <Modal
        slug={modalSlug}
        className={classes.modal}
      >
          
        <div className={classes.wrapper}>
            <div className={classes.modal_header}>
                <div className={classes.modal_header_container}>
                <p>Menu</p>
                </div>
                
                  <ModalToggler
                      slug={modalSlug}
                      className={classes.collection_list_header_btn_close}
                  >
                      <Icon icon={['fas', 'close']} />
                  </ModalToggler>
                  </div>

         <NavigationMenu.Root className={classes.NavigationMenuRoot} orientation='vertical'>
      <NavigationMenu.List className={classes.NavigationMenuList}>
      <NavigationMenu.Item className={classes.NavigationMenuItem}>
          <Link className={classes.NavigationMenuLink} href="/" onClick={()=>toggleModal(modalSlug)}>
            Home
          </Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item className={classes.NavigationMenuItem}>
          {isMobile ?(
          <button type='button' onClick={handleAll} className={classes.NavigationMenuTrigger}>
          Products
          </button>
          ):(
            <>
          <NavigationMenu.Trigger className={classes.NavigationMenuTrigger}>
            Products <CaretDownIcon className={classes.CaretDown} aria-hidden />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className={classes.NavigationMenuContent}>
            <ul className={classes.List}>
            <div className={classes.titleWrapper}>
        <h3>Products by Categories</h3>
        <Link href="/products" className={classes.link} onClick={handleAll}>Show All</Link>
      </div>

      <div className={classes.list}>
        {categories.map(category => {
          return <CategoryCardSmall key={category.id} category={category} />
        })}
      </div>
            </ul>
          </NavigationMenu.Content>
          </>)}
          
        </NavigationMenu.Item>

        <NavigationMenu.Item className={classes.NavigationMenuItem}>
          <Link className={classes.NavigationMenuLink} href='/cart' onClick={()=>toggleModal(modalSlug)}>
            Cart
          </Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item className={classes.NavigationMenuItem}>
          <Link className={classes.NavigationMenuLink} href={userAttributes && userAttributes?.email !== undefined ? '/account' : '/login'} onClick={()=>toggleModal(modalSlug)}>
            Account
          </Link>

        </NavigationMenu.Item>
       

       
      </NavigationMenu.List>

      <div className={classes.ViewportPosition}>
        <NavigationMenu.Viewport className={classes.NavigationMenuViewport} />
      </div>
    </NavigationMenu.Root>
        
         <div>
          <ThemeSelector/>
         </div>
        </div>
        <ModalToggler
            slug={modalSlug}
            className={classes.close}
          >
          </ModalToggler>
      </Modal>
    </Fragment>
  );
};



export default NavSidebar;
