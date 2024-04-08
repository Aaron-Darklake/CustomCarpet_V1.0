'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'



import classes from './index.module.scss'
import dataClient from '@/components/config/data-server-client'
import { getUrl } from 'aws-amplify/storage'
import { useFilter } from '@/providers/Filter'
import { Media } from '../Media'
import { useModal } from '@faceless-ui/modal'







const CategoryCardSmall =  ({ category }) => {
const[media, setMedia] = useState('')
const{toggleModal}=useModal()
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
      const updatedCategories = categoryFilters.filter(id => id === categoryId)

      setCategoryFilters(updatedCategories)
    } else {
      setCategoryFilters([categoryId])
    }
    toggleModal('sidebar-drawer')
  }
  return (
    <div className={classes.card}  >
        <Link href="/products" className={classes.item} onClick={() => handleCategories(category.id)}>
                      <div className={classes.mediaWrapper}>
                        {!media && (
                          <div className={classes.placeholder}>No image</div>
                        )}
                        {media && typeof media === 'string' && (
                          <Media imgClassName={classes.image} resource={media} fill />
                        )}
                      </div>
                      <div className={classes.itemDetails}>
                        <h6>{category.title}</h6>
                        <p>{`Show products`}</p>
                      </div>
                    </Link>
    </div>
  );
}

export default CategoryCardSmall