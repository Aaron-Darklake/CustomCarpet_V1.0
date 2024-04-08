'use client'
import React, { useEffect, useState } from 'react';
import MainLayout from './main-layout';
import  Hero  from '../components/sections/hero/hero';
import Categories from '../components/sections/Categories';
import '../styles/css/variables.css'
import '../styles/css/global.css'
import "../node_modules/the-new-css-reset/css/reset.css"
import Contact from '../components/sections/contact/contact';
import ConfigureAmplifyClientSide from '../components/config/ConfigureAmplifyClientSide';
import dataClient from '@/components/config/data-server-client';

import { set } from 'react-hook-form';
import { RelatedProductsHero } from '@/components/blocks/Blocks/RelatedProductsHero';


const HomePage =  () => {



  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

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

   const fetchProducts = async ( ) => {
    try {
      const { data, errors } = await dataClient.models.Product.list({
        authMode: 'apiKey'
      });
      console.log('fetched products', data);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Handle the error appropriately
    }
  }
   
    fetchProducts();
    fetchCategories();
  }, []);

    

  return (
    <main style={{ scrollBehavior: 'smooth' }}>
      <ConfigureAmplifyClientSide/>
      <MainLayout>
        <Hero/>
        <Categories categories={categories}/>
        <RelatedProductsHero  blockType='relatedProducts' blockName='Related Product' relationTo='products' docs={products || undefined} categories={categories} />
        <Contact/>
      </MainLayout>
    </main>
  );
};

export default HomePage;
