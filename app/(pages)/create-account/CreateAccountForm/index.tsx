'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter} from 'next/navigation'
import { confirmSignUp, fetchUserAttributes, getCurrentUser, resendSignUpCode, signIn, signUp, updateUserAttributes} from 'aws-amplify/auth'
import {createCustomer} from '../../../actions/stripe/createCustomer.js'






import classes from './index.module.scss'
import { Button } from '../../../../components/blocks/Button'
import { Input } from '../../../../components/blocks/Input'
import { Message } from '../../../../components/blocks/Message'
import Icon from '../../../../components/utils/icon.util'
import { defineStorage } from '@aws-amplify/backend'
import TextInput from '../../../../components/admin/textInput/TextInput'
import PasswordInput from '@/components/admin/passwordInput/titleInput'
import { XMarkIcon } from '@heroicons/react/24/outline'
import dataClientPrivate from '@/components/config/data-server-client-private'
import { useAuth } from '@/providers/Auth/index'

type FormData = {
  name: string
  email: string
  password: string
  passwordConfirm: string
}



export const CreateAccountForm: React.FC = () => {
  const router = useRouter()
  const {userAttributes, setUserAttributes}=useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [passwordLog, setPasswordLog]= useState('')
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [passwordMismatchError, setPasswordMismatchError] = useState('');
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);


  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>()
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        console.log(`The username: ${username}`);
        console.log(`The userId: ${userId}`);
        console.log('The signInDetails:', signInDetails);
        if(userId){
          router.push('/')
        }
      } catch (err) {
        console.log(err);
      }
    };

    checkUser();
  }, []);


  const handleFocus = (index: number) => {
    setActiveInputIndex(index);
  };
  
  const handleBlur = () => {
    setActiveInputIndex(null);
  };


  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setPasswordMismatchError('')
    if (password !== passwordConfirm) {
        setPasswordMismatchError('Passwords do not match');
        setLoading(false);
        return; // Stop the execution if the passwords don't match
      } else {
        setPasswordMismatchError(''); // Clear the error if the passwords match
      }
    // Split fullName into firstName and lastName
    const fullName = `${firstName} ${lastName}`
    try { 
      const stripeResponse = await createCustomer({email: email, name: fullName})
  
      if (stripeResponse?.success === false) {
        throw new Error('Failed to create Stripe customer');
      }
  
      const { stripeCustomerId } = stripeResponse;
  
      const { userId } = await signUp({
        username: email, // Assuming the username is the email
        password: password,
        options: {
            userAttributes: {
          email: email, // Optional for the username alias
          given_name: firstName,
          family_name: lastName,
          'custom:role': 'customer',
          'custom:stripeCustomerID': stripeCustomerId,
          // Add other attributes here
        },
     
    }
      });
     // Creating the cart
    
     
      setUsername(userId)
      setShowConfirmation(true)
      setLoading(false);
      
      console.log('Sign up successful! Confirmation code sent:', userId);
    } catch (error) {
      console.error('Error during sign up:', error);
      const message = 'There was an error creating the account.'
      setLoading(false)
      setError(message)
      return
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if ((event.key === 'Backspace' || event.key === 'Delete') && index !== 0 && !event.currentTarget.value) {
      const prevInput = event.currentTarget.previousElementSibling as HTMLInputElement;
      prevInput?.focus();
    }
  };
  

  const handleCodeInput = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = event.target.value;
    const newCodeArray = [...confirmationCode.split('')];
    newCodeArray[index] = value;
    setConfirmationCode(newCodeArray.join(''));
  
    // Automatically move to the next input field after a valid input
    if (value && index < 5) {
      const nextInput = event.target.nextElementSibling as HTMLInputElement;
      nextInput?.focus();
    }
    setActiveInputIndex(value ? index : null);
  };
  
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = event.clipboardData.getData('text');
    // Extract only the first 6 characters in case more are pasted
    const pasteDataArray = pasteData.slice(0, 6).split('');
  
    // Set the code state
    setConfirmationCode(pasteDataArray.join(''));
  
    // Focus the last filled input or the last input if all are filled
    const lastInputIndex = pasteDataArray.length < 6 ? pasteDataArray.length : 5;
    const inputs = event.currentTarget.parentNode?.querySelectorAll('input');
    if (inputs) {
      (inputs[lastInputIndex] as HTMLInputElement).focus();
    }
  };
  
  

  const handleConfirmCode = async () => {
    event.preventDefault();
    setLoading(true);
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: confirmationCode
      });
  
      if (isSignUpComplete) {
        setShowConfirmation(false);
        // Manually sign in the user
        try {
            const user = await signIn({
                username: email, 
                password: password
            });
          console.log('User signed in:', user);
          if(user){
            const {data: newCart} = await dataClientPrivate.models.Cart.create(null);
            const {data: newAddress} = await dataClientPrivate.models.ShippingAddresses.create(null);
                 console.log('New Cart created:', newCart)
                 console.log('New Address created:', newAddress)
       
                     const {data: attributes} = await updateUserAttributes({
                       userAttributes: {
                         'custom:cartId': newCart.id,
                         'custom:addressId': newAddress.id,
                       }
                     });
                     const userAttributes = await fetchUserAttributes();
                    console.log('user attributes:', userAttributes)
                    setUserAttributes(userAttributes)
          }
          // Redirect to the dashboard
          
          router.push('/');
          
          setLoading(false);
        } catch (signInError) {
          console.error('Error during sign-in:', signInError);
          setError('Error during sign-in:')
        }
      }
    } catch (error) {
      console.error('Error during user confirmation:', error);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmation(false);
  };

  const handleResendCode = async () => {
    try {
      await resendSignUpCode({username: userName});
      console.log('Confirmation code resent');
    } catch (error) {
      console.error('Error resending code:', error);
    }
  };

  const handleMailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  }
  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }
  const handleConfirmPasswordChange = (event) => {
    setPasswordConfirm(event.target.value);
  }
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    console.log('card', card)
    const handleMouseMove = (e: MouseEvent) => {
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const angle = Math.atan2(-x, y);
        card.style.setProperty("--rotation", `${angle}rad`);
      }
    };

    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
    }

    // Cleanup function to remove the event listener
    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);
 

  return (
    <div>
    {showConfirmation && (
      <div className={classes.overlay}>
        <div className={classes.modal} ref={cardRef}>
          <div className={classes.modal_close}>
          <button onClick={handleCloseModal} className={classes.closeButton}><XMarkIcon/></button>
          </div>
          <h2>Confirm your email address</h2>
          <div className={classes.modal_text}>
          <p>{`We have sent a 6-digit code to ${email}.`}</p>
          <p>Enter it below</p>
          </div>
            <div className={classes.codeInputContainer}>
              {Array(6).fill(null).map((_, index) => (
                <input
                  key={index}
                  className={`${classes.codeInput} ${index === activeInputIndex || confirmationCode[index] ? classes.codeInput_active : ''}`}
                  type="text"
                  maxLength={1}
                  value={confirmationCode[index] || ''}
                  onChange={(event) => handleCodeInput(event, index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  onFocus={() => handleFocus(index)}
                  onBlur={handleBlur}
                  autoFocus={index === 0}
                  onPaste={index === 0 ? handlePaste : undefined}
                />
              ))}
            </div>


          <div className={classes.buttonWrapper}>
          <Button type='button' appearance='primary' onClick={() => handleConfirmCode()} disabled={loading}>
            {loading ? 'Confirming...' : 'Confirm'}
          </Button>
          <Button type='button'  appearance='secondary'  onClick={handleResendCode} disabled={loading}>Resend Code</Button>
          </div>
        </div>
      </div>
    )}
    <form onSubmit={handleSignUp} className={classes.form}>
      <Message error={error} className={classes.message} />
      <div className={classes.shipping_input_wrapper_1col}>
      <TextInput label='Email' type='email' value={email} onChange={handleMailChange} required={true} placeholder='Email address'/>
      </div>
      <div className={classes.shipping_input_wrapper_2col}>
      <TextInput label='First name' value={firstName} onChange={handleFirstNameChange} required={true} placeholder='First name'/>
      <TextInput label='Last name' value={lastName} onChange={handleLastNameChange} required={true} placeholder='Last name'/>
      </div>
      <div className={classes.shipping_input_wrapper_1col}>
      <PasswordInput label='Password' value={password} onChange={handlePasswordChange} required={true} placeholder='Password' error={passwordMismatchError}/>
      </div>
      <div className={classes.shipping_input_wrapper_1col}>
      <PasswordInput label='Confirm password' value={passwordConfirm} onChange={handleConfirmPasswordChange} required={true} placeholder='Confirm password' error={passwordMismatchError}/>
      </div>
      
      
      <Button
        type="submit"
        label={loading ? 'Processing' : 'Sign Up'}
        disabled={loading}
        appearance="primary"
        className={classes.submit}
      />
      <div className={classes.toLogin}>
        {'Already have an account? '}
        <Link href={'/login'}>Login</Link>
      </div>
    </form>
    </div>
  )
}


