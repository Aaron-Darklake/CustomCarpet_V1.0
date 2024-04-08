import React from 'react';
import Icon from '@/components/utils/icon.util';
import Link from 'next/link';
import styles from './table.module.scss';

interface TableColumn {
  id: number;
  title: string;
}

interface TableRow {
  id: string;
  [key: string]: any;
}

interface TableProps {
  activeColumns: TableColumn[];
  selectedItems: any[];
  currentPage: number;
  itemsPerPage: number;
  handleSelectAll?: () => void;
  onSortAscending: (title: string) => void;
  onSortDescending: (title: string) => void;
  filteredItems: TableRow[];
  items: TableRow[];
  getItemProperty: (item: TableRow, columnTitle: string) => JSX.Element;
  handleItemSelection: (id: string) => void;
  sortColumn: string,
  sortDirection: string,
  selecting?: boolean,
  multiple?: boolean,

}

const Table: React.FC<TableProps> = ({
  activeColumns,
  selectedItems,
  currentPage,
  itemsPerPage,
  handleSelectAll,
  onSortAscending,
  onSortDescending,
  filteredItems,
  items,
  getItemProperty,
  handleItemSelection,
  sortColumn,
  sortDirection,
  selecting=false,
  multiple=false,
}) => {
  const isItemSelected = (item) => {
    if (multiple) {
      // If multiple selection is enabled, check if the item's id is in the selectedItems array
      return selectedItems.some(selectedItem => selectedItem.id === item.id);
    } else {
      // If single selection, use the existing logic
      return selectedItems.includes(item?.id);
    }
  };
  

  return (
    <div className={styles.table}>
                    <table cellPadding={0} cellSpacing={0}>
                        <thead>
                            <tr>
                                <th className={styles.heading_select}>
                                   
                                        {selecting ? (<></>):(
                                           <div className={styles.table_checkbox}>
                                           <div className={styles.table_checkbox_input}>
                                        <button
                                          onClick={handleSelectAll}
                                          className={styles.selectAllButton}
                                            >
                                            <span className={`${selectedItems.length === items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).length || selectedItems.length > 0 ? styles.table_checkbox_input_icon_active : styles.table_checkbox_input_icon}`}>
                                            {selectedItems.length === items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).length || selectedItems.length > 0 ? 
                                                  <Icon icon={['fas', 'minus']} /> : 
                                                   <Icon icon={['fas', 'check']} /> }
                                            </span>
                                            </button>
                                             </div>
                                             </div>
                                            )}
                                        
                                       
                                </th>
                                {activeColumns.map((column, index) => (
                                    <th key={index} className={styles.table_sort_column_th}>
                                    <div className={styles.table_sort_column}>
                                    <span className={styles.table_sort_column_label}>{column.title}</span>
                                    <div className={styles.table_sort_column_buttons}>
                                    <button 
                                      onClick={() => onSortAscending(column.title)}
                                      className={`${styles.table_sort_column_icon} ${sortColumn === column.title && sortDirection === 'ascending' ? styles.activeSort : ''}`}
                                    >
                                        <Icon icon={['fas', 'chevron-down']} />
                                        </button>
                                        <button 
                                            onClick={() => onSortDescending(column.title)}
                                            className={`${styles.table_sort_column_icon} ${sortColumn === column.title && sortDirection === 'descending' ? styles.activeSort : ''}`}
                                          >
                                        <Icon icon={['fas', 'chevron-up']} />
                                        </button>
                                    </div>
                                    </div>
                                    </th>
                                ))}
                            </tr> 
                        </thead>
                        <tbody>
                            {filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, index) => (
                                <tr key={index}  className={isItemSelected(item) ? styles.rowSelected : ''}>
                                    <td className={styles.cell_select}>
                                    
                                      {selecting && !multiple ? (<button
                                        id={`select-${item.id}`}
                                        type='button'
                                        onClick={() => handleItemSelection(item.id)}
                                        className={styles.selectionButton_select}
                                      >
                                        Select
                                      </button>) : (
                                        <div className={styles.table_checkbox}>
                                        <div className={`${styles.table_checkbox_input} ${isItemSelected(item) ? styles.table_checkbox_input_active : ''}`}>
                                      <button
                                        id={`select-${item.id}`}
                                        type='button'
                                        onClick={() => handleItemSelection(item.id)}
                                        className={styles.selectionButton}
                                      >
                                        <span className={`${isItemSelected(item) ? styles.table_checkbox_input_icon_active : styles.table_checkbox_input_icon}`}>
                                          <Icon icon={['fas', 'check']} />
                                        </span>
                                      </button>
                                      </div>
                                    </div>
                                      )}
                                       
                                            
                                       
                                    </td>
                                    {activeColumns.map((column, colIndex) => (
                           
                  <td key={colIndex} className={styles.cell_values}>
                     {getItemProperty(item, column.title)}
                  
                  </td>
                  
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
  );
};

export default Table;
