// CategoryDropDownSelectAdd.tsx
import React from 'react';
import Icon from '@/components/utils/icon.util';
import styles from './DropdownSelectAdd.module.scss'; // Ensure this path is correct

interface DropDownSelectAddProps {
  selectedValue: any;
  items: any[];
  handleSelect: (item) => void;
  resetSelection: (item) => void;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
  label: string;
  placeholder: string;
  addNewButton?: boolean; // Optional prop for showing an 'Add New' button
}

const DropDownSelectAdd: React.FC<DropDownSelectAddProps> = ({
  selectedValue,
  items,
  handleSelect,
  resetSelection,
  isDropdownOpen,
  toggleDropdown,
  label,
  placeholder,
  addNewButton = false
}) => {
  return (
    <div className={styles.document_fields_categorie}>
      <label className={styles.document_fields_label}>{label}</label>   
      <div className={styles.document_fields_categorie_wraper} onClick={toggleDropdown}>
        <div className={styles.document_fields_categorie_select_container}>
          <div className={styles.document_fields_categorie_select_container_container}>
            <div className={styles.document_fields_categorie_controls}>
              <div className={styles.document_fields_categorie_value_container}>
                <div className={styles.document_fields_categorie_rs_value_container}>
                {selectedValue.length > 0 ? selectedValue.map((item, index) => (
                    <div key={index} className={styles.document_fields_categorie_rs_placeholder}>
                      {item.title}
                      <button type='button' onClick={() => resetSelection(item.id)} className={styles.document_fields_categorie_remove_button}>
                        <Icon icon={['fas', 'times']} />
                      </button>
                    </div>
                  )) : <div className={styles.document_fields_categorie_rs_placeholder}>{placeholder}</div>}
                </div>
              </div>
              <div className={styles.document_fields_categorie_rs_indicator}>
                <span className={styles.document_fields_categorie_rs_indicator_seperator}></span>
                <Icon icon={['fas', isDropdownOpen ? 'chevron-up' : 'chevron-down']}/>
              </div>
            </div>
          </div>
          {isDropdownOpen && (
            <div className={styles.document_fields_categorie_dropdown}>
              <div className={styles.document_fields_categorie_dropdown_menu_list}>
                <div className={styles.document_fields_categorie_dropdown_menu_group}>
                  <div className={styles.document_fields_categorie_dropdown_menu_group_heading}>{label}</div>
                  {items.map((item, index) => (
                    <div key={index} className={styles.document_fields_categorie_dropdown_item} onClick={() => handleSelect(item)}>
                      {item.title}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {addNewButton && (
          <div className={styles.document_fields_categorie_add_new}>
            <button type='button' className={styles.document_fields_categorie_add_new_btn}>
              <Icon icon={['fas', 'plus']} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropDownSelectAdd;
