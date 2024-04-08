import React from 'react'
import { Metadata } from 'next'

import { ResetPasswordForm } from './ResetPasswordForm'

import classes from './index.module.scss'
import { Gutter } from '@/components/blocks/gutter/gutter'

export default async function ResetPassword() {
  return (
    <Gutter className={classes.resetPassword}>
      <ResetPasswordForm />
    </Gutter>
  )
}

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Enter a new password.',
}
