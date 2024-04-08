import React from 'react';
import Icon from '@/components/utils/icon.util';
import styles from './DropdownSelect.module.scss'; // Adjust path as needed

interface DropdownSelectProps {
  label: string;
  selectedValue: string;
  options: string[];
  isOpen: boolean;
  toggleDropdown: () => void;
  handleSelect: (value: string) => void;
  resetSelection: () => void;
  dropDownTitle: string;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  label,
  selectedValue,
  options,
  isOpen,
  toggleDropdown,
  handleSelect,
  resetSelection,
  dropDownTitle,
}) => {
  return (
   
<div className={styles.document_fields_categorie_select_container} onClick={toggleDropdown}>
<div className={styles.document_fields_categorie_select_container_container}>
<div className={styles.document_fields_categorie_controls}>

  <div className={styles.document_fields_categorie_value_container}>
    <div className={styles.document_fields_categorie_rs_value_container}>
      <div className={styles.document_fields_categorie_rs_placeholder}> {selectedValue || label}</div>
      {selectedValue && (
            <button onClick={resetSelection} className={styles.document_fields_categorie_remove_button}>
              <Icon icon={['fas', 'times']} />
            </button>
          )}
      <div className={styles.document_fields_categorie_rs_input_Container}>
        <p className={styles.document_fields_categorie_rs_value}></p>
      </div>
    </div>
  </div>
  <div className={styles.document_fields_categorie_rs_indicator}>
    <span className={styles.document_fields_categorie_rs_indicator_seperator}></span>
    <Icon icon={['fas', isOpen ? 'chevron-up' : 'chevron-down']}/>
  </div>
</div>
</div>
  {isOpen && (
    <div className={styles.document_fields_categorie_dropdown}>
      <div className={styles.document_fields_categorie_dropdown_menu_list}>
        <div className={styles.document_fields_categorie_dropdown_menu_group}>
          <div className={styles.document_fields_categorie_dropdown_menu_group_heading}>{dropDownTitle}</div>
          <div>
      {options.map((option, index) => (
        <div key={index} className={styles.document_fields_categorie_dropdown_item} onClick={() => handleSelect(option)}>
          {option}
        </div>
      ))}
      </div>
      </div>
      </div>
    </div>
  )}
</div>
  );
};

export default DropdownSelect;
