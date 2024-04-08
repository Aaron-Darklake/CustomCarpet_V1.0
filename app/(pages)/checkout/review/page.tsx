'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { Elements, PaymentElement, useElements } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'

import classes from './index.module.scss'
import { useAuth } from '@/providers/Auth'

import { useCheckout } from '@/providers/Checkout'
import dotenv from 'dotenv'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutCart from '@/components/blocks/CheckoutCart'
import { Gutter } from '@/components/blocks/gutter/gutter'
import { Button } from '@/components/blocks/Button'
import { deletePaymentIntent, summarizePayment, summarizePaymentAttached } from '@/app/actions/stripe/createCustomer'
import { useCart } from '@/providers/Cart'
import { priceFromJSON } from '@/components/blocks/Price'
import dataClientPrivate from '@/components/config/data-server-client-private'
import dataClient from '@/components/config/data-server-client'
import { sendOrderConfirmEmail } from '@/app/actions/sendEmail'
import { getUrl } from 'aws-amplify/storage'


dotenv.config();

const apiKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
console.log('apiKey', apiKey)
const stripePromise = loadStripe(apiKey)

export default function CheckoutPageReview() {
  

  const { user, userAttributes } = useAuth()
  const {cartTotal, cart, subtotal, additionalCosts}=useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

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
  const [summary, setSummary]=useState({} as any)
  const [errorMessage, setErrorMessage] = useState('');

  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(''); // default to 'standard'
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('');
  
  
  const { completeStep, goToStep, completedSteps, currentStep, shippingMethod, paymentIntentClientSecret, handlePaymentIntentClientSecret, paymentMethod } = useCheckout();

  const [isPaymentIntentCreated, setIsPaymentIntentCreated] = useState(false);

  useEffect(() => {
    const managePaymentIntent = async () => {
      if (!isPaymentIntentCreated) {
        if (paymentIntentClientSecret) {
          // If there's an existing client secret, cancel the intent
          await deletePaymentIntent(paymentIntentClientSecret);
        }

        if (paymentMethod?.details) {
          if (typeof paymentMethod.details.customer === 'string') {
            // Attach and summarize payment
            const data = await summarizePaymentAttached({
              paymentMethodId: paymentMethod.details.id,
              amount: cartTotal.raw,
              customerId: userAttributes?.['custom:stripeCustomerID']
            });
            setIsPaymentIntentCreated(true);
            setSummary(data.paymentMethod.details)
            handlePaymentIntentClientSecret(data.clientSecret);
          } else if (typeof paymentMethod.details === 'string') {
            // Summarize payment
            const data = await summarizePayment({
              paymentMethodId: paymentMethod.details,
              amount: cartTotal.raw,
              customerId: userAttributes?.['custom:stripeCustomerID']
            });
            handlePaymentIntentClientSecret(data.clientSecret);
            setSummary(data.paymentMethod.details)
            setIsPaymentIntentCreated(true);
          }
        }
        
      }
    };

    managePaymentIntent();
  }, [paymentIntentClientSecret]);

  

 

  if (!user ) return null
  console.log('completedSteps', completedSteps)
  console.log('Payment Methode', paymentMethod)
  
 


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

   
}, [user, completedSteps])
  
console.log('summary', summary)
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

    const [cartItems, setCartItems] = useState([]);

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
                const productPrice = priceFromJSON(product.priceJSON, quantity)
                return {
                  ...item,
                  product,
                  quantity,
                  metaImage,
                  productPrice,
                };
              }
            } catch (error) {
              console.error('Error fetching cart item data:', error);
            }
            return null;
          }));
    
          setCartItems(items.filter(Boolean));
        };
    
        fetchCartItems();
      }, [cart]);
  
const handleSubmit = async (e) => {
  e.preventDefault()
  
  setIsLoading(true)
        // Before redirecting to the order confirmation page, we need to create the order in Payload
        // Cannot clear the cart yet because if you clear the cart while in the checkout
        // you will be redirected to the `/cart` page before this redirect happens
        // Instead, we clear the cart in an `afterChange` hook on the `orders` collection in Payload
        try {
          console.log('carttotal',cartTotal)
          const billingAddressDetails = differentBillingAddress ? {
            billingFirstName: JSON.parse(JSON.stringify(firstNameBilling)),
            billingLastName: JSON.parse(JSON.stringify(lastNameBilling)),
            billingAddress1: JSON.parse(JSON.stringify(addressBilling)),
            billingCity: JSON.parse(JSON.stringify(cityBilling)),
            billingZip: JSON.parse(JSON.stringify(zipBilling)),
            billingCountry: JSON.parse(JSON.stringify(countryBilling.country)),
            billingCountryCode: JSON.parse(JSON.stringify(countryBilling.code)),
            billingCompany: JSON.parse(JSON.stringify(companyBilling))
          } : {
            billingSame: JSON.parse(JSON.stringify(true)),
          };
          const {data: newOrder, errors} = await dataClientPrivate.models.Order.create({
            stripePaymentIntentID: JSON.parse(JSON.stringify(paymentIntentClientSecret)), 
            total: JSON.parse(JSON.stringify(cartTotal.raw)),
            subTotal: JSON.parse(JSON.stringify(subtotal.raw)),
            shippingCost: JSON.parse(JSON.stringify(additionalCosts.shipping)),
            shippingMethod: JSON.parse(JSON.stringify(shippingMethod.methode)),
            shippingStatus: JSON.parse(JSON.stringify('pending')),
            shippingFirstName: JSON.parse(JSON.stringify(firstName)),
            shippingLastName: JSON.parse(JSON.stringify(lastName)),
            shippingAddress1: JSON.parse(JSON.stringify(address)),
            shippingCity: JSON.parse(JSON.stringify(city)),
            shippingZip: JSON.parse(JSON.stringify(zip)),
            shippingCountry: JSON.parse(JSON.stringify(country.country)),
            shippingCountryCode: JSON.parse(JSON.stringify(country.code)),
            shippingCompany: JSON.parse(JSON.stringify(company)),
            ...billingAddressDetails,
            orderStatus: JSON.parse(JSON.stringify('confirmed')),
            

         

          })
          console.log('new order',newOrder)

          console.log('neworder error',errors)
          console.log('cartItems', cart.items)
           // Ensure cart.items is an array before mapping
          if (cartItems.length > 0) {
            // Use Promise.all to wait for all OrderItem creations
            const items = await Promise.all( cart.items.map(async ({ product, quantity }) => {
              // Create an order item for each cart item
              console.log('start map')
              console.log('product',product)
             
              const{data: fetchedProduct, errors} = await dataClient.models.Product.get({id: (typeof product === 'string' ? JSON.parse(JSON.stringify(product)):JSON.parse(JSON.stringify(product.id)))})
              console.log('fetchedProduct', fetchedProduct)
              console.log('error', errors)
              const{data: newOrderItem} = await dataClientPrivate.models.OrderItem.create({
                product: JSON.parse(JSON.stringify(fetchedProduct.id)),
                quantity: quantity,
                price: JSON.parse(priceFromJSON(fetchedProduct.priceJSON, quantity, true)),
                order: JSON.parse(JSON.stringify(newOrder)) // Assuming newOrder.id is the identifier needed
              });
             
              console.log('new item', newOrderItem)
              return newOrderItem; // Return the created OrderItem
            }));
            console.log('items', items)
            const {data: updatedOrder}= await dataClientPrivate.models.Order.update({
              id: JSON.parse(JSON.stringify(newOrder.id)),
              orderItems: JSON.parse(JSON.stringify(items.map(item => item.id)))
            })
            console.log('updatedOrder', updatedOrder)

          if (errors) {console.log('error while creating new order in database', errors)}
          const data = {
            name: `${firstName} ${lastName}`,
            email: mail,
            products: cartItems,
            shippingAddress: {
              name: `${firstName} ${lastName}`,
              street: address,
              city: city,
              zip: zip,
              country: country.country,
            },
            billingAddress: differentBillingAddress ? {
              name: `${firstNameBilling} ${lastNameBilling}`,
              street: addressBilling,
              city: cityBilling,
              zip: zipBilling,
              country: countryBilling.country,
            } : 'Billing- and delivery address are the same.' ,
            deliveryMethod: selectedDeliveryOption,
            paymentMethod: summary,
            totalPrice: cartTotal.formatted,
            subtotal: subtotal.formatted,
            shippingCost: additionalCosts.shipping,
            orderDate: newOrder.createdAt,
            orderId: newOrder.id,
          };
          console.log('data', data)
          // Call the server action
          const response = await sendOrderConfirmEmail(JSON.parse(JSON.stringify(data)));
          console.log('response', response)
          try {
            const {error: stripeError} = await (await stripePromise).confirmPayment({
              clientSecret: paymentIntentClientSecret,
              redirect: 'if_required',
              confirmParams: {
                return_url: `${process.env.NEXT_PUBLIC_SERVER_URL != undefined ? process.env.NEXT_PUBLIC_SERVER_URL: 'https://main.d3ojg15ybkzea4.amplifyapp.com'}/order-confirmation`,
              },
            });
          
        
              if (stripeError) {
                setErrorMessage(stripeError.message)
                completeStep(3,{reviewSummary: summary})
                setIsLoading(false)
              }
          } catch (err) {
              const msg = err instanceof Error ? err.message : 'Something went wrong.'
              setErrorMessage(`Error while submitting payment: ${msg}`)
              setIsLoading(false)
            }


          router.push(`/order-confirmation?order_id=${newOrder.id}`)}
        } catch (err) {
          // don't throw an error if the order was not created successfully
          // this is because payment _did_ in fact go through, and we don't want the user to pay twice
          console.error(err.message) // eslint-disable-line no-console
         // router.push(`/order-confirmation?error=${encodeURIComponent(err.message)}`)
        }

  
  }

  const handleNavigate = ({step,href}) => {
    goToStep(step);
    router.push(href)
  }

  return (
    <div className={classes.checkout}>
      <Gutter className={classes.gutter}>
    <Fragment>
      <div className={classes.shipping_contact_wrap}>
        <form onSubmit={handleSubmit}>
      <div className={classes.shipping_contact_container}>
       

        <div className={classes.shipping_card_container}>
        <div className={classes.shipping_header}>
        <h2>Shipping Information</h2>
        <button type='button' onClick={()=>handleNavigate({step:0,href:'/checkout'})}>Edit</button>
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
                <p className={classes.shipping_information_content_column_header}>Billing Adress</p>
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
        <button type='button' onClick={()=>handleNavigate({step:1,href:'/checkout/shipping'})}>Edit</button>
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
        <button type='button' onClick={()=>handleNavigate({step:2,href:'/checkout/payment'})}>Edit</button>
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


        <div className={classes.actions} style={{marginTop:'50px'}}>
        <Button label="Back" href="/checkout/payment" appearance="secondary" />
        <Button
          label={isLoading ? 'Loading...' : 'Submit Order'}
          type="submit"
          appearance="primary"
          //disabled={isLoading}
          //onClick={handleNavigate}
        />
      </div>
      </div>
      </form>
    <CheckoutCart/>
    
    </div>
    </Fragment>
    </Gutter>
    </div>

  ) 
}