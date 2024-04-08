'use client'
import React from 'react';
import styles from './Stepper.module.scss'; // Assuming you're using CSS Modules
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/providers/Checkout';
import Icon from '@/components/utils/icon.util';

const Stepper = ({ steps}) => {
    const {goToStep}=useCheckout()
    const router = useRouter()
    const{currentStep}=useCheckout()

    const handleNav = (href,index) => {
    router.push(href)
    goToStep(index)
  };
  console.log('steps',steps)

  return (
    <div className={styles.stepper} >
      <div className={styles.stepper_wrapper}>
      {steps.map((step, index) => (
        <div className={styles.stepper_step_wrapper} key={index}>
           <div className={`${styles.step_devider_wrap} ${index === 0 ? styles.step_devider_wrap_hidden : ''}`}>
           <span className={`${styles.step_devider} ${index <= currentStep ? styles.step_devider_completed : ''}`}></span>
            </div>
        <span className={styles.stepper_span}>
            <button type='button'  className={styles.step} onClick={()=>handleNav(step.href,index)} disabled={index >= currentStep}>
            <div className={`${styles.circle} ${index <= currentStep ? styles.active : ''}`}>
            {index < currentStep ? <Icon icon={['fas','check']} /> : index + 1}
            </div>
            </button>
          <span className={styles.stepper_content_span} >
            <span className={`${styles.stepper_content} ${index <= currentStep ? styles.stepper_content_active : ''}`}>{step.name}</span>
          </span>
       
        </span>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Stepper;
