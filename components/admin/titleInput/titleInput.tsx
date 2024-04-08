import React from 'react';
import styles from './titleInput.module.scss'; // Adjust path as needed

interface TitleInputProps {
  label: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
  noBorder?: boolean;
  placeholder?: string;
}

const TitleInput: React.FC<TitleInputProps> = ({ label, value, onChange, required, noBorder, placeholder }) => {
  return (
   <div className={styles.document_fields_main_fields_divider} style={noBorder?{border: 'none'}: {}}>
    <header className={styles.document_fields_main_header}></header>
    <div className={styles.document_fields_main_render_fields}>
      <div className={styles.document_fields_main_fileds_type_text}>
        <label className={styles.document_fields_main_fields_label}>
          {label}
          {required && <span className={styles.document_fields_main_fields_required}>*</span>}
        </label>
        <div className={styles.document_fields_main_fields_input_wrapper} >
          <input 
           className={styles.document_fields_main_fields_input}
           type="text" 
           onChange={onChange}
           value={value}
           required={required}
           placeholder={placeholder || ''}/>
        </div>
      </div>
    </div>
    </div>
  );
};

export default TitleInput;
