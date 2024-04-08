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

export default async function Login() {
 

  return (
    <section className={classes.login}>
      <div className={classes.heroImg}>
        <Link href="/">
          <Image
            src="/logo-black.svg"
            alt="logo"
            width={250}
            height={23}
            className={classes.logo}
          />
        </Link>
      </div>

      <div className={classes.formWrapper}>
        <div className={classes.formContainer}>
          <RenderParams className={classes.params}/>

          <div className={classes.formTitle}>
            <h3>Welcome</h3>
            <Image src="/assets/icons/hand.png" alt="hand" width={30} height={30}/>
          </div>

          <p>Please login here</p>

          <LoginForm />
        </div>
      </div>
    </section>
  )
}

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login or create an account to get started.',
  /*openGraph: mergeOpenGraph({
    title: 'Login',
    url: '/login',
  }),*/
}