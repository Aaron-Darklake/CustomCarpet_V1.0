'use client'

import { User } from '../../components/types/product-type'
import React, { createContext, useContext, useEffect, useState } from 'react'
import config from '../../amplifyconfiguration.json';
import { Amplify } from "aws-amplify";
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { set } from 'react-hook-form';

Amplify.configure(config, {
  ssr: true
});





type AuthContext = {
  user?: string | null
  userAttributes?
  setUser: (user: string | null) => void // eslint-disable-line no-unused-vars
  setUserAttributes: (userAttributes: {} | null) => void // eslint-disable-line no-unused-vars
  status: undefined | 'loggedOut' | 'loggedIn'
  addressId?: string
  setAddressId: (addressId: string) => void
  changePasswordEmail?: string
  setChangePasswordEmail: (changePasswordEmail: string) => void
}

const Context = createContext({} as AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>()
  const [userAttributes, setUserAttributes] = useState({})
  const [addressId, setAddressId] = useState<string>()
  const [changePasswordEmail, setChangePasswordEmail] = useState<string>()
  const router = useRouter()

  // used to track the single event of logging in or logging out
  // useful for `useEffect` hooks that should only run once
  const [status, setStatus] = useState<undefined | 'loggedOut' | 'loggedIn'>()

  

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        console.log(`The username: ${username}`);
        console.log(`The userId: ${userId}`);
        console.log('The signInDetails:', signInDetails);
        console.log('The User is authenticated!');
        
        if(userId){
          setUser(userId)
          setStatus('loggedIn')
        }
      } catch (err) {
        console.log(err);
        console.log('The User is not authenticated!');
        setUser(null)
      }
    };
    const userAtributes = async () => {
      const userAttributes = await fetchUserAttributes();
      console.log('userAttributes:', userAttributes);
      setUserAttributes(userAttributes);
      return userAttributes;
    }

    checkUser();
      userAtributes();
    
   
  }, []);
  

  return (
    <Context.Provider
      value={{
        user,
        userAttributes,
        setUserAttributes,
        setUser,
        status,
        addressId,
        setAddressId,
        changePasswordEmail,
        setChangePasswordEmail,
      }}
    >
      {children}
    </Context.Provider>
  )
}

type UseAuth = () => AuthContext // eslint-disable-line no-unused-vars

export const useAuth: UseAuth = () => useContext(Context)
