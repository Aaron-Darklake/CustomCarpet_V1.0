// CountrySelectInput.tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './index.module.scss'; // Adjust the path as needed

const countriesData = [
    { name: 'Argentina', code: 'AR', flagUrl: 'https://flagcdn.com/ar.svg' },
    { name: 'Australia', code: 'AU', flagUrl: 'https://flagcdn.com/au.svg' },
    { name: 'Austria', code: 'AT', flagUrl: 'https://flagcdn.com/at.svg' },
    { name: 'Bahrain', code: 'BH', flagUrl: 'https://flagcdn.com/bh.svg' },
    { name: 'Belgium', code: 'BE', flagUrl: 'https://flagcdn.com/be.svg' },
    { name: 'Brazil', code: 'BR', flagUrl: 'https://flagcdn.com/br.svg' },
    { name: 'Bulgaria', code: 'BG', flagUrl: 'https://flagcdn.com/bg.svg' },
    { name: 'Canada', code: 'CA', flagUrl: 'https://flagcdn.com/ca.svg' },
    { name: 'Chile', code: 'CL', flagUrl: 'https://flagcdn.com/cl.svg' },
    { name: 'China', code: 'CN', flagUrl: 'https://flagcdn.com/cn.svg' },
    { name: 'Colombia', code: 'CO', flagUrl: 'https://flagcdn.com/co.svg' },
    { name: 'Denmark', code: 'DK', flagUrl: 'https://flagcdn.com/dk.svg' },
    { name: 'Egypt', code: 'EG', flagUrl: 'https://flagcdn.com/eg.svg' },
    { name: 'Finland', code: 'FI', flagUrl: 'https://flagcdn.com/fi.svg' },
    { name: 'France', code: 'FR', flagUrl: 'https://flagcdn.com/fr.svg' },
    { name: 'Germany', code: 'DE', flagUrl: 'https://flagcdn.com/de.svg' },
    { name: 'Greece', code: 'GR', flagUrl: 'https://flagcdn.com/gr.svg' },
    { name: 'Hong Kong', code: 'HK', flagUrl: 'https://flagcdn.com/hk.svg' },
    { name: 'India', code: 'IN', flagUrl: 'https://flagcdn.com/in.svg' },
    { name: 'Indonesia', code: 'ID', flagUrl: 'https://flagcdn.com/id.svg' },
    { name: 'Ireland', code: 'IE', flagUrl: 'https://flagcdn.com/ie.svg' },
    { name: 'Israel', code: 'IL', flagUrl: 'https://flagcdn.com/il.svg' },
    { name: 'Italy', code: 'IT', flagUrl: 'https://flagcdn.com/it.svg' },
    { name: 'Japan', code: 'JP', flagUrl: 'https://flagcdn.com/jp.svg' },
    { name: 'Jordan', code: 'JO', flagUrl: 'https://flagcdn.com/jo.svg' },
    { name: 'Kenya', code: 'KE', flagUrl: 'https://flagcdn.com/ke.svg' },
    { name: 'Kuwait', code: 'KW', flagUrl: 'https://flagcdn.com/kw.svg' },
    { name: 'Lebanon', code: 'LB', flagUrl: 'https://flagcdn.com/lb.svg' },
    { name: 'Luxembourg', code: 'LU', flagUrl: 'https://flagcdn.com/lu.svg' },
    { name: 'Malaysia', code: 'MY', flagUrl: 'https://flagcdn.com/my.svg' },
    { name: 'Mexico', code: 'MX', flagUrl: 'https://flagcdn.com/mx.svg' },
    { name: 'Montenegro', code: 'ME', flagUrl: 'https://flagcdn.com/me.svg' },
    { name: 'Netherlands', code: 'NL', flagUrl: 'https://flagcdn.com/nl.svg' },
    { name: 'New Zealand', code: 'NZ', flagUrl: 'https://flagcdn.com/nz.svg' },
    { name: 'Nigeria', code: 'NG', flagUrl: 'https://flagcdn.com/ng.svg' },
    { name: 'Norway', code: 'NO', flagUrl: 'https://flagcdn.com/no.svg' },
    { name: 'Oman', code: 'OM', flagUrl: 'https://flagcdn.com/om.svg' },
    { name: 'Peru', code: 'PE', flagUrl: 'https://flagcdn.com/pe.svg' },
    { name: 'Philippines', code: 'PH', flagUrl: 'https://flagcdn.com/ph.svg' },
    { name: 'Poland', code: 'PL', flagUrl: 'https://flagcdn.com/pl.svg' },
    { name: 'Portugal', code: 'PT', flagUrl: 'https://flagcdn.com/pt.svg' },
    { name: 'Qatar', code: 'QA', flagUrl: 'https://flagcdn.com/qa.svg' },
    { name: 'Romania', code: 'RO', flagUrl: 'https://flagcdn.com/ro.svg' },
    { name: 'Russia', code: 'RU', flagUrl: 'https://flagcdn.com/ru.svg' },
    { name: 'Saudi Arabia', code: 'SA', flagUrl: 'https://flagcdn.com/sa.svg' },
    { name: 'Singapore', code: 'SG', flagUrl: 'https://flagcdn.com/sg.svg' },
    { name: 'South Africa', code: 'ZA', flagUrl: 'https://flagcdn.com/za.svg' },
    { name: 'South Korea', code: 'KR', flagUrl: 'https://flagcdn.com/kr.svg' },
    { name: 'Spain', code: 'ES', flagUrl: 'https://flagcdn.com/es.svg' },
    { name: 'Sweden', code: 'SE', flagUrl: 'https://flagcdn.com/se.svg' },
    { name: 'Switzerland', code: 'CH', flagUrl: 'https://flagcdn.com/ch.svg' },
    { name: 'Taiwan', code: 'TW', flagUrl: 'https://flagcdn.com/tw.svg' },
    { name: 'Thailand', code: 'TH', flagUrl: 'https://flagcdn.com/th.svg' },
    { name: 'Turkey', code: 'TR', flagUrl: 'https://flagcdn.com/tr.svg' },
    { name: 'Ukraine', code: 'UA', flagUrl: 'https://flagcdn.com/ua.svg' },
    { name: 'United Arab Emirates', code: 'AE', flagUrl: 'https://flagcdn.com/ae.svg' },
    { name: 'United Kingdom', code: 'GB', flagUrl: 'https://flagcdn.com/gb.svg' },
    { name: 'United States', code: 'US', flagUrl: 'https://flagcdn.com/us.svg' },
    { name: 'Venezuela', code: 'VE', flagUrl: 'https://flagcdn.com/ve.svg' },
];

    

interface CountrySelectInputProps {
  onChange: (value: {code: string, country: string}) => void;
  label?: string;
  value: {code: string, country: string};
  placeholder?: string;
  className?: string;
  required?: boolean; // Add this prop to mark the field as required
}

const CountrySelectInput: React.FC<CountrySelectInputProps> = ({
  onChange,
  label,
  value,
  placeholder,
  className = '',
  required = false, // Add this prop to mark the field as required
}) => {
  const [inputValue, setInputValue] = useState({code:'',country:''});
  const [input, setInput] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countriesData);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const validateInput = () => {
    if (!isTouched) {
      setIsTouched(true);
    }

    if (required && !input) {
      return 'This field is required';
    }

    if(required && input && inputValue.code === ''){
        return 'Select a country from the list!'
    }

    return '';
  };

  useEffect(() => {
    if (isTouched) {
      validateInput();
    }
  }, [value, isTouched]);

  useEffect(() => {
    const filtered = countriesData.filter(country =>
      country.name.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [inputValue, input]);

  const handleSelect = ({code, country}) => {
    onChange({code: code, country: country}); // Returning the ISO-2 code of the selected country
    setInput('')
    setIsDropdownOpen(false);
    setTimeout(() => setIsFocused(false), 150);
  };

  const handleFocus = () => {
    setIsDropdownOpen(true);
    setIsFocused(true);
  };

  const handleInputChange = (event) => {
    const newInput = event.target.value;
    setInput(newInput);

    // Check if the input no longer matches the currently selected country
    if (newInput.toLowerCase() !== (inputValue.country).toLowerCase()) {
      setInputValue({ code: '', country: '' });
      onChange({ code: '', country: '' }); // Notify the parent component
    }
  };


  const handleBlur = () => {
    // Delaying the onBlur to ensure that click event on dropdown items is registered
    setTimeout(() => setIsFocused(false), 150);
    if (!isTouched) {
        setIsTouched(true);
      }
  };

  useEffect(() => {
    if (value) {
      if (value.country) {
        setInputValue({country: value.country, code: value.code});
        setInput(value.country);
      }
    }
  }, [value]);

  useEffect(() => {
    if (!isFocused && isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  }, [isFocused, isDropdownOpen]);
  const errorMessage = (isTouched && validateInput());

  return (
    <div className={`${styles.document_fields} ${className}`}>
       {label && <label className={styles.document_fields_label}>{label} {required && <span className={styles.document_fields_main_fields_required}>*</span>}</label>}
       <div className={styles.document_fields_input_wrapper}>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur} // Add onBlur handler
        placeholder={placeholder}
        className={`${styles.document_fields_input} ${errorMessage ? styles.error : ''}`}
        required={required} // Add required prop to input element
      />
      </div>
      {errorMessage && <div className={styles.error_message}>{errorMessage}</div>}
      {isDropdownOpen && (
        <ul className={`${styles.countrySelectDropdown} ${errorMessage ? styles.errorDropdown : ''}`}>
          {filteredCountries.map(country => (
            <li key={country.code} onClick={() => handleSelect({code:country.code, country: country.name})}>
                <span className={styles.countrySelectDropdown_span}>
              <Image src={country.flagUrl} alt={country.name} width={50} height={50}/>
              </span>
              {country.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountrySelectInput;
