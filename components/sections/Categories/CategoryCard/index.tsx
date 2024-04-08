'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'



import classes from './index.module.scss'
import { useFilter } from '../../../../providers/Filter'
import { Category, Media } from '../../../../components/types/product-type'
import dataClient from '@/components/config/data-server-client'
import { getUrl } from 'aws-amplify/storage'







const CategoryCard =  ({ category }) => {
const[media, setMedia] = useState('')
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const mediaId = category.categoryMediaId
        console.log('mediaId', mediaId)
        const {data: fetchedMedia, errors} = await dataClient.models.Media.get({id: mediaId, authMode:'apiKey'});
        console.log('fetched media', fetchedMedia);
        if(errors){
          console.error('Error fetching categories:', errors);
          return
        }
        const image = await getUrl({key: fetchedMedia.url, options: {accessLevel: 'guest',}})
        console.log('fetched image',image.url.href);
        setMedia(image.url.href);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Handle the error appropriately
      }
    };

    fetchCategories();
  }, []);
  
  const { setCategoryFilters, categoryFilters } = useFilter()
  const handleCategories = (categoryId: string) => {
    if (categoryFilters.includes(categoryId)) {
      const updatedCategories = categoryFilters.filter(id => id !== categoryId)

      setCategoryFilters(updatedCategories)
    } else {
      setCategoryFilters([...categoryFilters, categoryId])
    }
  }
  return (
    <div className={classes.card}  >

        <Link
          href="/products"
          className={classes.card}
          style={{ backgroundImage: `url(${media})` }}
          onClick={() => handleCategories(category.id)}>
          <p className={classes.title}>{category.title}</p>
        </Link>

    </div>
  );
}

export default CategoryCard