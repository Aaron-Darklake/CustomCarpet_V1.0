'use client'
import React, { Fragment, useEffect, useState } from 'react';
import classes from './index.module.scss';
import { Modal, ModalToggler, useModal } from '@faceless-ui/modal';
import Icon from '@/components/utils/icon.util';
import TextInput from '@/components/admin/textInput/TextInput';
import CountrySelectInput from '../CountryInput';
import dataClientPrivate from '@/components/config/data-server-client-private';
import { updateUserAttributes } from 'aws-amplify/auth';
import { useAuth } from '@/providers/Auth';

const modalSlug = 'address-edit-modal';



  



  export const AddressEditModal: React.FC = () => {
    const { toggleModal } = useModal();
    const{userAttributes, setUserAttributes, addressId, setAddressId}=useAuth()
 
  const[billingFirstName, setBillingFirstName]=useState('')
  const[billingLastName, setBillingLastName]=useState('')
  const[billingCompany, setBillingCompany]=useState('')
  const[address,setAddress]=useState('')
  const[city,setCity]=useState('')
  const[zip,setZip]=useState('')
  const[country,setCountry]=useState({code:'', country:''})


const handleBillingFirstNameChange = (event) => {
    setBillingFirstName(event.target.value);
  }
  const handleBillingLastNameChange = (event) => {
    setBillingLastName(event.target.value);
  }
  const handleBillingCompanyChange = (event) => {
    setBillingCompany(event.target.value);
  }
  const handleAddressInputChange = (event) => {
    setAddress(event.target.value);
  }
  const handleCityChange = (event) => {
    setCity(event.target.value);
  }
  const handleZipChange = (event) => {
    setZip(event.target.value);
  }
  const handleCountryChange = (selectedCountry) => {
    console.log('selectedCountry', selectedCountry)
    setCountry(selectedCountry); // Assuming the selectedCountry object has a 'value' property holding the ISO-2 country code
    
  };

  useEffect(() => {
    console.log('addressId',addressId)
    const fetchAddress = async () => {
    if(addressId){
      const {data: fetchedShippingAddress} = await dataClientPrivate.models.Address.get({id: addressId});
      console.log('fetchedShippingAddress', fetchedShippingAddress)
      console.log('fetchedAddress', fetchedShippingAddress)
      setBillingFirstName(fetchedShippingAddress.firstName)
      setBillingLastName(fetchedShippingAddress.lastName)
      setBillingCompany(fetchedShippingAddress.company)
      setAddress(fetchedShippingAddress.address1)
      setCity(fetchedShippingAddress.city)
      setZip(fetchedShippingAddress.zip)
      setCountry({code:fetchedShippingAddress.countryCode, country:fetchedShippingAddress.country})
    }
  }
  fetchAddress();
}, [userAttributes, addressId, ]);

  

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if(userAttributes?.['custom:addressId']){
        const{data: fetchedShippingAddress}= await dataClientPrivate.models.ShippingAddresses.get({id: userAttributes?.['custom:addressId']});

        let addressData
          if(billingCompany){
             addressData = {
              id: addressId,
            firstName: billingFirstName,
            lastName: billingLastName,
            company: billingCompany,
            address1: address,
            city: city,
            zip: zip,
            country: country.country,
            countryCode: country.code,
            shippingAddresses: JSON.parse(JSON.stringify(fetchedShippingAddress)),
          };
          } else {
             addressData = {
              id: addressId,
              firstName: billingFirstName,
              lastName: billingLastName,
              address1: address,
              city: city,
              company: '',
              zip: zip,
              country: country.country,
              countryCode: country.code,
              shippingAddresses: JSON.parse(JSON.stringify(fetchedShippingAddress)),
            };
          }
        const {data: newAddress, errors} = await dataClientPrivate.models.Address.update(JSON.parse(JSON.stringify(addressData)));
        console.log('newAddress', newAddress)
        console.log('errors', errors)
        const {data: updatedAddress, errors: error}= await dataClientPrivate.models.ShippingAddresses.update({
          id: JSON.parse(JSON.stringify(fetchedShippingAddress.id)),
          addresses: JSON.parse(JSON.stringify(newAddress))
        });
        console.log('updatedAddress', updatedAddress)
        console.log('error', error)
        setBillingFirstName('')
        setBillingLastName('')
        setAddress('')
        setBillingCompany('')
        setCity('')
        setZip('')
        setCountry({code:'', country:''})
        setAddressId('')
      } else {
        const{data: fetchedShippingAddress}= await dataClientPrivate.models.ShippingAddresses.list();
        console.log('fetchedShippingAddress', fetchedShippingAddress)

        if (fetchedShippingAddress.length === 0) {
          // Create new ShippingAddresses record if it does not exist
          const{data: newShippingAddresses} = await dataClientPrivate.models.ShippingAddresses.create(null);
          const {data: attributes} = await updateUserAttributes({
            userAttributes: {
              'custom:addressId': newShippingAddresses.id,
            }
          });
          setUserAttributes(attributes)
          console.log('newShippingAddresses',newShippingAddresses)
          let addressData
          if(billingCompany){
             addressData = {
            firstName: billingFirstName,
            lastName: billingLastName,
            company: billingCompany,
            address1: address,
            city: city,
            zip: zip,
            country: country.country,
            countryCode: country.code,
            shippingAddresses: JSON.parse(JSON.stringify(newShippingAddresses)),
          };
          } else {
             addressData = {
              firstName: billingFirstName,
              lastName: billingLastName,
              address1: address,
              city: city,
              zip: zip,
              country: country.country,
              countryCode: country.code,
              shippingAddresses: JSON.parse(JSON.stringify(newShippingAddresses)),
            };
          }
          const {data: newAddress, errors} = await dataClientPrivate.models.Address.update({id: JSON.parse(addressId)}, JSON.parse(JSON.stringify(addressData)));
          const {data: updatedAddress, errors: error}= await dataClientPrivate.models.ShippingAddresses.update({
            id: JSON.parse(JSON.stringify(newShippingAddresses.id)),
            addresses: JSON.parse(JSON.stringify(newAddress))
          });
          console.log('updatedAddress', updatedAddress)
          console.log('error', error)
        } else {
          // Add new address to existing ShippingAddresses
          let addressData
          if(billingCompany){
             addressData = {
            firstName: billingFirstName,
            lastName: billingLastName,
            company: billingCompany,
            address1: address,
            city: city,
            zip: zip,
            country: country.country,
            countryCode: country.code,
            shippingAddresses: JSON.parse(JSON.stringify(fetchedShippingAddress[0])),
          };
          } else {
             addressData = {
              firstName: billingFirstName,
              lastName: billingLastName,
              address1: address,
              city: city,
              zip: zip,
              country: country.country,
              countryCode: country.code,
              shippingAddresses: JSON.parse(JSON.stringify(fetchedShippingAddress[0])),
            };
          }
          const {data: newAddress, errors} = await dataClientPrivate.models.Address.update({id: JSON.parse(addressId)}, JSON.parse(JSON.stringify(addressData)));
          console.log('newAddress', newAddress)
          console.log('errors', errors)
          const {data: updatedAddress, errors: error}= await dataClientPrivate.models.ShippingAddresses.update({
            id: JSON.parse(JSON.stringify(fetchedShippingAddress[0].id)),
            addresses: JSON.parse(JSON.stringify(newAddress))
          });
          const {data: attributes} = await updateUserAttributes({
            userAttributes: {
              'custom:addressId': updatedAddress.id,
            }
          });
          setUserAttributes(attributes)
          console.log('updatedAddress', updatedAddress)
          console.log('error', error)
        }
      }
      
   
   
    // Step 3: Check if userShippingAddresses exists
    toggleModal('address-edit-modal')
   
    } catch (error) {
      console.error('Error adding new address:', error);
    }
  };

  const handleCancle = async () => {
    toggleModal('address-edit-modal')
    setBillingFirstName('')
    setBillingLastName('')
    setBillingCompany('')
    setAddress('')
    setCity('')
    setZip('')
    setCountry({code:'', country:''})
  }

 

 

 


 

  return (
    <Fragment>
      <Modal
        slug={modalSlug}
        className={classes.modal}
      >
        <div className={classes.collection_list_wrap}>
            <header className={classes.collection_list_header}>
                <h1>Add address</h1>
                <ModalToggler
                    slug={modalSlug}
                    className={classes.collection_list_header_btn_close}
                >
                    <Icon icon={['fas', 'close']} />
                 </ModalToggler>
            </header>
            <form onSubmit={handleSubmit} className={classes.collection_list_form}>
              <div className={classes.collection_list_form_address_container}>
                <div className={classes.collection_list_form_address_wrapper}>
                  <div className={classes.collection_list_form_address_2col}>
                  <TextInput label='First name' value={billingFirstName} onChange={handleBillingFirstNameChange} required={true} placeholder='First name'/>
                  <TextInput label='Last name' value={billingLastName} onChange={handleBillingLastNameChange} required={true} placeholder='Last name'/>
                  </div>
                  <div className={classes.collection_list_form_address_1col}>
                    <TextInput label='Company' value={billingCompany} onChange={handleBillingCompanyChange} required={false} placeholder='Company'/>
                  </div>
                  <div className={classes.collection_list_form_address_1col}>
                  <TextInput label='Address' value={address} onChange={handleAddressInputChange} required={true} placeholder='Address'/>
                  </div>
                  <div className={classes.collection_list_form_address_1_3_col}>
                    <TextInput label='Zip' value={zip} onChange={handleZipChange} required={true} placeholder='Zip'/>
                    <TextInput label='City' value={city} onChange={handleCityChange} required={true} placeholder='City'/>
                  </div>
                  <div className={classes.collection_list_form_address_1col}>
                  <CountrySelectInput label='Country' value={country} onChange={handleCountryChange} required={true} placeholder='Country'/>
                  </div>
                </div>
              </div>
              <div className={classes.collection_list_form_button_container}>
                <div className={classes.collection_list_form_button_wrapper}>
                  <button type='button' onClick={handleCancle} className={classes.collection_list_form_button_1}>Cancel</button>
                  <button type='submit' className={classes.collection_list_form_button_2}>Save</button>
                </div>
              </div>
            </form>            
      </div>
      </Modal>
    </Fragment>
  )
}