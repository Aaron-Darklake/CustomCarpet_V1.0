
// TextInput.tsx
'use client'
import React, { useEffect, useState } from 'react';
import styles from './titleInput.module.scss'; // Adjust the path as needed
import Icon from '@/components/utils/icon.util';

interface PasswordInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string; // Optional label
  type?: string; // Optional type, default is 'text'
  placeholder?: string; // Optional placeholder
  className?: string; // Optional additional CSS class
  required?: boolean;
  newPassword?: string;
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  label,
  type = 'text',
  placeholder,
  className = '',
  required=false,
  newPassword,
  error,
}) => {
  const [isTouched, setIsTouched] = useState(false);

  const validateInput = () => {
    if (!isTouched) {
      setIsTouched(true);
      error=''
    }

    if (required && !value) {
      return 'This field is required';
    }
    if (required && newPassword && newPassword !== value) {
      return 'New Password and Confirm New Password must match!';
    }

    if (type === 'email' && value && !/^\S+@\S+\.\S+$/.test(value)) {
      return 'Invalid email address format (e.g., user@example.com)';
    }

    if (type === 'tel' && value && !/^\+\d{1,3}\s?\d{4,14}(?:x.+)?$/.test(value)) {
      return 'Invalid phone number format (e.g., +123 4567890)';
    }

    return '';
  };

  useEffect(() => {
    if (isTouched) {
      validateInput();
    }
  }, [value, isTouched]);

  const handleBlur = () => {
    if (!isTouched) {
      setIsTouched(true);
    }
  };
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const errorMessage = error || (isTouched && validateInput());
  return (
    <div className={`${styles.document_fields} ${className}`}>
      {label && <label className={styles.document_fields_label}>{label} {required && <span className={styles.document_fields_main_fields_required}>*</span>}</label>}
      <div className={styles.document_fields_input_wrapper} >
        <input
          type={isPasswordVisible ? "text" : "password"} 
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`${styles.document_fields_input} ${errorMessage ? styles.error : ''}`}
          required={required}
        />
         <button 
              onClick={togglePasswordVisibility} 
              type="button" 
              className={styles.password_visibility_toggle}
            >
              {isPasswordVisible ? <Icon icon={['far','eye']}/>: <Icon icon={['far','eye-slash']}/>}
            </button>
      </div>
      {errorMessage && <div className={styles.error_message}>{errorMessage}</div>}
    </div>
  );
};

export default PasswordInput;
