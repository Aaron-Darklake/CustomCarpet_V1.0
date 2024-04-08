'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'


import classes from './index.module.scss'
import { useAuth } from '@/providers/Auth'
import { useCart } from '@/providers/Cart'
import { Button } from '@/components/blocks/Button'
import dataClient from '@/components/config/data-server-client'
import { getUrl } from 'aws-amplify/storage'
import dotenv from 'dotenv'
import TextInput from '@/components/admin/textInput/TextInput'
import { useCheckout } from '@/providers/Checkout'
import CheckoutCart from '@/components/blocks/CheckoutCart'
import { Gutter } from '@/components/blocks/gutter/gutter'
import { RadioButton } from '@/components/blocks/radioButton/radio'
import { RadioButton2 } from '@/components/blocks/RadioGroup/RadioGroup'


export default function CheckoutPageDelivery() {

  const { user, userAttributes } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [stepDone,setStepDone]=useState(false);


  const { cart, cartIsEmpty, cartTotal, updateShippingCosts,subtotal } = useCart()
  const { completeStep, goToStep, completedSteps, currentStep, updateShippingMethod } = useCheckout();
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('DHL-standard'); // default to 'standard'

  const handleDeliveryOptionChange = (option) => {
    setSelectedDeliveryOption(option);
    const shippingCost = option === 'DHL-express' ? 1500 : 1000; // 15€ for express, 10€ for standard
    updateShippingCosts(shippingCost); // Assuming this is a method from useCart
  };

  const handleSubmit = (event: React.FormEvent) => {
    setIsLoading(true)
    event.preventDefault();
    updateShippingMethod(selectedDeliveryOption);
    completeStep(1, {shippingMethod: {methode: selectedDeliveryOption}});
    goToStep(2); // Assuming this is step 1
    router.push('/checkout/payment')
    setIsLoading(false)
  };


 


  useEffect(() => {
    if (user !== null && cartIsEmpty) {
      router.push('/cart')
    }
    if(!completedSteps[0]){
      goToStep(0);
      router.push('/checkout')
    }
  }, [router, user, cartIsEmpty, completedSteps])

  useEffect(() => {
    if(completedSteps[1]){
      setStepDone(true)
      setSelectedDeliveryOption(completedSteps[1].shippingMethod.methode)
    } else {
      setStepDone(false)
    }
    if(!completedSteps[0]){
      goToStep(0);
      router.push('/checkout')
    }
    const shippingCost = selectedDeliveryOption === 'DHL-express' ? 1500 : 1000; // 15€ for express, 10€ for standard
    updateShippingCosts(shippingCost);
   
}, [router, user, completedSteps])

 

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!cart?.items) return;

      const items = await Promise.all(cart.items.map(async (item) => {
        try {
          const { data: product } = await dataClient.models.Product.get({ id: (typeof item.product === 'string' ? item.product : item.product.id) });
          if (typeof product === 'object') {
            const { data: fetchImage } = await dataClient.models.Media.get({ id: product.images[0] });
            const { url: imageUrl } = await getUrl({ key: fetchImage.url });
            const metaImage = imageUrl.href;
            const quantity = item.quantity
            return {
              ...item,
              product,
              quantity,
              metaImage
            };
          }
        } catch (error) {
          console.error('Error fetching cart item data:', error);
        }
        return null;
      }));

    };

    fetchCartItems();
  }, [cart]);

  if (!user ) return null

  const handleNavigate = () => {
    goToStep(2);
    router.push('/checkout/payment')
  }

  

  return (
    <div className={classes.checkout}>
      <Gutter className={classes.gutter}>
    <Fragment>
      <div className={classes.shipping_contact_wrap}>
      {stepDone ? (
      <div>
        <div>
        <div className={classes.shipping_header}>
        <h2>Delivery</h2>
        <button type='button' onClick={()=>setStepDone(false)}>Edit</button>
        </div>
        <div className={classes.shipping_information_card}>
          <div>
            <div className={classes.shipping_information_content_wrapper}>
              <div className={classes.shipping_information_content_grid}>
                <div className={classes.shipping_information_content_column}>
                  <p className={classes.shipping_information_content_column_header}>Delvery Method</p>
                  <p className={classes.shipping_information_content_value}>{`${selectedDeliveryOption} `}</p>
                </div>
               
          </div>
        </div>
        </div>
        </div>
       
        </div>
        <div className={classes.actions} style={{marginTop:'110px'}}>
        <Button label="Back" href="/checkout" appearance="secondary" />
        <Button
          label={isLoading ? 'Loading...' : 'Continue to payment'}
          type="button"
          appearance="primary"
          disabled={isLoading}
          onClick={handleNavigate}
        />
      </div>
      </div>
      ):(
      <form onSubmit={handleSubmit}>
      <div className={classes.contact_wrap}>
      <div className={classes.contact_header}>
        <h2>Delivery</h2>
      </div>
      <div className={classes.shipping_input_wrapper_1col}>
        <RadioButton2 label='Standard' value='DHL-standard' isSelected={selectedDeliveryOption === 'DHL-standard'} price='+10,00 €' onRadioChange={() => handleDeliveryOptionChange('DHL-standard')}/>
        <RadioButton2 label='Express' value='DHL-express' isSelected={selectedDeliveryOption === 'DHL-express'}  price='+15,00 €' onRadioChange={() => handleDeliveryOptionChange('DHL-express')}/>

      </div>
      </div>
      <div className={classes.actions}>
        <Button label="Back" href="/checkout" appearance="secondary" />
        <Button
          label={isLoading ? 'Loading...' : 'Continue'}
          type="submit"
          appearance="primary"
          disabled={isLoading}
        />
      </div>
      </form>)}
      <CheckoutCart/>
      </div>

    
    </Fragment>
    </Gutter>
    </div>
  )
}