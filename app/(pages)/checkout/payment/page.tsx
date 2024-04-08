'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { Elements, PaymentElement, useElements } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'

import classes from './index.module.scss'
import { useAuth } from '@/providers/Auth'

import { useCheckout } from '@/providers/Checkout'
import dotenv from 'dotenv'
import { loadStripe } from '@stripe/stripe-js'
import { getPaymentMethodFromIntent } from '@/app/actions/stripe/createCustomer'
import { useCart } from '@/providers/Cart'
import CheckoutForm from '../CheckoutForm'
import CheckoutCart from '@/components/blocks/CheckoutCart'
import { Gutter } from '@/components/blocks/gutter/gutter'
import { Button } from '@/components/blocks/Button'


dotenv.config();

const apiKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
console.log('apiKey', apiKey)
const stripePromise = loadStripe(apiKey)

export default function CheckoutPagePayment() {
  

  const { user, userAttributes } = useAuth()
  const {cartTotal} = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [stepDone,setStepDone]=useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('');
  const [selectedPaymentOptionDetails, setSelectedPaymentOptionDetails] = useState<any>({});

  
  const { completeStep, goToStep, completedSteps, currentStep, shippingMethod, paymentIntentClientSecret, handlePaymentMethod } = useCheckout();

 
  

  useEffect(() => {
    if(completedSteps[2]){
      setStepDone(true)
      setSelectedPaymentOption(completedSteps[2].paymentMethod.type)
      setSelectedPaymentOptionDetails(completedSteps[2].paymentMethod.details)
    } else {
      setStepDone(false)
    }
    if(!completedSteps[0]){
      goToStep(0);
      router.push('/checkout')
    }
   
   
}, [router, user, completedSteps])

const handleNavigate = () => {
  goToStep(3);
  router.push('/checkout/review')
}
  

  useEffect(() => {
    if(!completedSteps[1]){
        goToStep(1);
        router.push('/checkout/shipping')
      }
      if(cartTotal.raw<= 0){
        goToStep(0);
        router.push('/cart')
      }

    }, [router, user, completedSteps])

  if (!user ) return null
  console.log('completedSteps', completedSteps)
  console.log('currentStep', currentStep)
  
  const handleSubmit = async (event) => {
    event.preventDefault();
        // Store the payment method details for displaying on the review page
        // For example, using state, context, or local storage
        completeStep(2)
        // Navigate to the review page
        goToStep(currentStep + 1);
        router.push('/checkout/review');
      
    };

    const options = {
        mode: 'payment',
        amount: cartTotal.raw,
        currency: 'eur',
        paymentMethodCreation: 'manual',
        appearance: {theme:'stripe'},
      };
  

  

  return (
    <div className={classes.checkout}>
      <Gutter className={classes.gutter}>
    <Fragment>
    <div className={classes.shipping_contact_wrap}>
    {stepDone ? (
      <div>
        <div>
        <div className={classes.shipping_header}>
        <h2>Payment</h2>
        <button type='button' onClick={()=>setStepDone(false)}>Edit</button>
        </div>
        <div className={classes.shipping_information_card}>
          <div>
            <div className={classes.shipping_information_content_wrapper}>
              <div className={classes.shipping_information_content_grid}>
                <div className={classes.shipping_information_content_column}>
                  <p className={classes.shipping_information_content_column_header}>Payment Method</p>
                  {selectedPaymentOption === 'paypal' && (
                    <div className={classes.payment_details_wrapper}>
                     <div className={classes.payment_details_container}>
                      <span className={classes.payment_details_container_span}>
                        <div className={classes.payment_details_content}>
                          <div className={classes.payment_details_content_img}>
                          <img src="/logos/paypal.svg" alt="paypal" />
                          </div>
                          <div className={classes.payment_details_content_text}>
                            <div className={classes.payment_details_content_text_header}>
                              <p className={classes.payment_details_content_text_header_content}>PayPal</p>
                            </div>
                            <p className={classes.payment_details_content_text_subline}>Pay with PayPal</p>
                          </div>
                        </div>
                    </span>
                    </div>
                    </div>
                  )}
                  {selectedPaymentOption === 'card' && (
                    <div className={classes.payment_details_wrapper}>
                     <div className={classes.payment_details_container}>
                      <span className={classes.payment_details_container_span}>
                        <div className={classes.payment_details_content} style={{gap:'8px'}}>
                          <div className={classes.payment_details_content_img} >
                          <img src={`/logos/${selectedPaymentOptionDetails.card.brand}.svg`} alt={selectedPaymentOptionDetails.card.brand} />
                          </div>
                          <div className={classes.payment_details_content_text}>
                            <div className={classes.payment_details_content_text_header}>
                              <p className={classes.payment_details_content_text_header_content}>{`**** ${selectedPaymentOptionDetails.card.last4}`}</p>
                            </div>
                            <p className={classes.payment_details_content_text_subline}>{`expires: ${selectedPaymentOptionDetails.card.exp_month}/ ${selectedPaymentOptionDetails.card.exp_year}`}</p>
                          </div>
                        </div>
                    </span>
                    </div>
                    </div>
                  )}
                  <p className={classes.shipping_information_content_value}>{`${selectedPaymentOption}-${selectedPaymentOptionDetails.card?.brand}`}</p>
                </div>
               
          </div>
        </div>
        </div>
        </div>
       
        </div>
        <div className={classes.actions} style={{marginTop:'110px'}}>
        <Button label="Back" href="/checkout/shipping" appearance="secondary" />
        <Button
          label={isLoading ? 'Loading...' : 'Continue'}
          type="button"
          appearance="primary"
          disabled={isLoading}
          onClick={handleNavigate}
        />
      </div>
      </div>
      ):(
      <Elements stripe={stripePromise} options={JSON.parse(JSON.stringify(options))}>
        <CheckoutForm/>
      </Elements>
       )}
     <CheckoutCart/>
    </div>
    </Fragment>
    </Gutter>
    </div>
  ) 
}