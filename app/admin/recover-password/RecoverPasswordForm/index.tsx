'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'



import classes from './index.module.scss'
import { Message } from '@/components/blocks/Message'
import { Input } from '@/components/blocks/Input'
import { Button } from '@/components/blocks/Button'
import TextInput from '@/components/admin/textInput/TextInput'
import { ResetPasswordOutput, resetPassword } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/Auth'

type FormData = {
  email: string
}

export const RecoverPasswordForm: React.FC = () => {
  const [error, setError] = useState('')
  const router = useRouter()
  const [success, setSuccess] = useState(false)
  const{setChangePasswordEmail}=useAuth()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const handleMailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onSubmit = useCallback(async (data: FormData) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.ok) {
      setSuccess(true)
      setError('')
    } else {
      setError(
        'There was a problem while attempting to send you a password reset email. Please try again.',
      )
    }
  }, [])

  const handleRecoverPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    try{
      const output = await resetPassword({ username: email });
      console.log(output);
      handleResetPasswordNextSteps(output);
    } catch (error) {
      console.log(error);
    }
  }

  function handleResetPasswordNextSteps(output: ResetPasswordOutput) {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        console.log(
          `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`
        );
        // Collect the confirmation code from the user and pass to confirmResetPassword.
        setChangePasswordEmail(email)
        router.push('/admin/reset-password')
        break;
      case 'DONE':
        console.log('Successfully reset password.');
        break;
    }
  }

  return (
    <Fragment>
      {!success && (
        <React.Fragment>
            <form onSubmit={handleRecoverPassword} className={classes.form}>
            <div className={classes.form_header_wrapper}>
              <h3 className={classes.form_header}>Forgot Password</h3>
              <p className={classes.form_sub_header}>Please enter your email below. You will receive an email with a verification code which u need while resetting your password.</p>
            </div>
            <div className={classes.form_wrapper}>
          <div className={classes.form_grid}>
              <Message error={error} className={classes.message} />
            <div className={classes.shipping_input_wrapper_1col}>
              <TextInput label='Email' type='email' value={email} onChange={handleMailChange} required={true} placeholder='Email address' />
            </div>
            <Button
              type="submit"
              appearance="primary"
              label={isLoading ? 'Processing' : 'Recover'}
              disabled={isLoading}
              className={classes.submit}
            />
            <div className={classes.links}>
              <Link href={'/admin/login'}>Back to login</Link>
            </div>
            </div>
            </div>
            </form>
        </React.Fragment>
      )}
      {success && (
        <React.Fragment>
          <h1>Request submitted</h1>
          <p>Check your email for a link that will allow you to securely reset your password.</p>
        </React.Fragment>
      )}
    </Fragment>
  )
}
