// ProductSidebar.tsx
import React from 'react';
import Icon from '../../../utils/icon.util';
import styles from '../createSidebar.module.scss'; // Adjust the path as needed

interface CategoriesSidebarProps {
  selectedCategory;
  categories?;
  handleCategorySelect: (category) => void;
  resetSelectedCategory: () => void;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
}

const CategoriesSidebar: React.FC<CategoriesSidebarProps> = ({
  selectedCategory,
  categories,
  handleCategorySelect,
  resetSelectedCategory,
  isDropdownOpen,
  toggleDropdown,
}) => {
  return (
    <div className={styles.document_fields_sidebar_wrapper}>
            <div className={styles.document_fields_sidebar}>
             <div className={styles.document_fields_sidebar_fields}>
              <div className={styles.document_fields_sidebar_render_fields}>
                <div className={styles.document_fields_categorie}>
                  <label className={styles.document_fields_label}>Parent</label>   
                  <div className={styles.document_fields_categorie_wraper} onClick={toggleDropdown}>
                    <div className={styles.document_fields_categorie_select_container}>
                      <div className={styles.document_fields_categorie_select_container_container}>
                      <div className={styles.document_fields_categorie_controls}>

                        <div className={styles.document_fields_categorie_value_container}>
                          <div className={styles.document_fields_categorie_rs_value_container}>
                            <div className={styles.document_fields_categorie_rs_placeholder}> {selectedCategory?.title || 'Select a value'}</div>
                            {selectedCategory && (
                                  <button onClick={resetSelectedCategory} className={styles.document_fields_categorie_remove_button}>
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
                          <Icon icon={['fas', isDropdownOpen ? 'chevron-up' : 'chevron-down']}/>
                        </div>
                      </div>
                      </div>
                        {isDropdownOpen && (
                          <div className={styles.document_fields_categorie_dropdown}>
                            <div className={styles.document_fields_categorie_dropdown_menu_list}>
                              <div className={styles.document_fields_categorie_dropdown_menu_group}>
                                <div className={styles.document_fields_categorie_dropdown_menu_group_heading}>Categories</div>
                                <div>
                                    
                            {categories?.map((category, index) => (
                              <div key={index} className={styles.document_fields_categorie_dropdown_item} onClick={() => handleCategorySelect(category)}>
                                {category.title}
                              </div>
                            ))}
                            {!categories || categories?.length === 0 && (
                                 <div className={styles.document_fields_categorie_dropdown_item} >
                                 no categories
                               </div>)}
                            </div>
                            </div>
                            </div>
                          </div>
                        )}
                      </div>
                    <div className={styles.document_fields_categorie_add_new}>
                      <button type='button' className={styles.document_fields_categorie_add_new_btn}>
                      <Icon icon={['fas', 'plus']} />
                      </button>
                    </div>
                  </div>             
                </div>
              </div>
             </div>
            </div>
          </div>
  );
};

export default CategoriesSidebar;
