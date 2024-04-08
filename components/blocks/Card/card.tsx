'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';


import classes from './card.module.scss'; // Ensure you have the corresponding CSS module
import { Product, Category } from '../../../components/types/product-type';
import { Media } from '../Media';
import { Price } from '../Price';
import dataClient from '@/components/config/data-server-client';
import { getUrl } from 'aws-amplify/storage';
import { DotsNav, Slide, SliderProvider, SliderTrack, useSlider } from '@faceless-ui/slider';

interface PriceData {
  unit_amount?: string;
  currency?: string;
  type?: string;
  recurring?: string;
  // ... include other properties as needed
}


const parsePriceData = (dataString) => {
  const dataObj: PriceData={} ;
  const keyValuePairs = dataString.split(', ').map(pair => pair.split('='));
  keyValuePairs.forEach(([key, value]) => {
    dataObj[key] = value;
  });
  return dataObj;
};

const priceFromJSON = (priceJSON) => {
  let price = '';
  const data = parsePriceData(priceJSON);
  console.log(data);
  
  if (data) {
    const priceValue = data.unit_amount;
    console.log(priceValue);
    const priceType = data.type;
    console.log(priceType);
    const currencySymbol = data.currency === 'eur' ? '€' : '$'; // Adjust this line as needed for other currencies
    console.log(currencySymbol);


    price = `${currencySymbol}${(parseFloat(priceValue) / 100).toFixed(2)}`;
    console.log(price);

    if (priceType === 'recurring' && data.recurring) {
      price += `/${
        priceJSON.recurring.interval_count > 1
          ? `${priceJSON.recurring.interval_count} ${priceJSON.recurring.interval}`
          : priceJSON.recurring.interval
      }`;
    }
  }

  return price;
};

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  showCategories?: boolean
  hideImagesOnMobile?: boolean
  title?: string
  relationTo?: 'products'
  doc?
}> = props => {
  const {
    showCategories,
    title: titleFromProps,
    doc,
    doc: { slug, title, categories, images, description, priceJSON } = {},
    className,
  } = props


  const [mediaUrls, setMediaUrls]=useState([])
  const [sliderKey, setSliderKey] = useState(0);
  const {goToNextSlide,goToPrevSlide}= useSlider()
  const hasCategories = categories && Array.isArray(categories) && categories.length > 0

  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/products/${slug}`

  useEffect(() => {
    setSliderKey(prevKey => prevKey + 1);
  }, [mediaUrls]);

  useEffect(() => {
    const fetchMedia = async () => {
      if (Array.isArray(images) && images.length > 0) {
        try {
          const fetchedMediaPromises = images.map(imageId =>
            dataClient.models.Media.get({ id: imageId, authMode: 'apiKey' })
          );
  
          const fetchedMediaResults = await Promise.all(fetchedMediaPromises);
          
          const mediaUrls = await Promise.all(
            fetchedMediaResults.map(async ({ data }) => {
              if (data) {
                const {url: urlResult} = await getUrl({ key: data.url });
                return urlResult.href; // Assuming getUrl returns an object with href
              }
              return null;
            })
          );
  
          // Filter out any null values and set your state with the media URLs
          const validMediaUrls = mediaUrls.filter(url => url !== null);
          // Assuming you have a state to store these URLs
          setMediaUrls(validMediaUrls);
        } catch (error) {
          console.error('Error fetching media:', error);
          // Handle the error appropriately
        }
      }
    };
  
    fetchMedia();
  }, [images]); // Dependency array includes 'images'
  

  const [
    price, // eslint-disable-line no-unused-vars
    setPrice,
  ] = useState(() => priceFromJSON(priceJSON))

  useEffect(() => {
    setPrice(priceFromJSON(priceJSON))
  }, [priceJSON])


  const displayCategories = categories?.map((categoryItem) => {
    if (typeof categoryItem === 'string') {
      return <span key={categoryItem}>{categoryItem}</span>;
    } else if (typeof categoryItem === 'object' && categoryItem !== null) {
      return <span key={categoryItem.id}>{categoryItem.title}</span>;
    }
  });


  return (
    <Link href={href} className={[classes.card, className].filter(Boolean).join(' ')} scroll={false}>
      <div className={classes.sliderWrapper}>
      <SliderProvider slidesToShow={1} scrollSnap key={sliderKey}>
      
        <SliderTrack className={classes.track}>
        
        {mediaUrls && mediaUrls.length > 0 && mediaUrls.map((url, index) => (
            <Slide index={index}>
              <div className={classes.mediaWrapper} >
                
                <Media imgClassName={classes.image} resource={url} fill />
               
              </div>
             
            </Slide>
          ))}
        
      </SliderTrack>
      {mediaUrls && mediaUrls.length > 1 ? (<DotsNav
          className={classes.dots}
          dotClassName={classes.dot}
          activeDotClassName={classes.dotIsActive}
          
        />):<div style={{width: '100%', height:'20px', marginTop: '-15px'}}></div>}
      </SliderProvider>
      </div>
      <div className={classes.content}>
        {titleToUse && (
          <h4 className={classes.title}>{titleToUse}</h4>
        )}
        {description && (
          <div className={classes.body}>
            {description && <p className={classes.description}>{sanitizedDescription}</p>}
          </div>
        )}
        {doc && <Price product={doc} />}
      </div>
    </Link>
  );
};

export default Card;
