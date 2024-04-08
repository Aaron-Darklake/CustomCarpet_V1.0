// TextAreaInput.tsx
import React from 'react';
import styles from './textArea.module.scss'; // Update the path to your styles

interface TextAreaInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className={styles.field_type_textarea} style={{marginBottom:'0px'}}>
    <label className={styles.field_type_textarea_outer} style={{height:'46px'}}>
      <div className={styles.field_type_textarea_inner}>
          <textarea className={styles.field_type_textarea_element} 
            value={value} // Set the value of textarea
            onChange={onChange} // Set the onChange handler
          />
      </div>
    </label>
  </div>
  );
};

export default TextAreaInput;
