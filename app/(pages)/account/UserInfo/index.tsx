'use client'

import React from 'react'



import classes from './index.module.scss'
import { useAuth } from '@/providers/Auth'
import Icon from '@/components/utils/icon.util'

export const UserInfo = () => {
  const { user, userAttributes} = useAuth()

  return (
    <div className={classes.profile}>
       <Icon icon={['far','user-circle']} />
      <div className={classes.profileInfo}>
        <p className={classes.name}>{`${userAttributes?.given_name} ${userAttributes?.family_name}`}</p>
        <p className={classes.email}>{userAttributes?.email}</p>
      </div>
    </div>
  )
}