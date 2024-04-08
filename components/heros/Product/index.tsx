'use client'
import React, { Fragment, useEffect, useState } from 'react'


import classes from './index.module.scss'
import { Category, Product } from '../../../components/types/product-type'
import { Gutter } from '../../../components/blocks/gutter/gutter'
import { Media } from '../../../components/blocks/Media'
import { Price } from '../../../components/blocks/Price'
import { AddToCartButton } from '../../../components/blocks/AddToCartButton'
import cookieBasedClient from '@/components/config/cookiebased-client'
import { getUrl } from 'aws-amplify/storage'
import { DotsNav, Slide, SliderProvider, SliderTrack, useSlider } from '@faceless-ui/slider'
import dataClient from '@/components/config/data-server-client'
import Link from 'next/link'
import Icon from '@/components/utils/icon.util'
import dataClientPrivate from '@/components/config/data-server-client-private'

export const ProductHero: React.FC<{ 
  product
}> = ({ product }) => {
  const { title, categories, description, images } = product
  const [mediaUrls, setMediaUrls] = useState([]);
  const [category, setCategory] = useState<any>();
  console.log('categories', categories)
  useEffect(() => {
    const fetchMedia = async () => {
      const fetchedMediaPromises = images.map(imageId =>
        dataClient.models.Media.get({ id: imageId, authMode: 'apiKey' })
      );

      const fetchedMediaResults = await Promise.all(fetchedMediaPromises);
      const urls = await Promise.all(
        fetchedMediaResults.map(async ({ data }) => {
          if (data) {
            const { url: urlResult } = await getUrl({ key: data.url });
            return urlResult.href;
          }
          return null;
        })
      );

      setMediaUrls(urls.filter(url => url !== null));
    };

    const fetchCategory = async () => {
      const {data: fetchedCategory} = await dataClient.models.Category.get({id: categories[0]})
      setCategory(fetchedCategory)
    }
    fetchCategory();
    fetchMedia();
  }, [product.images]);

  return (
    <>
    <div className={classes.heroWrap}>
<Link className={classes.heroWrap_link} href='/products'><Icon icon={['fas', 'chevron-left']}/>Back</Link>
</div>
    <Gutter className={classes.productHero}>
      
<div className={classes.sliderWrapper}>
<SliderProvider slidesToShow={1} scrollSnap >
      
      <SliderTrack className={classes.track}>
       {mediaUrls && mediaUrls.length > 0 && mediaUrls.map((url, index) => (
            <Slide index={index}>
              <div className={classes.mediaWrapper} >
                
                <Media imgClassName={classes.image} resource={url} fill />
               
              </div>
             
            </Slide>
          ))}
           </SliderTrack>
           {mediaUrls && mediaUrls.length > 1 && (<DotsNav
          className={classes.dots}
          dotClassName={classes.dot}
          activeDotClassName={classes.dotIsActive}
          
        />)}
      </SliderProvider>

      </div>
      <div className={classes.details}>
        <h3 className={classes.title}>{title}</h3>

        <div className={classes.categoryWrapper}>
          <div className={classes.categories}>
                <p  className={classes.category}>
                  {category !== undefined && category?.title}
                  <span className={classes.separator}>|</span>
                </p>
          </div>
          <p className={classes.stock}> In stock</p>
        </div>

        <Price product={product} button={false} />

        <div className={classes.description}>
          <h6>Description</h6>
          <p>{description}</p>
        </div>

        <AddToCartButton product={product} className={classes.addToCartButton} />
      </div>
    </Gutter>
    </>
  )
}