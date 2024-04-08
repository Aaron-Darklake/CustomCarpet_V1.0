'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'


import classes from './index.module.scss'
import { useAuth } from '@/providers/Auth'
import { useCart } from '@/providers/Cart'
import { LoadingShimmer } from '@/components/blocks/LoadingShimmer'
import { Button } from '@/components/blocks/Button'
import {  updatePaymentIntent } from '@/app/actions/stripe/createCustomer'
import dataClient from '@/components/config/data-server-client'
import { getUrl } from 'aws-amplify/storage'
import dotenv from 'dotenv'
import { Input } from '@/components/blocks/Input'
import TextInput from '@/components/admin/textInput/TextInput'
import TitleInput from '@/components/admin/titleInput/titleInput'
import { useCheckout } from '@/providers/Checkout'
import { FormProvider, set, useForm } from 'react-hook-form'
import CheckoutCart from '@/components/blocks/CheckoutCart'
import CountrySelectInput from '@/components/blocks/CountryInput'
import { updateUserAttributes } from 'aws-amplify/auth'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import dataClientPrivate from '@/components/config/data-server-client-private'
import { Checkbox } from '@/components/blocks/checkbox/checkbox'



export const CheckoutPageStart: React.FC<{
  settings
}> = props => {
  const {
    settings: { productsPage },
  } = props

  const { user, userAttributes } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [clientSecret, setClientSecret] = React.useState('')
  const [cartItems, setCartItems] = useState([]);

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
  const [sameBilling,setSameBilling]=useState(true);

  const [firstNameBilling, setFirstNameBilling] = useState('');
  const [lastNameBilling, setLastNameBilling] = useState('');
  const [addressBilling, setAddressBilling] = useState('');
  const [cityBilling, setCityBilling] = useState('');
  const [zipBilling, setZipBilling] = useState('');
  const [countryBilling, setCountryBilling] = useState({code:'',country:''});
  const [companyBilling, setCompanyBilling] = useState('');
  const [differentBillingAddress, setDifferentBillingAddress] = useState(false);
  
  const[addresses, setAddresses]=useState([]);
  const [selectedAddress, setSelectedAddress] = useState<any>({});
  const [showDropDown, setShowDropDown]=useState(false)

  const { cart, cartIsEmpty, cartTotal } = useCart()
  const { completeStep, goToStep, completedSteps, currentStep, handlePaymentIntentClientSecret } = useCheckout();

  const handleShowDropDown = () => {
    setShowDropDown(!showDropDown)
  }




  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    console.log('userAttributes address', userAttributes.address)
   
  
    // Define the shipping and billing information
    const shippingInfo = {
      mail, phone, firstName, lastName, address, city, zip, country, company
    };
    const billingInformation = !sameBilling ? {
      firstName: firstNameBilling, 
      lastName: lastNameBilling, 
      address: addressBilling, 
      city: cityBilling, 
      zip: zipBilling, 
      country: countryBilling, 
      company: companyBilling !== undefined ? companyBilling : ''
    } : 'isSame';
  
    try {
      // Extract Payment Intent ID from the client secret
        // Update was successful
        completeStep(0, { shippingInformation: shippingInfo, billingInformation: billingInformation });
        goToStep(1); // Go to the next step
        router.push('/checkout/shipping');
     
    } catch (error) {
      setError('Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };
  

 


  const handleMailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMail(event.target.value);
  };
  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  }

  const handleFirstNameBillingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstNameBilling(event.target.value);
  }

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  }
  const handleLastNameBillingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastNameBilling(event.target.value);
  }

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  }
  const handleAddressBillingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddressBilling(event.target.value);
  }

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  }
  const handleCityBillingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCityBilling(event.target.value);
  }

  const handleZipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZip(event.target.value);
  }
  const handleZipBillingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZipBilling(event.target.value);
  }

  const handleCountryChange = (selectedCountry) => {
    console.log('selectedCountry', selectedCountry)
    setCountry(selectedCountry); // Assuming the selectedCountry object has a 'value' property holding the ISO-2 country code
  };

  const handleCountryBillingChange = (selectedCountry) => {
    console.log('selectedCountry', selectedCountry)
    setCountryBilling(selectedCountry); // Assuming the selectedCountry object has a 'value' property holding the ISO-2 country code
  }

  const handleCompanyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompany(event.target.value);
  }
  const handleCompanyBillingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyBilling(event.target.value);
  }

  useEffect(() => {
    if (user !== null && cartIsEmpty) {
      router.push('/cart')
    }
  }, [router, user, cartIsEmpty])

  useEffect(() => {
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
    } else{
      setStepDone(false)
    }
    if(completedSteps[0]?.billingInformation){
      if(completedSteps[0].billingInformation === 'isSame'){
        setDifferentBillingAddress(false)
      } else{
        setDifferentBillingAddress(true)
        setSameBilling(false)
        setFirstNameBilling(completedSteps[0].billingInformation.firstName)
        setLastNameBilling(completedSteps[0].billingInformation.lastName)
        setAddressBilling(completedSteps[0].billingInformation.address)
        setCityBilling(completedSteps[0].billingInformation.city)
        setZipBilling(completedSteps[0].billingInformation.zip)
        setCountryBilling(completedSteps[0].billingInformation.country)
        setCompanyBilling(completedSteps[0].billingInformation.company)
      }
    }
   
}, [router, user, userAttributes])

  useEffect(() => {
    if(userAttributes.email){
      setMail(userAttributes.email)
      setFirstName(userAttributes.given_name)
      setLastName(userAttributes.family_name)
    }
    if(userAttributes.address && !completedSteps[0]?.billingInformation){
      console.log('userAttributes', userAttributes.address)
      const parts = userAttributes.address.split(', ');
      console.log('parts', parts) 
      if(parts.length === 8){
        const parsedAddress = {
          firstName: parts[0],
          lastName: parts[1],
          company: parts[2],
          street: parts[3],
          city: parts[4],
          zip: parts[5],
          countryCode: parts[6],
          country: parts[7]
          };
          console.log('parsedAddress', parsedAddress)
          setFirstNameBilling(parsedAddress.firstName)
          setLastNameBilling(parsedAddress.lastName)
          setCompanyBilling(parsedAddress.company)
          setAddressBilling(parsedAddress.street)
          setCityBilling(parsedAddress.city)
          setZipBilling(parsedAddress.zip)
          setCountryBilling({code:parsedAddress.countryCode,country:parsedAddress.country})
      } else if(parts.length === 7){
        const parsedAddress = {
          firstName: parts[0],
          lastName: parts[1],
          street: parts[2],
          city: parts[3],
          zip: parts[4],
          countryCode: parts[5],
          country: parts[6]
          };
          console.log('parsedAddress', parsedAddress)
          setFirstNameBilling(parsedAddress.firstName)
          setLastNameBilling(parsedAddress.lastName)
          setAddressBilling(parsedAddress.street)
          setCityBilling(parsedAddress.city)
          setZipBilling(parsedAddress.zip)
          setCountryBilling({code:parsedAddress.countryCode, country:parsedAddress.country})
        }
    }
  },[])
 
  useEffect(() => {
    const fetchAddresses = async () => {
      const {data: addresses} = await dataClientPrivate.models.Address.list();
      console.log('addresses', addresses)
      setAddresses(addresses)
        
    }
    fetchAddresses()
  },[])

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

      setCartItems(items.filter(Boolean));
    };

    fetchCartItems();
  }, [cart]);

  if (!user ) return null


  const handleNavigate = () => {
    if(!completedSteps[0]){
      const shippingInfo = {
        mail, phone, firstName, lastName, address, city, zip, country, company
      };
      const billingInformation = differentBillingAddress ? {
        firstName: firstNameBilling, 
        lastName: lastNameBilling, 
        address: addressBilling, 
        city: cityBilling, 
        zip: zipBilling, 
        country: countryBilling, 
        company: companyBilling
      } : 'isSame';
  completeStep(0, { shippingInformation: shippingInfo, billingInformation: billingInformation });
    }
    goToStep(1);
    router.push('/checkout/shipping')
  }

  const handleAddressSelect = (address) => {
    setFirstName(address.firstName)
    setLastName(address.lastName)
    setCompany(address.company)
    setAddress(address.address1)
    setCity(address.city)
    setZip(address.zip)
    setCountry({code: address.countryCode,country: address.country})
    setSelectedAddress(address)
    setShowDropDown(false)
  }

  const handleDifferentBillingAddress = () => {
    setSameBilling(!sameBilling)
  }

  

  return (
    <Fragment>
      
      {cartIsEmpty && (
        <div>
          {'Your '}
          <Link href="/cart">cart</Link>
          {' is empty.'}
          {typeof productsPage === 'object' && productsPage?.slug && (
            <Fragment>
              {' '}
              <Link href={`/${productsPage.slug}`}>Continue shopping?</Link>
            </Fragment>
          )}
        </div>
      )}
      <div className={classes.shipping_contact_wrap}>
      {stepDone ? (
      <div>
        <div>
        <div className={classes.shipping_header}>
        <h2>Shipping Information</h2>
        <button type='button' onClick={()=>setStepDone(false)}>Edit</button>
        </div>
        <div className={classes.shipping_information_card}>
          <div>
            <div className={classes.shipping_information_content_wrapper}>
              <div className={classes.shipping_information_content_grid}>
                <div className={classes.shipping_information_content_column}>
                  <p className={classes.shipping_information_content_column_header}>Shipping Adress</p>
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
        <div className={classes.actions} style={{marginTop:'110px'}}>
        <Button label="Back" href="/cart" appearance="secondary" />
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
      <form onSubmit={handleSubmit} >
      <div className={classes.saved_address_wrap}>
        <p className={classes.saved_address_description}>{`Hi ${userAttributes?.given_name}, do you want to use one of your saved addresses?`}</p>
        <div className={`${classes.saved_address_button_wrap} ${showDropDown ? classes.dropdown_active : ''}`}>
          <button type='button' onClick={handleShowDropDown}>
            <span className={classes.saved_address_button_span}>{`${selectedAddress.address1 !== undefined ? selectedAddress.address1 : 'Select address'}`}</span>
            <ChevronDownIcon />
          </button>
          <ul className={`${classes.saved_address_button_dropDown} ${showDropDown ? classes.saved_address_button_dropDown_active : ''}`}>
            {addresses.map((address, index) => (
              <li key={index} className={`${classes.saved_address_list_item} ${selectedAddress && selectedAddress.id === address.id  ? classes.saved_address_list_item_active :''} `}>
                <button type='button' onClick={()=>handleAddressSelect(address)}>
                <div className={classes.saved_address_list_item_wrapper}>
                <span className={`${classes.radioButton_input_wrapper_circle} ${selectedAddress && selectedAddress.id === address.id  ? classes.radioButton_input_wrapper_circle_active : ''}`}><span className={`${classes.radioButton_input_wrapper_circle_inner} ${selectedAddress?.id && selectedAddress.id === address.id ? classes.radioButton_input_wrapper_circle_inner_active : ''}`}></span></span>
                <div className={classes.saved_address_list_item_address_wrapper}>
                  <span className={classes.saved_address_list_item_address_name}>{`${address.firstName} ${address.lastName}`}</span>
                  <span className={classes.saved_address_list_item_address_company}>{`${address.company}`}</span>
                  <div className={classes.saved_address_list_item_address_address}>
                  <span>{`${address.address1}`}</span>
                  <span>{`${address.zip} - ${address.city}`}</span>
                  <span>{`${address.country}`}</span>
                  </div>
                </div>
                 
                </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={classes.contact_wrap}>
      <div className={classes.contact_header}>
        <h2>Contact</h2>
      </div>
      <div className={classes.contact_input_wrapper}>
          <TextInput label='Email' type='email' value={mail} onChange={handleMailChange} required={true} placeholder='Email address'/>
          <TextInput label='Phone' type='tel' value={phone} onChange={handlePhoneChange} required={false}  placeholder='+123 1234567 (optional)'/>

      </div>
      </div>
      <div className={classes.shipping_wrap}>
      <div className={classes.shipping_header}>
        <h2>Shipping Information</h2>
      </div>
      <div className={classes.shipping_input_wrapper_2col}>
      <TextInput label='First name' value={firstName} onChange={handleFirstNameChange} required={true} placeholder='First name'/>
      <TextInput label='Last name' value={lastName} onChange={handleLastNameChange} required={true} placeholder='Last name'/>
      </div>
      <div className={classes.shipping_input_wrapper_1col}>
      <TextInput label='Company' value={company} onChange={handleCompanyChange} required={false} placeholder='Company name (optional)'/>
      
      </div>
      <div className={classes.shipping_input_wrapper_2col}>
      <TextInput label='Address' value={address} onChange={handleAddressChange} required={true} placeholder='Street 1'/>
      <TextInput label='Postal code' value={zip} onChange={handleZipChange} required={true} placeholder='12345'/>
      <TextInput label='City' value={city} onChange={handleCityChange} required={true}placeholder='City'/>
      <CountrySelectInput value={country} label='Country' onChange={handleCountryChange} placeholder='Country'
        required={true}/>
      </div>
      </div>
      <div className={classes.billing_same_button_wrapper}>
        <div className={classes.billing_same_button_container}>
                  <Checkbox
                    isSelected={sameBilling}
                    onClickHandler={handleDifferentBillingAddress}
                  />
                  <label className={classes.billing_same_button_label}>Billing address same as shipping address?{sameBilling ? 'yes':'no'}</label>
        </div>
      </div>
      <div className={`${classes.billing_wrap} ${!sameBilling ? classes.billing_wrap_show : ''}`}>
      <div className={classes.shipping_header}>
        <h2>Billing Information</h2>
      </div>
      <div className={classes.shipping_input_wrapper_2col}>
      <TextInput label='First name' value={firstNameBilling} onChange={handleFirstNameBillingChange} required={true} placeholder='First name'/>
      <TextInput label='Last name' value={lastNameBilling} onChange={handleLastNameBillingChange} required={true} placeholder='Last name'/>
      </div>
      <div className={classes.shipping_input_wrapper_1col}>
      <TextInput label='Company' value={companyBilling} onChange={handleCompanyBillingChange} required={false} placeholder='Company name (optional)'/>
      
      </div>
      <div className={classes.shipping_input_wrapper_2col}>
      <TextInput label='Address' value={addressBilling} onChange={handleAddressBillingChange} required={true} placeholder='Street 1'/>
      <TextInput label='Postal code' value={zipBilling} onChange={handleZipBillingChange} required={true} placeholder='12345'/>
      <TextInput label='City' value={cityBilling} onChange={handleCityBillingChange} required={true}placeholder='City'/>
      <CountrySelectInput value={countryBilling} label='Country' onChange={handleCountryBillingChange} placeholder='Country'
        required={true}/>
      </div>
      </div>
      <div className={classes.actions}>
        <Button label="Back to cart" href="/cart" appearance="secondary" />
        <Button
          label={isLoading ? 'Loading...' : 'Continue to delivery'}
          type="submit"
          appearance="primary"
          disabled={isLoading}
        />
      </div>
      </form>
        )}
      <CheckoutCart/>
      </div>

    
    </Fragment>
  )
}