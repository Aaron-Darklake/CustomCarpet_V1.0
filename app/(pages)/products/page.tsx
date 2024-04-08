'use client'
import React, { useEffect, useState } from 'react';
import { Gutter } from '../../../components/blocks/gutter/gutter';
import classes from './products.module.scss'
import mockCategories from '../../../content/index/categories.json'
import mockProducts from '../../../content/index/products.json'
import mockPage from '../../../content/index/page.json'
import { Blocks } from '../../../components/sections/Blocks';
import { Page } from '../../../components/types/product-type';
import Filters from './Filters';
import config from '../../../amplifyconfiguration.json';

import { Amplify } from 'aws-amplify';
import dataClient from '@/components/config/data-server-client';
Amplify.configure(config, {
  ssr: true
});

// Mocked product data

let page: Page
page = {
  id: "65b11f7bb49cec3a4eb2de6c",
  title: "Products",
  publishedOn: "2024-01-24T14:32:27.287+00:00",
  "hero": {
    type: "none",
    richText: [
      {
        type: "h3",
        children: [
          {
            text: "Products"
          }
        ]
      }
    ],
    links: [],
    media: null
  },
  layout: [
    {
      introContent: [
        {
          type: "p",
          children: [
            {
              text: ""
            }
          ]
        }
      ],
      populateBy: "collection",
      relationTo: "products",
      categories: [],
      limit: 9,
      id: "65b11f7be0a5bf17b62167a5",
      blockName: "Archive Block",
      blockType: "archive"
    }
  ],
  slug: "products",
  meta: {
    title: "Shop all products",
    description: "Shop everything from goods and services to digital assets and gated content",
    
  },
  createdAt: "2024-01-24T14:32:27.290+00:00",
  updatedAt: "2024-01-24T16:00:30.386+00:00",
  _status: "published",
}

  

const Products =  () => {
  const [categories, setCategories] = useState([]);

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

    fetchCategories();
  }, []);


  return (
    <div className={classes.container}>
    <Gutter className={classes.products}>
        <Filters categories={categories}/>
        <Blocks blocks={page.layout} disableTopPadding={true} />
    </Gutter> 
    </div>
  );
};

export default Products;
