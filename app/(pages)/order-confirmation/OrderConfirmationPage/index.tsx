'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'


import classes from './index.module.scss'
import { useCart } from '@/providers/Cart'
import { Message } from '@/components/blocks/Message'
import { Button } from '@/components/blocks/Button'
import { useCheckout } from '@/providers/Checkout'
import dataClientPrivate from '@/components/config/data-server-client-private'
import { useAuth } from '@/providers/Auth'
import CheckoutCartReverse from '@/components/blocks/CheckoutCartReverse'

export const OrderConfirmationPage: React.FC<{}> = () => {
  const searchParams = useSearchParams()
  const orderID = searchParams.get('order_id')
  const error = searchParams.get('error')

  const { clearCart } = useCart()
  const {resetCheckout, completedSteps} = useCheckout()
  const [order, setOrder] = useState<any>({})
  const [mail, setMail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState({code:'',country:''});
  const [company, setCompany] = useState('');
  const [stepDone,setStepDone]=useState(false);

  const [firstNameBilling, setFirstNameBilling] = useState('');
  const [lastNameBilling, setLastNameBilling] = useState('');
  const [addressBilling, setAddressBilling] = useState('');
  const [cityBilling, setCityBilling] = useState('');
  const [zipBilling, setZipBilling] = useState('');
  const [countryBilling, setCountryBilling] = useState({code:'',country:''});
  const [companyBilling, setCompanyBilling] = useState('');
  const [differentBillingAddress, setDifferentBillingAddress] = useState(false);
  const { user, userAttributes } = useAuth()
  const router = useRouter()
  const {paymentMethod}=useCheckout()
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(''); // default to 'standard'
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('');
  const [summary, setSummary]= useState<any>({})

  useEffect( () => {
    if(completedSteps[0]?.shippingInformation){
      setMail(completedSteps[0].shippingInformation.mail)
      setPhone(completedSteps[0].shippingInformation.phone)
      setFirstName(completedSteps[0].shippingInformation.firstName)
      setLastName(completedSteps[0].shippingInformation.lastName)
      setAddress(completedSteps[0].shippingInformation.address)
      setCity(completedSteps[0].shippingInformation.city)
      setZip(completedSteps[0].shippingInformation.zip)
      setCountry(completedSteps[0].shippingInformation.country)
      setCompany(completedSteps[0].shippingInformation.company)
      setStepDone(true)
    } 
    if(completedSteps[0]?.billingInformation){
      if(completedSteps[0].billingInformation === 'isSame'){
        setDifferentBillingAddress(false)
      } else{
        setDifferentBillingAddress(true)
        setFirstNameBilling(completedSteps[0].billingInformation.firstName)
        setLastNameBilling(completedSteps[0].billingInformation.lastName)
        setAddressBilling(completedSteps[0].billingInformation.address)
        setCityBilling(completedSteps[0].billingInformation.city)
        setZipBilling(completedSteps[0].billingInformation.zip)
        setCountryBilling(completedSteps[0].billingInformation.country)
        setCompanyBilling(completedSteps[0].billingInformation.company)
      }
    }
    if(completedSteps[1]){
      setSelectedDeliveryOption(completedSteps[1].shippingMethod.methode)
    } 
    if(completedSteps[2]){
      setSelectedPaymentOption(paymentMethod.type)
    } 

    if(completedSteps[3]){
      setSummary(completedSteps[3].reviewSummary)
    }

   
}, [ user, completedSteps])

  useEffect(() => {
   if(completedSteps.length >= 3){
    console.log('completedSteps', completedSteps)
   }
   const fetchOrder = async ()=>{
    const {data: orderData} = await dataClientPrivate.models.Order.get({id: orderID})
    console.log('orderData', orderData)
    setOrder(orderData)
   }
   fetchOrder()
  }, [])

  const clearOrder = ()=>{
    clearCart()
    resetCheckout()
    router.push(`/orders/${orderID}`)
  }
  const clearOrder1 = ()=>{
    clearCart()
    resetCheckout()
    router.push(`/orders`)
  }

  function formatDate(dateInput: string | number | Date): string {
    const date = new Date(dateInput);
  
    // Get date components
    const dayOfMonth = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
  
    // Get time components
    const hour = date.getHours();
    const minute = date.getMinutes();
  
    // Get the ordinal suffix for the day
    const ordinalSuffix = getOrdinalSuffix(dayOfMonth);
  
    // Format the time with AM/PM
    const timeFormatted = new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  
    // Construct the full date string
    return `${month} ${dayOfMonth}${ordinalSuffix} ${year}, ${timeFormatted}`;
  }

  function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }

  return (
    <div style={{width:'100%'}}>
      {error ? (
        <Fragment>
          <Message error={error} />
          <p>
            {`Your payment was successful but there was an error processing your order. Please contact us to resolve this issue.`}
          </p>
          <div className={classes.actions}>
            <Button href="/account" label="View account" appearance="primary" />
            <Button
              href={`/orders`}
              label="View all orders"
              appearance="secondary"
            />
          </div>
        </Fragment>
      ) : (
        <div className={classes.OrderConfirmation_wrapper}>
          <div className={classes.title_wrapper}>
          <h1 >Thank you!</h1>
          <h1>Your order was placed sucessfully.</h1>
          </div>
          <div className={classes.subTitle_wrapper}>
            <p>We have sent the order confirmation details to <span>{completedSteps[0]?.shippingInformation.mail}</span></p>
            <p>{`Order date: ${formatDate(order.createdAt)}`}</p>
            <p>{`Order ID: ${orderID}`}</p>
          </div>
          <div style={{marginTop:'35px'}}>
            <CheckoutCartReverse/>
          </div>

          <div className={classes.shipping_contact_container}>
          <div className={classes.shipping_card_container}>
        <div className={classes.shipping_header}>
        <h2>Shipping Information</h2>
        </div>
        <div className={classes.shipping_information_card}>
          <div>
            <div className={classes.shipping_information_content_wrapper}>
              <div className={classes.shipping_information_content_grid}>
                <div className={classes.shipping_information_content_column}>
                  <p className={classes.shipping_information_content_column_header}>Shipping Address</p>
                  <p className={classes.shipping_information_content_value}>{`${firstName} ${lastName}`}</p>
                  <p className={classes.shipping_information_content_value}>{`${company}`}</p>
                  <p className={classes.shipping_information_content_value}>{`${address}`}</p>
                  <p className={classes.shipping_information_content_value}>{`${zip} - ${city}`}</p>
                  <p className={classes.shipping_information_content_value}>{`${country.country}`}</p>
                </div>
                <div className={classes.shipping_information_content_column}>
                <p className={classes.shipping_information_content_column_header}>Contact</p>
                  <p className={classes.shipping_information_content_value}>{`${mail}`}</p>
                  <p className={classes.shipping_information_content_value}>{`${phone}`}</p>
                </div>
                <div className={classes.shipping_information_content_column}>
                <p className={classes.shipping_information_content_column_header}>Billing Address</p>
                  {differentBillingAddress ? (
                    <Fragment>
                      <p className={classes.shipping_information_content_value}>{`${firstNameBilling} ${lastNameBilling}`}</p>
                      <p className={classes.shipping_information_content_value}>{`${companyBilling}`}</p>
                      <p className={classes.shipping_information_content_value}>{`${addressBilling}`}</p>
                      <p className={classes.shipping_information_content_value}>{`${zipBilling} - ${cityBilling}`}</p>
                      <p className={classes.shipping_information_content_value}>{`${countryBilling.country}`}</p>
                    </Fragment>):(<Fragment>
                      <p className={classes.shipping_information_content_value}>Billing- and delivery address are the same.</p>
                    </Fragment>)}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        <div className={classes.shipping_card_container}>
        <div className={classes.shipping_header}>
        <h2>Delivery</h2>
        </div>
        <div className={classes.shipping_information_card}>
          <div>
            <div className={classes.shipping_information_content_wrapper}>
              <div className={classes.shipping_information_content_grid}>
                <div className={classes.shipping_information_content_column}>
                  <p className={classes.shipping_information_content_column_header}>Delivery Method</p>
                  <p className={classes.shipping_information_content_value}>{`${selectedDeliveryOption} `}</p>
                </div>
               
          </div>
        </div>
        </div>
        </div>
        </div>


        <div className={classes.shipping_card_container}>
        <div className={classes.shipping_header}>
        <h2>Payment</h2>
        </div>
        <div className={classes.shipping_information_card}>
          <div>
            <div className={classes.shipping_information_content_wrapper}>
              <div className={classes.shipping_information_content_grid}>
                <div className={classes.shipping_information_content_column}>
                  <p className={classes.shipping_information_content_column_header}>Payment Method</p>
                  <p className={classes.shipping_information_content_value}>{`${selectedPaymentOption} `}</p>
                </div>
                <div className={classes.shipping_information_content_column}>
                  <p className={classes.shipping_information_content_column_header}>Payment Details</p>
                  {summary && summary.card && (
                   <div className={classes.payment_details_wrapper}>
                   <div className={classes.payment_details_container}>
                    <span className={classes.payment_details_container_span}>
                      <div className={classes.payment_details_content} style={{gap:'8px'}}>
                        <div className={classes.payment_details_content_img} >
                        <img src={`/logos/${summary.card.brand}.svg`} alt={summary.card.brand} />
                        </div>
                        <div className={classes.payment_details_content_text}>
                          <div className={classes.payment_details_content_text_header}>
                            <p className={classes.payment_details_content_text_header_content}>{`**** ${summary.card.last4}`}</p>
                          </div>
                          <p className={classes.payment_details_content_text_subline}>{`expires: ${summary.card.exp_month}/${summary.card.exp_year}`}</p>
                        </div>
                      </div>
                  </span>
                  </div>
                  </div>
                  )}
                </div>
               
          </div>
        </div>
        </div>
        </div>
       
        </div>
        </div>

          <div className={classes.actions}>
            <Button href={`/orders/${orderID}`} label="View order" onClick={clearOrder} appearance="primary" />
            <Button
              href={`/orders`}
              label="View all orders"
              appearance="secondary"
              onClick={clearOrder1}
            />
          </div>
        </div>
      )}
    </div>
  )
}