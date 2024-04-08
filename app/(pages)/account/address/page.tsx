'use client'
import React, { useEffect, useState } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'




import classes from './index.module.scss'
import { RenderParams } from '@/components/blocks/RenderParams'
import { Button } from '@/components/blocks/Button'
import cookieBasedClient from '@/components/config/cookiebased-client'
import { useAuth } from '@/providers/Auth'
import TextInput from '@/components/admin/textInput/TextInput'
import { fetchUserAttributes, updatePassword, updateUserAttributes } from 'aws-amplify/auth'
import { useNotification } from '@/providers/Notification'
import PasswordInput from '@/components/admin/passwordInput/titleInput'
import CountrySelectInput from '@/components/blocks/CountryInput'
import Icon from '@/components/utils/icon.util'
import { useModal } from '@faceless-ui/modal'
import dataClientPrivate from '@/components/config/data-server-client-private'

export default function Adresses() {
  const { toggleModal } = useModal()
  const{user,userAttributes,setUserAttributes, setAddressId}=useAuth()
  const{showMessage}=useNotification()
  const [addresses, setAddresses]=useState([])
  const [isMobile, setIsMobile] = useState<boolean>();

  useEffect(() => {
    const sub = dataClientPrivate.models.Address.observeQuery().subscribe({
      next: ({ items, isSynced }) => {
        setAddresses([...items]);
      },
    });
    
    return () => sub.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
    if(userAttributes?.['custom:addressId']){
      const {data: fetchedShippingAddress} = await dataClientPrivate.models.ShippingAddresses.get({id: userAttributes?.['custom:addressId']});
      console.log('fetchedShippingAddress', fetchedShippingAddress)
      const {data: fetchedAddress}= await fetchedShippingAddress.addresses()
      console.log('fetchedAddress', fetchedAddress)
      setAddresses(fetchedAddress)
    }
  }
  fetchAddress();
}, [userAttributes]);

const handleRemove = async(id)=>{
  const deletedItem = await dataClientPrivate.models.Address.delete({id: id})
  console.log('deleted item', deletedItem)

}
const handleEdit = async(id)=>{
  setAddressId(id)
  toggleModal('address-edit-modal')
  console.log('address id', id)

}

 

useEffect(() => {
    
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  window.addEventListener('resize', checkIsMobile);
  checkIsMobile();

  return () => {
    window.removeEventListener('resize', checkIsMobile);
  };
}, []);
  
 

  return (
    <div className={classes.profile}>
       {isMobile && 
      <div>
        <div>
          <div>
            <Link href='/account' className={classes.profile_mobile_btn}>
              <Icon icon={['fas', 'chevron-left']}/>
              <span>Account</span>
            </Link>
          </div>
        </div>
      </div>}
      <div className={classes.mainTitle_wrapper}>
      <h1>Shipping Addresses</h1>
      <p>View and update your shipping addresses, you can add as many as you like. Saving your addresses will make them available during checkout.</p>
      </div>
      <div className={classes.profile_content_wrapper}>
        <div className={classes.profile_content_grid}>

          <button type='button' onClick={() => toggleModal('address-modal')} className={classes.profile_content_grid_add_new}>
            <span>New address</span>
            <Icon icon={['fas','plus']}/>
          </button>
          {addresses?.map((address, index) => (
            <div key={index} className={classes.profile_content_grid_address_wrapper}>
              <div className={classes.profile_content_grid_address_content_wrapper}>
                <h1>{`${address.firstName} ${address.lastName}`}</h1>
                <p className={classes.profile_content_grid_address_content_company}>{address.company}</p>
                <p className={classes.profile_content_grid_address_content_address}>
                  <span>{address.address1}</span>
                  <span>{`${address.zip} - ${address.city}`}</span>
                  <span>{address.country}</span>
                </p>
              </div>
              <div className={classes.profile_content_grid_address_actions}>
                <button type='button' onClick={()=>handleEdit(address.id)} className={classes.profile_content_grid_address_actions_edit}>
                  <Icon icon={['far','pen-to-square']}/>
                  Edit
                </button>
                <button type='button' onClick={()=>handleRemove(address.id)} className={classes.profile_content_grid_address_actions_delete}>
                  <Icon icon={['far','trash-can']}/>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
       

      </div>
    </div>
  )
}
