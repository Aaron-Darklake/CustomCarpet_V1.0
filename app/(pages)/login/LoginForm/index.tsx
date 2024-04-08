'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import classes from './index.module.scss'
import { Message } from '../../../../components/blocks/Message'
import { Input } from '../../../../components/blocks/Input'
import { Button } from '../../../../components/blocks/Button'
import { confirmSignUp, fetchUserAttributes, getCurrentUser, resendSignUpCode, signIn } from 'aws-amplify/auth'
import Icon from '../../../../components/utils/icon.util'
import { useAuth } from '@/providers/Auth'
import TextInput from '@/components/admin/textInput/TextInput'
import PasswordInput from '@/components/admin/passwordInput/titleInput'
import { XMarkIcon } from '@heroicons/react/24/outline'

type FormData = {
  email: string
  password: string
}

const LoginForm: React.FC = () => {


  const router = useRouter()
  const {setUser, setUserAttributes, user}= useAuth()
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [passwordLog, setPasswordLog]= useState('')
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [userName, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<FormData>()


  const handleMailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }
  /*const onSubmit = useCallback(
    async (data: FormData) => {
      try {

        if (redirect?.current) router.push(redirect.current as string)
        else router.push('/')
        window.location.href = '/';
      } catch (_) {
        setError('There was an error with the credentials provided. Please try again.')
      }
    },
    [ router],
  )*/

  const fetchAndSetUserAttributes = async () => {
    try {
      const userAttributes = await fetchUserAttributes();
      setUserAttributes(userAttributes);
      console.log('User attributes:', userAttributes)
      // Redirect based on role
      const role = userAttributes?.['custom:role'];
      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching user attributes:', error);
    }
  };

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true)
    try {
      const  user = await signIn({
        username: email, 
        password: password
    });
      console.log('User signed in:', user);
      // Redirect to dashboard or next protected route
      if (user.isSignedIn === false && user.nextStep.signInStep === 'CONFIRM_SIGN_UP'){
        setShowConfirmation(true);
      }
      if (user.isSignedIn && user.nextStep.signInStep === 'DONE'){
        const {userId,username,signInDetails}= await getCurrentUser()
        console.log('currentUser:', userId)
        setUser(userId)
        if(userId !== undefined||null){
          await fetchAndSetUserAttributes()

        }
      }
      setEmail('')
      setPassword('')
      setLoading(false)
    } catch (error) {
      if (error.code === 'UserNotConfirmedException') {
        // User needs to confirm their account, show the confirmation modal
        setShowConfirmation(true);
        setLoading(false)
      } else {
        console.error('Error during sign-in:', error);
        setLoading(false)
      }
    }
  };

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
                password: passwordLog
            });
          console.log('User signed in:', user);
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

  const handleFocus = (index: number) => {
    setActiveInputIndex(index);
  };
  
  const handleBlur = () => {
    setActiveInputIndex(null);
  };
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
  

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        console.log(`The username: ${username}`);
        console.log(`The userId: ${userId}`);
        console.log('The signInDetails:', signInDetails);
        console.log('The User is authenticated!');
      } catch (err) {
        console.log(err);
        console.log('The User is not authenticated!');
        setUser(null)
      }
    };
    const userAtributes = async () => {
      const userAttributes = await fetchUserAttributes();
      console.log('userAttributes:', userAttributes);
      const role = userAttributes?.['custom:role']
      if(role && role === 'admin'){
        router.push('/admin')
      } else if (role && role === 'user'){
        router.push('/')
      }
      setUserAttributes(userAttributes);
      return userAttributes;
    }

    checkUser();
    if(user){
      userAtributes();
    }
   
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
    <form onSubmit={handleSignIn} className={classes.form}>
      <Message error={error} className={classes.message} />
      <div className={classes.shipping_input_wrapper_1col}>
      <TextInput label='Email' type='email' value={email} onChange={handleMailChange} required={true} placeholder='Email address'/>
      </div>
      <div className={classes.shipping_input_wrapper_1col}>
      <PasswordInput label='Password' value={password} onChange={handlePasswordChange} required={true} placeholder='Password'/>
      </div>
      <Button
        type="submit"
        appearance="primary"
        label={isLoading ? 'Processing' : 'Login'}
        disabled={isLoading}
        className={classes.submit}
      />
      <div className={classes.links}>
        <Link href={'/create-account'}>Create an account</Link>
        <br />
        <Link href={'/recover-password'}>Forgot your password?</Link>
      </div>
    </form>
    </div>
  )
}

export default LoginForm
