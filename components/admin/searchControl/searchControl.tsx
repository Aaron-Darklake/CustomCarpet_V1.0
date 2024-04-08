
import styles from './searchControl.module.scss';
import Icon from '@/components/utils/icon.util';

interface SearchControlProps {
  searchTerm: string;
  onSearchChange: (event ) => void;
  toggleColumnSelector: () => void;
  showColumnSelector: boolean;
  columns: Column[];
  isColumnActive: (title: string) => boolean;
  toggleColumnActive: (title: string) => void;
  toggleDeleteItems?: (items: string[]) => void;
  onDragStart: (event: React.DragEvent<HTMLButtonElement>, index: number) => void;
  onDragOver: (event: React.DragEvent<HTMLButtonElement>, index: number) => void;
  onDragEnd: () => void;
  onDrop: (event: React.DragEvent<HTMLButtonElement>) => void;
  isDragging: boolean;
  draggedIndex: number | null;
  selectedItems?: string[];
  showDeleteButton?: boolean;
}

interface Column {
  id: number;
  title: string;
}

const SearchControl: React.FC<SearchControlProps> = ({
  searchTerm,
  onSearchChange,
  toggleColumnSelector,
  showColumnSelector,
  columns,
  isColumnActive,
  toggleColumnActive,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  toggleDeleteItems,
  isDragging,
  draggedIndex,
  selectedItems,
  showDeleteButton=false,
}) => {
  

  return (
    <div className={styles.collection_list_controls}>
      <div className={styles.collection_list_controls_wrap}>
        <div className={styles.collection_list_controls_search}>
          <input
            type="text"
            name="search"
            placeholder="Search by Title"
            className={styles.collection_list_controls_search_input}
            value={searchTerm}
            onChange={onSearchChange}
          />
          <Icon icon={['fas', 'search']} />
        </div>
        <div className={styles.collection_list_controls_buttons}>
          <div className={styles.collection_list_controls_buttons_wrap}>
            {showDeleteButton && (

              <button onClick={()=>toggleDeleteItems(selectedItems)} className={styles.collection_list_controls_buttons_btn} style={{ paddingRight: '7.68px' }}>
                <span className={styles.collection_list_controls_buttons_btn_label}>Delete</span>
              </button>
            )}
            <button onClick={toggleColumnSelector} className={styles.collection_list_controls_buttons_btn}>
              <span className={styles.collection_list_controls_buttons_btn_label}>Columns</span>
              <span className={styles.collection_list_controls_buttons_btn_icon}>
                {' '}
                <Icon icon={['fas', showColumnSelector ? 'chevron-up' : 'chevron-down']} />
              </span>
            </button>
            <button className={styles.collection_list_controls_buttons_btn}>
              <span className={styles.collection_list_controls_buttons_btn_label}>Filters</span>
              <span className={styles.collection_list_controls_buttons_btn_icon}>
                {' '}
                <Icon icon={['fas', 'chevron-down']} />
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className={styles.collection_list_columns}>
        <div className={`${styles.collection_list_columns_hide} ${showColumnSelector ? styles.groupOpen : styles.groupClosed}`}>
          <div className={styles.collection_list_column_selector}>
            {columns.map((column, index) => (
              <button
                key={index}
                draggable
                onDragStart={(e) => onDragStart(e, index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDragEnd={onDragEnd}
                onDrop={onDrop}
                onClick={() => toggleColumnActive(column.title)}
                className={`${styles.collection_list_column_selector_btn} ${
                  isDragging && index === draggedIndex ? styles.hidden : ''
                } ${isColumnActive(column.title) ? styles.activeBtn : ''}`}
              >
                <span className={styles.collection_list_column_selector_icon}>
                  <Icon icon={['fas', isColumnActive(column.title) ? 'remove' : 'add']} />
                </span>
                <span className={styles.collection_list_column_selector_label}>{column.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchControl;
