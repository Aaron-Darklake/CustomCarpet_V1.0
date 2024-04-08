'use client'

import React, { useEffect, useState } from 'react'


import classes from './index.module.scss'
import { Product } from '../../../components/types/product-type'


interface PriceData {
  unit_amount?: string;
  currency?: string;
  type?: string;
  recurring?: string;
  // ... include other properties as needed
}

const parsePriceData = (dataString) => {
  const dataObj: PriceData={} ;
  const keyValuePairs = dataString?.split(', ').map(pair => pair.split('='));
  keyValuePairs?.forEach(([key, value]) => {
    dataObj[key] = value;
  });
  return dataObj;
};

export const priceFromJSON = (priceJSON, quantity: number = 1, raw?: boolean ) => {
  let price = '';
  const data = parsePriceData(priceJSON);
  console.log(data);
  
  if (data) {
    const priceValue = parseFloat(data.unit_amount) * quantity;
    console.log(priceValue);
    const priceType = data.type;
    console.log(priceType);
    const currencySymbol = data.currency === 'eur' ? '€' : '$'; // Adjust this line as needed for other currencies
    console.log(currencySymbol);


    if(raw){
      price = priceValue.toString();
    } else{
    price = (priceValue / 100).toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR', // TODO: use `parsed.currency`
    })}
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

export const Price: React.FC<{
  product: Product
  quantity?: number
  button?: 'addToCart' | 'removeFromCart' | false
}> = props => {
  const { product, product: { priceJSON } = {}, button = 'addToCart', quantity } = props

  const [price, setPrice] = useState<{
    actualPrice: string
    withQuantity: string
  }>(() => ({
    actualPrice: priceFromJSON(priceJSON),
    withQuantity: priceFromJSON(priceJSON, quantity),
  }))

  useEffect(() => {
    setPrice({
      actualPrice: priceFromJSON(priceJSON),
      withQuantity: priceFromJSON(priceJSON, quantity),
    })
  }, [priceJSON, quantity])

  return (
    <div className={classes.actions}>
      {typeof price?.actualPrice !== 'undefined' && price?.withQuantity !== '' && (
        <div className={classes.price}>
          <p>{price?.withQuantity}</p>
        </div>
      )}
    </div>
  )
}
