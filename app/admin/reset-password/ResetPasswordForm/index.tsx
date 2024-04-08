'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { set, useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'


import classes from './index.module.scss'
import { Message } from '@/components/blocks/Message'
import PasswordInput from '@/components/admin/passwordInput/titleInput'
import { Button } from '@/components/blocks/Button'
import { confirmResetPassword } from 'aws-amplify/auth'
import { useAuth } from '@/providers/Auth'
import { XMarkIcon } from '@heroicons/react/24/outline'



export const ResetPasswordForm: React.FC = () => {
  const [error, setError] = useState('')
  const router = useRouter()
  const [password, setPassword]=useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [passwordMismatchError, setPasswordMismatchError] = useState('')
  const [confirmationCode, setConfirmationCode]=useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);
  const{changePasswordEmail}=useAuth()


  

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setPasswordMismatchError('')
    if (password !== passwordConfirm) {
        setPasswordMismatchError('Passwords do not match');
        setIsLoading(false);
        return; // Stop the execution if the passwords don't match
      } else {
        setPasswordMismatchError(''); // Clear the error if the passwords match
      }
      setShowConfirmation(true)
      setIsLoading(false);
      
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }
  const handleConfirmPasswordChange = (event) => {
    setPasswordConfirm(event.target.value);
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
    setIsLoading(true);
    try {
      console.log('confirmationCode', confirmationCode)
      await confirmResetPassword({ username: changePasswordEmail, confirmationCode: confirmationCode, newPassword: password });
  
      setIsLoading(false);
      setShowConfirmation(false);
      router.push('/admin/login');
    } catch (error) {
      console.error('Error during user confirmation:', error);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmation(false);
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

  
  // when Next.js populates token within router,
  // reset form with new token value

  return (
    <div >
    {showConfirmation && (
      <div className={classes.overlay}>
        <div className={classes.modal} ref={cardRef}>
          <div className={classes.modal_close}>
          <button onClick={handleCloseModal} className={classes.closeButton}><XMarkIcon/></button>
          </div>
          <h2>Confirm your password change</h2>
          <div className={classes.modal_text}>
          <p>{`We have sent a 6-digit code to ${changePasswordEmail}.`}</p>
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
          <Button type='button' appearance='primary' onClick={() => handleConfirmCode()} disabled={isLoading}>
            {isLoading ? 'Confirming...' : 'Confirm'}
          </Button>
          
          </div>
        </div>
      </div>
    )}
    <form onSubmit={handleResetPassword} className={classes.form}>
    <div className={classes.form_header_wrapper}>
              <h3 className={classes.form_header}>Reset Password</h3>
              <p className={classes.form_sub_header}>Please enter a new password below.</p>
            </div>
            <div className={classes.form_wrapper}>
          <div className={classes.form_grid}>
      <Message error={error} className={classes.message} />
      <div className={classes.shipping_input_wrapper_1col}>
      <PasswordInput label='Password' value={password} onChange={handlePasswordChange} required={true} placeholder='Password' error={passwordMismatchError}/>
      </div>
      <div className={classes.shipping_input_wrapper_1col}>
      <PasswordInput label='Confirm password' value={passwordConfirm} onChange={handleConfirmPasswordChange} required={true} placeholder='Confirm password' error={passwordMismatchError}/>
      </div>
      <Button
        type="submit"
        appearance="primary"
        label="Reset Password"
        className={classes.submit}
      />
      </div>
      </div>
    </form>
    </div>
  )
}
