import React from 'react'

import classes from './index.module.scss'
import Icon from '@/components/utils/icon.util'

interface RadioButton2Props {
  label: string
  value: string
  isSelected: boolean
  onRadioChange?: (value: string) => void
  groupName?: string
  price?: string
}

export const RadioButton2: React.FC<RadioButton2Props> = ({
  label,
  value,
  isSelected,
  onRadioChange,
  groupName,
  price
}) => {
  const handleRadioChange = () => {
    onRadioChange(value)
  }

  return (
    <button type='button'  className={`${classes.radioButton_wrapper} ${isSelected ? classes.radioButton_wrapper_active : ''}`} onClick={handleRadioChange}>
      <div className={classes.radioButton_input_wrapper}>
        <span className={`${classes.radioButton_input_wrapper_circle} ${isSelected ? classes.radioButton_input_wrapper_circle_active : ''}`}><span className={`${classes.radioButton_input_wrapper_circle_inner} ${isSelected ? classes.radioButton_input_wrapper_circle_inner_active : ''}`}></span></span>
    <label className={classes.radioWrapper}>
     <Icon icon={['fab','dhl']}/> {label}
    </label>
    </div>
    <span style={{fontSize:'12px'}}>{price}</span>
    </button>
  )
}