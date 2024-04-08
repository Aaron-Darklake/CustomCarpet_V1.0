import React from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'


import classes from './index.module.scss'
import { RenderParams } from '../../../components/blocks/RenderParams'
import config from '../../../amplifyconfiguration.json';
import { Amplify } from "aws-amplify";
import { RecoverPasswordForm } from './RecoverPasswordForm'

Amplify.configure(config, {
  ssr: true
});

export default async function AdminLogin() {
 

  return (
    <section className={classes.login}>
        <div className={classes.login_wrapper}>
           
            <RecoverPasswordForm/>
        </div>
     
    </section>
  )
}

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login or create an account to get started.',
}