'use client'
import React, { useEffect, useState } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'




import classes from './index.module.scss'
import { RenderParams } from '@/components/blocks/RenderParams'
import { Button } from '@/components/blocks/Button'
import cookieBasedClient from '@/components/config/cookiebased-client'
import { useAuth } from '@/providers/Auth'
import TextInput from '@/components/admin/textInput/TextInput'
import { fetchUserAttributes, updatePassword, updateUserAttributes } from 'aws-amplify/auth'
import { useNotification } from '@/providers/Notification'
import PasswordInput from '@/components/admin/passwordInput/titleInput'
import CountrySelectInput from '@/components/blocks/CountryInput'
import Icon from '@/components/utils/icon.util'

export default function Profile() {
  const{user,userAttributes,setUserAttributes}=useAuth()
  const{showMessage}=useNotification()
  const [isMobile, setIsMobile] = useState<boolean>();
  const[isLoading,setIsLoading]=useState(false)
  const[firstName,setFirstName]=useState('')
  const[lastName,setLastName]=useState('')
  const[email,setEmail]=useState('')
  const[phoneNumber,setPhoneNumber]=useState('')
  const[nameDropDown, setNameDropDown]=useState(false)
  const[phoneDropDown, setPhoneDropDown]=useState(false)
  const[passwordDropDown, setPasswordDropDown]=useState(false)
  const[addressDropDown, setAddressDropDown]=useState(false)
  const[billingFirstName, setBillingFirstName]=useState('')
  const[billingLastName, setBillingLastName]=useState('')
  const[billingCompany, setBillingCompany]=useState('')
  const[address,setAddress]=useState('')
  const[city,setCity]=useState('')
  const[zip,setZip]=useState('')
  const[country,setCountry]=useState({code:'', country:''})


  const[oldPassword,setOldPassword]=useState('')
  const[newPassword,setNewPassword]=useState('')
  const[confirmNewPassword,setConfirmNewPassword]=useState('')
  const [passwordMismatchError, setPasswordMismatchError] = useState('');
  const [passwordError, setPasswordError] = useState('');


  useEffect(() => {
    
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', checkIsMobile);
    checkIsMobile();

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  useEffect(() => {
    if(userAttributes){
      setFirstName(userAttributes?.given_name)
      setLastName(userAttributes?.family_name)
      setEmail(userAttributes?.email)
      setPhoneNumber(userAttributes?.phone_number)
      console.log('userAttributes', userAttributes.address)
      const parts = userAttributes?.address?.split(', ');
      console.log('parts', parts) 
      if(parts?.length === 8){
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
          setBillingFirstName(parsedAddress.firstName)
          setBillingLastName(parsedAddress.lastName)
          setBillingCompany(parsedAddress.company)
          setAddress(parsedAddress.street)
          setCity(parsedAddress.city)
          setZip(parsedAddress.zip)
          setCountry({code:parsedAddress.countryCode,country:parsedAddress.country})
        }
    }
   
  }, [userAttributes])

 
  
  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  }
  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  }
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }
  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  }
  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
  }
  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  }
  const handleConfirmNewPasswordChange = (event) => {
    setConfirmNewPassword(event.target.value);
  }
  const handleBillingFirstNameChange = (event) => {
    setBillingFirstName(event.target.value);
  }
  const handleBillingLastNameChange = (event) => {
    setBillingLastName(event.target.value);
  }
  const handleBillingCompanyChange = (event) => {
    setBillingCompany(event.target.value);
  }
  const handleAddressInputChange = (event) => {
    setAddress(event.target.value);
  }
  const handleCityChange = (event) => {
    setCity(event.target.value);
  }
  const handleZipChange = (event) => {
    setZip(event.target.value);
  }
  const handleCountryChange = (selectedCountry) => {
    console.log('selectedCountry', selectedCountry)
    setCountry(selectedCountry); // Assuming the selectedCountry object has a 'value' property holding the ISO-2 country code
    
  };


  const handlePhoneDropDown = () => {
    setPhoneDropDown(!phoneDropDown)
  }

  const handlePasswordDropDown = () => {
    if(passwordDropDown){
      setOldPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    }
    setPasswordDropDown(!passwordDropDown)
    
  }


  const handleNameDropDown = () => {
    setNameDropDown(!nameDropDown)
  }
  const handleAdressDropDown =()=>{
    setAddressDropDown(!addressDropDown)
  }

  const handleNameChange = async (event) => {
    event.preventDefault();
    setIsLoading(true)
    try {
      const attributes = await updateUserAttributes({
        userAttributes: {
          given_name: firstName,
          family_name: lastName
        }
      });
      const userAttributes = await fetchUserAttributes();
      
     console.log('User attributes updated:', userAttributes);
     setUserAttributes(userAttributes)
     setIsLoading(false)
     showMessage('Name updated successfully')
     setNameDropDown(false)
    } catch (error) {
      console.error('Error updating name:', error);
    }
  }

  const handlePhoneChange = async (event) => {
    event.preventDefault();
    setIsLoading(true)
    try {
      const attributes = await updateUserAttributes({
        userAttributes: {
          phone_number: phoneNumber,
        }
      });
      const userAttributes = await fetchUserAttributes();
      
     console.log('User attributes updated:', userAttributes);
     setUserAttributes(userAttributes)
     setIsLoading(false)
     showMessage('Phone Number updated successfully')
     setPhoneDropDown(false)
    } catch (error) {
      console.error('Error updating name:', error);
    }
  }
 
  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setIsLoading(true)
    setPasswordError('')
    setPasswordMismatchError('')
    try {
      if (newPassword !== confirmNewPassword) {
        setPasswordMismatchError('Passwords do not match');
        setIsLoading(false);
        return; // Stop the execution if the passwords don't match
      } else {
        setPasswordMismatchError(''); // Clear the error if the passwords match
      }
      await updatePassword({ oldPassword, newPassword });
     setIsLoading(false)
     showMessage('Password changed successfully!')
     setOldPassword('')
     setNewPassword('')
     setConfirmNewPassword('')
     setPasswordDropDown(false)
    } catch (error) {
      console.error('Error updating name:', error);
      console.log(error?.message)
      if(error && error?.message === 'Incorrect username or password.'){
          setPasswordError('Incorrect password.')
      }
      if(error && error?.message === 'Password did not conform with policy: Password must have symbol characters'){
          setPasswordMismatchError('Password must have symbol characters (e.g.: ! & )')
      }
      if(error && error?.message === 'Password did not conform with policy: Password not long enough'){
          setPasswordMismatchError('Password not long enough! At least 8 chars')
      }
      if(error && error?.message === 'Password did not conform with policy: Password must have uppercase characters'){
          setPasswordMismatchError('Password must have uppercase characters')
      }
      setIsLoading(false)
    }
  }
  const handleAddressChange = async (event) => {
    event.preventDefault();
    setIsLoading(true)
    try {
      const attributes = await updateUserAttributes({
        userAttributes: {
          address: `${billingFirstName}, ${billingLastName}, ${billingCompany}, ${address}, ${city}, ${zip}, ${country.code}, ${country.country}`,
        }
      });
      const userAttributes = await fetchUserAttributes();

     console.log('User attributes updated:', userAttributes);
     setUserAttributes(userAttributes)
     setIsLoading(false)
     setAddressDropDown(false)
     showMessage('Address updated successfully')
    } catch (error) {
      console.error('Error updating name:', error);
    }
  }


  
 

  return (
    <div className={classes.profile}>
      {isMobile && 
      <div>
        <div>
          <div>
            <Link href='/account' className={classes.profile_mobile_btn}>
              <Icon icon={['fas', 'chevron-left']}/>
              <span>Account</span>
            </Link>
          </div>
        </div>
      </div>}
      <div className={classes.mainTitle_wrapper}>
      <h1>Profile</h1>
      <p>View and update your profile information, including your name and phone number. You can also update your billing address, or change your password.</p>
      </div>
      <div className={classes.profile_content_wrapper}>

        <form onSubmit={handleNameChange}className={classes.profile_content_form}>
          <div className={classes.profile_content_form_wrapper}>
            <div className={classes.profile_content_form_closed}>
              <div className={classes.profile_content_form_closed_value}>
                <span className={classes.profile_content_form_closed_value_span_upper}>name</span>
                <div className={classes.profile_content_form_closed_value_span_wrapper}>
                  <span className={classes.profile_content_form_closed_value_span}>{`${userAttributes?.given_name} ${userAttributes?.family_name}`}</span>
                </div>
              </div>
              <div className={classes.profile_content_form_closed_button}>
                <button onClick={handleNameDropDown} type='button' className={classes.profile_content_form_closed_button_btn}>{nameDropDown? 'Cancel' :'Edit'}</button>
              </div>
            </div>
            <div className={`${classes.profile_content_form_dropdown_container} ${nameDropDown ? classes.profile_content_form_dropdown_container_open:''}`}>
              <div className={classes.profile_content_form_dropdown_wrapper}>
                <div>
                  <div className={classes.profile_content_form_dropdown_input_wrapper}>
                  <TextInput label='First name' value={firstName} onChange={handleFirstNameChange} required={true} placeholder='First name'/>
                  <TextInput label='Last name' value={lastName} onChange={handleLastNameChange} required={true} placeholder='Last name'/>
                  </div>
                </div>
              <div className={classes.profile_content_form_dropdown_button}>
               <button type='submit' disabled={isLoading}  className={classes.profile_content_form_dropdown_button_btn}>{isLoading ? 'Saving..':'Save changes'}</button>
              </div>
              </div>
            </div>
          </div>
        </form>
        <div className={classes.profile_content_form_divider}></div>

        <form className={classes.profile_content_form}>
          <div className={classes.profile_content_form_wrapper}>
            <div className={classes.profile_content_form_closed}>
              <div className={classes.profile_content_form_closed_value}>
                <span className={classes.profile_content_form_closed_value_span_upper}>email</span>
                <div className={classes.profile_content_form_closed_value_span_wrapper}>
                  <span className={classes.profile_content_form_closed_value_span}>{`${userAttributes?.email}`}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className={classes.profile_content_form_divider}></div>

        <form onSubmit={handlePhoneChange}className={classes.profile_content_form}>
          <div className={classes.profile_content_form_wrapper}>
            <div className={classes.profile_content_form_closed}>
              <div className={classes.profile_content_form_closed_value}>
                <span className={classes.profile_content_form_closed_value_span_upper}>phone</span>
                <div className={classes.profile_content_form_closed_value_span_wrapper}>
                  <span className={classes.profile_content_form_closed_value_span}>{`${userAttributes?.phone_number != undefined ? userAttributes?.phone_number : 'no number saved'}`}</span>
                </div>
              </div>
              <div className={classes.profile_content_form_closed_button}>
                <button onClick={handlePhoneDropDown} type='button' className={classes.profile_content_form_closed_button_btn}>{phoneDropDown? 'Cancel' :'Edit'}</button>
              </div>
            </div>
            <div className={`${classes.profile_content_form_dropdown_container} ${phoneDropDown ? classes.profile_content_form_dropdown_container_open:''}`}>
              <div className={classes.profile_content_form_dropdown_wrapper}>
                <div>
                  <div className={classes.profile_content_form_dropdown_input_wrapper}>
                  <TextInput label='Phone' value={phoneNumber} onChange={handlePhoneNumberChange} required={false} placeholder='Phone'/>
                  </div>
                </div>
              <div className={classes.profile_content_form_dropdown_button}>
               <button type='submit' disabled={isLoading}  className={classes.profile_content_form_dropdown_button_btn}>{isLoading ? 'Saving..':'Save changes'}</button>
              </div>
              </div>
            </div>
          </div>
        </form>
        <div className={classes.profile_content_form_divider}></div>

        <form onSubmit={handlePasswordChange}className={classes.profile_content_form}>
          <div className={classes.profile_content_form_wrapper}>
            <div className={classes.profile_content_form_closed}>
              <div className={classes.profile_content_form_closed_value}>
                <span className={classes.profile_content_form_closed_value_span_upper}>password</span>
                <div className={classes.profile_content_form_closed_value_span_wrapper}>
                  <span className={classes.profile_content_form_closed_value_span_password}>{`The password is not shown for security reasons`}</span>
                </div>
              </div>
              <div className={classes.profile_content_form_closed_button}>
                <button onClick={handlePasswordDropDown} type='button' className={classes.profile_content_form_closed_button_btn}>{passwordDropDown? 'Cancel' :'Edit'}</button>
              </div>
            </div>
            <div className={`${classes.profile_content_form_dropdown_container} ${passwordDropDown ? classes.profile_content_form_dropdown_container_open:''}`}>
              <div className={classes.profile_content_form_dropdown_wrapper}>
                <div>
                  <div className={classes.profile_content_form_dropdown_input_wrapper_password}>
                  <PasswordInput label='Old password' value={oldPassword} onChange={handleOldPasswordChange} required={true} placeholder='Old Password' error={passwordError}/>
                  <PasswordInput label='New password' value={newPassword} onChange={handleNewPasswordChange} required={true} placeholder='New Password' error={passwordMismatchError}/>
                  <PasswordInput label='Confirm new password' value={confirmNewPassword} onChange={handleConfirmNewPasswordChange} required={true} placeholder='Confirm new Password' newPassword={newPassword} error={passwordMismatchError}/>
                  </div>
                </div>
              <div className={classes.profile_content_form_dropdown_button}>
               <button type='submit' disabled={isLoading}  className={classes.profile_content_form_dropdown_button_btn}>{isLoading ? 'Saving..':'Save changes'}</button>
              </div>
              </div>
            </div>
          </div>
        </form>
        <div className={classes.profile_content_form_divider}></div>

        <form onSubmit={handleAddressChange}className={classes.profile_content_form}>
          <div className={classes.profile_content_form_wrapper}>
            <div className={classes.profile_content_form_closed}>
              <div className={classes.profile_content_form_closed_value}>
                <span className={classes.profile_content_form_closed_value_span_upper}>billing address</span>
                <div className={classes.profile_content_form_closed_value_span_wrapper_adress}>
                  <span className={classes.profile_content_form_closed_value_span}>{`${billingFirstName} ${billingLastName}`}</span>
                  <span className={classes.profile_content_form_closed_value_span}>{`${billingCompany}`}</span>
                  <span className={classes.profile_content_form_closed_value_span}>{`${address}`}</span>
                  <span className={classes.profile_content_form_closed_value_span}>{`${zip} - ${city}`}</span>
                  <span className={classes.profile_content_form_closed_value_span}>{`${country.country}`}</span>
                </div>
              </div>
              <div className={classes.profile_content_form_closed_button}>
                <button onClick={handleAdressDropDown} type='button' className={classes.profile_content_form_closed_button_btn}>{addressDropDown? 'Cancel' :'Edit'}</button>
              </div>
            </div>
            <div className={`${classes.profile_content_form_dropdown_container} ${addressDropDown ? classes.profile_content_form_dropdown_container_open:''}`}>
              <div className={classes.profile_content_form_dropdown_wrapper}>
                <div>
                  <div className={classes.profile_content_form_dropdown_input_wrapper}>
                  <TextInput label='First name' value={billingFirstName} onChange={handleBillingFirstNameChange} required={true} placeholder='First name'/>
                  <TextInput label='Last name' value={billingLastName} onChange={handleBillingLastNameChange} required={true} placeholder='Last name'/>
                  <TextInput label='Company' value={billingCompany} onChange={handleBillingCompanyChange} required={false} placeholder='Company'/>
                  <TextInput label='Address' value={address} onChange={handleAddressInputChange} required={true} placeholder='Address'/>

                  <TextInput label='Zip' value={zip} onChange={handleZipChange} required={true} placeholder='Zip'/>
                  <TextInput label='City' value={city} onChange={handleCityChange} required={true} placeholder='City'/>
                  <CountrySelectInput label='Country' value={country} onChange={handleCountryChange} required={true}/>
                  </div>
                </div>
              <div className={classes.profile_content_form_dropdown_button}>
               <button type='submit' disabled={isLoading}  className={classes.profile_content_form_dropdown_button_btn}>{isLoading ? 'Saving..':'Save changes'}</button>
              </div>
              </div>
            </div>
          </div>
        </form>
        <div className={classes.profile_content_form_divider}></div>


      </div>
    </div>
  )
}
