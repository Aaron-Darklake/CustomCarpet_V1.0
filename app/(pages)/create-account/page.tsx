'use client'
import React from 'react'
import { Metadata } from 'next'





import {CreateAccountForm} from './CreateAccountForm'

import classes from './index.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import { RenderParams } from '../../../components/blocks/RenderParams'
import config from '../../../amplifyconfiguration.json';
import { Amplify } from "aws-amplify";

Amplify.configure(config, {
  ssr: true
});

export default function CreateAccount() {
 

  return (
    <section className={classes.createAccount}>
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
          <h3>Create Account</h3>
          <Image src="/assets/icons/hand.png" alt="hand" width={30} height={30}/>
        </div>

        <p>Please enter details</p>

        <CreateAccountForm />
      </div>
    </div>
  </section>
  )
}

