import React from 'react';
import Icon from '@/components/utils/icon.util';
import styles from './Pagination.module.scss';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    startItem: number,
    endItem:number,
    perPagePopupVisible: boolean;
    handlePageChange: (newPage: number) => void;
    handleItemsPerPageChange: (newItemsPerPage: number) => void;
    togglePerPagePopup: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    perPagePopupVisible,
    startItem,
    endItem,
    handlePageChange,
    handleItemsPerPageChange,
    togglePerPagePopup,
}) => {


    const renderPaginationButtons = () => {
        let buttons = [];
        for (let i = 1; i <= totalPages; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    disabled={i === currentPage}
                    className={`${styles.table_page_control_paginator_page} 
                    ${i === currentPage ? styles.table_page_control_paginator_page_currentPage : ''} 
                    ${i === 1 && currentPage === 1 || i === totalPages && currentPage === totalPages ? styles.table_page_control_paginator_page_disabledPage : ''}`}
                >
                    {i}
                </button>
            );
        }
        return buttons;
    };

    return (
        <div className={styles.table_page_controls}>{/* TABLE Page Control */}
                  <div className={styles.table_page_control_paginator}>
                    {totalPages > 1 &&(
                      <>
                    <button  onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`${styles.table_page_control_paginator_arrow} 
                      ${currentPage === 1 ? styles.disabledArrow : ''}`}>
                    <Icon icon={['fas', 'chevron-left']} />
                    </button>    
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`${styles.table_page_control_paginator_arrow} 
                      ${styles.table_page_control_paginator_arrow_right} 
                      ${currentPage === totalPages ? styles.disabledArrow : ''}`}>
                      <Icon icon={['fas', 'chevron-right']} />
                    </button>    
                    {renderPaginationButtons()} </>) }       
                  </div>
                  <div className={styles.table_page_control_page_info}>
                  {`${startItem}-${endItem} of ${totalItems}`}
                  </div>
                  <div className={styles.table_page_control_per_page}>
                      <div className={styles.table_page_control_per_page_popup}>
                        <div className={styles.table_page_control_per_page_popup_triger_wrap}>
                            <button onClick={togglePerPagePopup} className={styles.table_page_control_per_page_base_btn}>
                              <div className={styles.table_page_control_per_page_button}>
                                <span>{`Per Page: ${itemsPerPage}`}</span>
                                <Icon icon={['fas', perPagePopupVisible ? 'chevron-up' : 'chevron-down']} />
                              </div>
                            </button>
                        </div>
                        <div className={`${styles.table_page_control_per_page_popup_content} ${perPagePopupVisible ? styles.table_page_control_per_page_popup_content_active : ''}`}>
                          <div className={styles.table_page_control_per_page_popup_hide_scrollbar}>
                            <div className={styles.table_page_control_per_page_popup_scroll_container}>
                                 <div className={styles.table_page_control_per_page_popup_scroll_content}>
                                      <div className={styles.table_page_control_per_page_popup_content_button_list}>
                                      {[5, 10, 25, 50, 100].map((value) => (
                                        <button
                                          key={value}
                                          onClick={() => handleItemsPerPageChange(value)}
                                          className={
                                            `${styles.table_page_control_per_page_popup_content_button_list_button} 
                                            ${itemsPerPage === value ? styles.table_page_control_per_page_popup_content_button_list_button_active : ''}`
                                          }>
                                          {itemsPerPage === value && (
                                            <div className={styles.per_page_chevron}>
                                              <Icon icon={['fas', 'chevron-right']} />
                                            </div>
                                          )}
                                          <span>{value}</span>
                                        </button>
                                      ))}
                                      </div>
                                 </div>     
                            </div>
                          </div>
                          <div className={styles.popup_caret}></div>
                        </div>
                      </div>
                  </div>
                </div> 
    );
};

export default Pagination;

