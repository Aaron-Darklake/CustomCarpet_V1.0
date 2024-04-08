'use client'

import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'







import classes from './index.module.scss'
import { useCart } from '@/providers/Cart'
import { Message } from '@/components/blocks/Message'
import { Button } from '@/components/blocks/Button'
import { useCheckout } from '@/providers/Checkout'
import { useAuth } from '@/providers/Auth'
import { getAttachedPaymentMethods } from '@/app/actions/stripe/createCustomer'
import Icon from '@/components/utils/icon.util'

export const CheckoutForm: React.FC<{}> = () => {
  const stripe = useStripe()
  const elements = useElements()
  const {userAttributes}= useAuth()
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const { cart, cartTotal } = useCart()
  const{completedSteps, completeStep, handlePaymentMethod, goToStep}=useCheckout()
  const [firstName,setFirstName]=useState('')
  const [lastName,setLastName]=useState('')
  const [address,setAddress]=useState('')
  const [mail,setMail]=useState('')
  const [city,setCity]=useState('')
  const [zip,setZip]=useState('')
  const [country,setCountry]=useState({code:'',country:''})
  const [paymentMethods, setPaymentMethods]=useState<any>({})
  const [showNewPaymentMethod, setShowNewPaymentMethod] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);


  const handlePaymentMethodClick = (method) => {
    setSelectedPaymentMethod(method);
    console.log('selected payment method:', method)
  };



  const handleError = (error) => {
    setLoading(false);
    setErrorMessage(error.message);
  }

  const handleAddNewPaymentMethod = () => {
    setShowNewPaymentMethod(!showNewPaymentMethod)
  }

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response: any = await getAttachedPaymentMethods({customer: userAttributes?.['custom:stripeCustomerID']});
        if ( response.success && response.success === false) {
          console.error(response.message);
        } else {
         console.log('fetched payment methodes:',response)
         if( response && response.length === 0){
          setShowNewPaymentMethod(true)
         }
         setPaymentMethods(response)
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }
    };
    if (!completedSteps[1]) {
      goToStep(1)
      router.push('/checkout/shipping')
    }
    if (!completedSteps[0]){
      goToStep(0)
      router.push('/cart')
    }
    if(!cart){
      goToStep(0)
      router.push('/cart')
    }
    if(completedSteps[0] && completedSteps[0].shippingInformation && completedSteps[0]?.billingInformation === 'isSame'){
      setMail(completedSteps[0].shippingInformation.mail)
      setFirstName(completedSteps[0].shippingInformation.firstName)
      setLastName(completedSteps[0].shippingInformation.lastName)
      setAddress(completedSteps[0].shippingInformation.address)
      setCity(completedSteps[0].shippingInformation.city)
      setZip(completedSteps[0].shippingInformation.zip)
      setCountry(completedSteps[0].shippingInformation.country)
    } else if(completedSteps[0] && completedSteps[0].shippingInformation && completedSteps[0]?.billingInformation !== 'isSame'){
      setMail(completedSteps[0]?.shippingInformation.mail)
      setFirstName(completedSteps[0].billingInformation.firstName)
      setLastName(completedSteps[0].billingInformation.lastName)
      setAddress(completedSteps[0].billingInformation.address)
      setCity(completedSteps[0].billingInformation.city)
      setZip(completedSteps[0].billingInformation.zip)
      setCountry(completedSteps[0].billingInformation.country)
    } 
    fetchPaymentMethods()
  },[])

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    // Trigger form validation and wallet collection
    const {error: submitError} = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    if (selectedPaymentMethod?.card) {
      // Process the payment with the selected payment method
      handlePaymentMethod({details: selectedPaymentMethod, type:selectedPaymentMethod.type});
      completeStep(2,{paymentMethod:{details:selectedPaymentMethod,type:selectedPaymentMethod.type}});
      goToStep(3);
      router.push('/checkout/review');
      return;
    }
    // Create the PaymentMethod using the details collected by the Payment Element
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      elements,
      params: {
        billing_details: {
          name: `${firstName} ${lastName}`,
          email: mail,
          address: {
            line1: address,
            postal_code: zip,
            city: city,
            country: country.code,
        },
        },
      }
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // creating the PaymentMethod. Show the error to your customer (for example, payment details incomplete)
      handleError(error);
      return;
    } else{
      handlePaymentMethod({details: paymentMethod.id, type:paymentMethod.type})
      completeStep(2,{paymentMethod:{details:paymentMethod,type:paymentMethod.type}})
      goToStep(3)
      router.push('/checkout/review')
    }

    // Now that you have a PaymentMethod, you can use it in the following steps to render a confirmation page or run additional validations on the server
  };
console.log('paymentMethods', paymentMethods)

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <div className={classes.contact_wrap}>
      <div className={classes.contact_header}>
        <h2>Payment</h2>
        {showNewPaymentMethod && <button type='button' onClick={handleAddNewPaymentMethod}>choose existing</button>}
      </div>
      {errorMessage && <Message error={errorMessage} />}
      {paymentMethods && paymentMethods?.length > 0 && !showNewPaymentMethod && (
         <div className={classes.payment_select_wrapper}>
            <h3>Select a Payment Method </h3>
            
            <div className={classes.payment_wrapper}>
            {paymentMethods.map((method, index) => (
              <Fragment key={index}>
              {method.type === 'card' && (
                <button type='button' onClick={() => handlePaymentMethodClick(method)} className={`${classes.payment_details_wrapper} ${selectedPaymentMethod?.id && selectedPaymentMethod.id === method.id  ? classes.payment_details_wrapper_active : ''}`}  key={index}>
                  
                     <div className={classes.payment_details_container}>
                     <span className={classes.payment_details_container_span}>
                       <div className={classes.payment_details_content} style={{gap:'8px'}}>
                         <div className={classes.payment_details_content_img} >
                         <img src={`/logos/${method.card.brand}.svg`} alt={method.card.brand} />
                         </div>
                         <div className={classes.payment_details_content_text}>
                           <div className={classes.payment_details_content_text_header}>
                             <p className={classes.payment_details_content_text_header_content}>{`**** ${method.card.last4}`}</p>
                           </div>
                           <p className={classes.payment_details_content_text_subline}>{`expires: ${method.card.exp_month}/ ${method.card.exp_year}`}</p>
                         </div>
                         <span className={`${classes.radioButton_input_wrapper_circle} ${selectedPaymentMethod?.id && selectedPaymentMethod.id === method.id  ? classes.radioButton_input_wrapper_circle_active : ''}`}><span className={`${classes.radioButton_input_wrapper_circle_inner} ${selectedPaymentMethod?.id && selectedPaymentMethod.id === method.id ? classes.radioButton_input_wrapper_circle_inner_active : ''}`}></span></span>
                       </div>
                   </span>
                   </div>
                  
                </button>
                )}
                </Fragment>
            ))}
          </div>
          <h3>Add a New Payment Method </h3>
            <div className={classes.payment_wrapper}>

             
                <button type='button' onClick={handleAddNewPaymentMethod} className={classes.payment_details_wrapper}>
                  
                     <div className={classes.payment_details_container}>
                     <span className={classes.payment_details_container_span}>
                       <div className={classes.payment_details_content} style={{gap:'8px'}}>
                         <div className={classes.payment_details_content_img} >
                         <Icon icon={['far', 'credit-card']}/>
                         </div>
                         <div className={classes.payment_details_content_text}>
                           <div className={classes.payment_details_content_text_header}>
                             <p className={classes.payment_details_content_text_header_content}>{`Add New`}</p>
                           </div>
                           <p className={classes.payment_details_content_text_subline}>{`add a new payment method`}</p>
                         </div>
                       </div>
                   </span>
                   </div>
                  
                </button>
               

          </div>
          </div>
        )}
        {showNewPaymentMethod && (
          <>
            <PaymentElement />
         
          </>
        )}
         <div className={classes.actions}>
         <Button label="Back" href="/checkout/shipping" appearance="secondary" />
         <Button
           label={loading ? 'Loading...' : 'Review'}
           type="submit"
           appearance="primary"
           disabled={!stripe || loading}
         />
       </div>
     
      </div>
    </form>
  )
}

export default CheckoutForm