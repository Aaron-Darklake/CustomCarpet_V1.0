import React from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'





import LoginForm from './LoginForm'

import classes from './index.module.scss'
import { RenderParams } from '../../../components/blocks/RenderParams'
import config from '../../../amplifyconfiguration.json';
import { Amplify } from "aws-amplify";

Amplify.configure(config, {
  ssr: true
});

export default async function AdminLogin() {
 

  return (
    <section className={classes.login}>
        <div className={classes.login_wrapper}>
            <div className={classes.login_header}>
                <span>TechHaven. by Darklake</span>
            </div>
            <div>
                <p className={classes.login_content}>
                   <b>Welcome to your dashboard!</b> This is where site admins will log in to manage your store. Customers will need to <Link href="/login">log in to the site instead</Link> to access their user account, order history, and more.
                </p>
            </div>
            <LoginForm/>
        </div>
     
    </section>
  )
}

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login or create an account to get started.',
}