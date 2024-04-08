'use client'
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import Link from 'next/link';
import { Gutter } from '@/components/blocks/gutter/gutter';
import styles from './products.module.scss';
import Icon from '@/components/utils/icon.util';
import SearchControl from '@/components/admin/searchControl/searchControl';
import Pagination from '@/components/admin/pagination/pagination';
import Table from '@/components/admin/dataTable/table';
import dataClient from '@/components/config/data-server-client';
import { set } from 'react-hook-form';
import UploadOverlay from '@/components/admin/confirmOverlay';
import { deleteStripeProductAndPrice } from '@/app/actions/stripe/createCustomer';
import { useNotification } from '@/providers/Notification';
import dataClientPrivate from '@/components/config/data-server-client-private';

interface Column {
    id: number;
    title: string;
  }


  const columnToPropertyMap = {
    'Title': 'title',
    'Stripe Product': 'stripeProductID',
    'Stripe Price': 'stripePriceID',
    'ID': 'id',
    'Price JSON': 'priceJSON',
    'Categories': 'categories',
    'Description': 'description',
    'Image': 'images',
    'Slug': 'slug',
    'Related Products': 'relatedProducts',
    'Created At': 'createdAt',
    'Updated At': 'updatedAt',
  };


const Products = () => {
  const router = useRouter();
  const { showMessage } = useNotification();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  // Add a new state for the hovered index
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [sortColumn, setSortColumn] = useState('Title');
  const [sortDirection, setSortDirection] = useState('ascending');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(null); // This should come from your data
  const [perPagePopupVisible, setPerPagePopupVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDelete, setShowConfirmDelete]=useState(false);
  
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState(products);

  if(totalItems === null){
    setTotalItems(filteredProducts.length)
  }
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setPerPagePopupVisible(false);
     // Calculate new total pages
  const newTotalPages = Math.ceil(totalItems / newItemsPerPage);
  if (currentPage > newTotalPages) {
    setCurrentPage(newTotalPages || 1); // Set to the last page or 1 if no pages
  }
  };

  const togglePerPagePopup = () => {
    setPerPagePopupVisible(!perPagePopupVisible);
  };

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

  const filtered = products.filter(product => 
    product.title.toLowerCase().includes(newSearchTerm.toLowerCase())
  );
  setFilteredProducts(filtered);
  setCurrentPage(1); // Reset to the first page when search term changes
  setTotalItems(filtered.length); // Update total items count
  };
  

  console.log(perPagePopupVisible)



  const [activeColumns, setActiveColumns] = useState<Column[]>([
    { id:1, title: 'Title' },
    { id: 2, title: 'Stripe Product'},
    { id: 4, title: 'ID'},
  ]);

const isColumnActive = (title: string) => {
  return activeColumns.some(column => column.title === title);
};



const toggleColumnActive = (title: string) => {
  if (isColumnActive(title)) {
    setActiveColumns(activeColumns.filter(column => column.title !== title));
  } else {
    const columnToAdd = columns.find(column => column.title === title);
    if (columnToAdd) {
      setActiveColumns([...activeColumns, columnToAdd]);
    }
  }
};

const toggleColumnSelector = () => {
    setShowColumnSelector(prevShow => !prevShow);
};

console.log(activeColumns)



const handleProductSelection = (productId) => {
  setSelectedProducts(prevSelected => {
    if (prevSelected.includes(productId)) {
      // If already selected, remove from the list
      return prevSelected.filter(id => id !== productId);
    } else {
      // If not selected, add to the list
      return [...prevSelected, productId];
    }
  });
  console.log(selectedProducts)
};


const handleSelectAll = () => {
  const allProductIdsOnPage = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(p => p.id);
  if (selectedProducts.length === allProductIdsOnPage.length || selectedProducts.length > 0) {
    // All are selected, so deselect all
    setSelectedProducts([]);
  } else if (selectedProducts.length === 0){
    // Not all are selected, so select all
    setSelectedProducts(allProductIdsOnPage);
  }
};

const handleSelectAllProducts = () => {
  const allProductIdsOnPage = products.map(p => p.id);
  
    setSelectedProducts(allProductIdsOnPage);
  
};









  const [columns, setColumns]  = useState<Column[]>([
    { id: 1,title: 'Title' },
    { id: 2,title: 'Stripe Product'},
    { id: 3,title: 'Stripe Price'},
    { id: 4,title: 'ID'},
    { id: 5,title: 'Price JSON'},
    { id: 6,title: 'Categories'},
    { id: 7,title: 'Description'},
    { id: 8,title: 'Slug'},
    { id: 9,title: 'Related Products'},
    { id: 10,title: 'Updated At'},
    { id: 11,title: 'Created At'},
    // Add more links as needed
  ]);

  
  function formatDate(dateInput: string | number | Date): string {
    const date = new Date(dateInput);
  
    // Get date components
    const dayOfMonth = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
  
    // Get time components
    const hour = date.getHours();
    const minute = date.getMinutes();
  
    // Get the ordinal suffix for the day
    const ordinalSuffix = getOrdinalSuffix(dayOfMonth);
  
    // Format the time with AM/PM
    const timeFormatted = new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  
    // Construct the full date string
    return `${month} ${dayOfMonth}${ordinalSuffix} ${year}, ${timeFormatted}`;
  }
  
  function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }
  
  const onSortAscending = (column) => {
    if (sortColumn === column && sortDirection === 'ascending') {
      setSortDirection(null);
      setSortColumn(null);
      // Reset to original order or apply your default sorting
    } else {
      setSortDirection('ascending');
      setSortColumn(column);
      sortProducts(column, 'ascending');
    }
  };
  
  const onSortDescending = (column) => {
    if (sortColumn === column && sortDirection === 'descending') {
      setSortDirection(null);
      setSortColumn(null);
      // Reset to original order or apply your default sorting
    } else {
      setSortDirection('descending');
      setSortColumn(column);
      sortProducts(column, 'descending');
    }
  };
  
  
  const sortProducts = (column, direction) => {
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (a[columnToPropertyMap[column]] < b[columnToPropertyMap[column]]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[columnToPropertyMap[column]] > b[columnToPropertyMap[column]]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setProducts(sortedProducts);
    setFilteredProducts(sortedProducts);
  };
  
  
  

  const getProductProperty = (product, columnTitle) => {
    const propertyName = columnToPropertyMap[columnTitle];
    const propertyValue = product[propertyName];

    if (columnTitle === 'Title') {
      return <Link href={`/admin/collections/products/${product.id}`} className={styles.cell_link}>{propertyValue}</Link>;
    } else

    if (columnTitle === 'ID') {
      return <code className={styles.cell_code}>{`ID: ${propertyValue}`}</code>;
    } else if (['Published On', 'Updated At', 'Created At'].includes(columnTitle)) {
      return <span className={styles.cell_span}>{formatDate(propertyValue)}</span>;
    } else {
      return <span className={styles.cell_span}>{propertyValue}</span>
    }
  };


  

  

  const onDragStart = (event: React.DragEvent<HTMLButtonElement>, index: number) => {
    setDraggedIndex(index);
    setIsDragging(true);
    document.body.classList.add('grabbing');
};

const onDragOver = (event: React.DragEvent<HTMLButtonElement>, index: number) => {
  event.preventDefault();
  if (draggedIndex === null) return;

 
  if (index !== hoveredIndex) {
    let newColumns = [...columns];
    const draggedItem = newColumns.splice(draggedIndex, 1)[0];
    newColumns.splice(index, 0, draggedItem);

    setColumns(newColumns);
    setHoveredIndex(index);
    setDraggedIndex(index);

    // Check if dragged item is in activeColumns and update the order
    if (activeColumns.some(ac => ac.title === draggedItem.title)) {
      let newActiveColumns = [...activeColumns];
      const activeIndex = activeColumns.findIndex(ac => ac.title === draggedItem.title);
      newActiveColumns.splice(activeIndex, 1); // Remove the item from its current position
      const newActiveIndex = newColumns.findIndex(nc => nc.title === draggedItem.title);
      newActiveColumns.splice(newActiveIndex, 0, draggedItem); // Insert it at the new position

      setActiveColumns(newActiveColumns);
    }
    
  }
};

const onDrop = (event) => {
  // Prevent default to allow drop
  event.preventDefault();

  if (draggedIndex === null || hoveredIndex === null) return;

  let newColumns = [...columns];
  const draggedItem = newColumns.splice(draggedIndex, 1)[0];
  newColumns.splice(hoveredIndex, 0, draggedItem);

  setColumns(newColumns);


  // Update active columns order
  let newActiveColumns = [...activeColumns];
  if (activeColumns.some(ac => ac.title === draggedItem.title)) {
      const activeIndex = activeColumns.findIndex(ac => ac.title === draggedItem.title);
      newActiveColumns.splice(activeIndex, 1);
      const newActiveIndex = newColumns.findIndex(nc => nc.title === draggedItem.title);
      newActiveColumns.splice(newActiveIndex, 0, draggedItem);
  }
  setActiveColumns(newActiveColumns);

  // Reset indexes
  setDraggedIndex(null);
  setHoveredIndex(null);
  
};





const onDragEnd = () => {
    // Use a timeout to delay the state update
    requestAnimationFrame(() => {
        setHoveredIndex(null);
        setDraggedIndex(null);
        setIsDragging(false);
        document.body.classList.remove('grabbing');
    }); // A minimal delay
};

const fetchProducts = async () =>{
  const {data: fetchedProducts, errors} = await dataClient.models.Product.list()
    if(errors){
      throw new Error('Failed to fetch products');
    } else{
      setProducts(fetchedProducts)
      setFilteredProducts(fetchedProducts)
      setTotalItems(fetchedProducts.length)
      console.log('Fetched Products:', fetchedProducts)
    }
}

useEffect(() => {
  if (showConfirmDelete) {
    // Disable scrolling on the body
    document.body.style.overflow = 'hidden';
  } else {
    // Enable scrolling on the body
    document.body.style.overflow = '';
  }
}, [showConfirmDelete]);

const toggleDeleteItems = (itemsToDelete) => {
  console.log('it would now show delete confirmation and would delete this items:', itemsToDelete)
  setShowConfirmDelete(true)
  // Pass `itemsToDelete` to modal for handling the delete confirmation
};
const handleCancleDelete = () => {
  console.log('cancled delete process!!!')
  setShowConfirmDelete(false)
  // Pass `itemsToDelete` to modal for handling the delete confirmation
};

// Function to actually delete items (to be called from confirmation modal)
const handleDeleteConfirmed = async () => {
  try {
    for (const productId of selectedProducts) {
      // Find the product details from your products array
      const product = products.find(p => p.id === productId);
      if (!product) continue;
     const result = await deleteStripeProductAndPrice(product.stripeProductID, product.stripePriceID)
     if(result.success === true){
      const {data:deleteResult, errors} = await dataClientPrivate.models.Product.delete({id: productId})
      if(deleteResult){
        console.log('deleted successfully')
        setSelectedProducts([])
        setShowConfirmDelete(false)
        showMessage('Product deleted sucessfully!')
        await fetchProducts();
      } 
      if(errors){
        console.log('error deleting')
        setShowConfirmDelete(false)
      }
     }
    }


    

    // Update state and UI
    // e.g., remove deleted products from the products array, update totalItems, etc.
    // Set selectedProducts to an empty array
    //setSelectedProducts([]);

    // Display success message
  } catch (error) {
    // Handle errors (e.g., display error message)
  }
};







  useEffect(() => {
    const checkUser = async () => {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        const userAttributes = await fetchUserAttributes()
        const role = userAttributes?.['custom:role']
        console.log(`The username: ${username}`);
        console.log(`The userId: ${userId}`);
        console.log('The signInDetails:', signInDetails);
        if(!userId || role !== 'admin'){
          router.push('/login')
        }
      } catch (err) {
        
        console.log(err);
      }
    };
    fetchProducts()
    checkUser();
  }, []);


    console.log("Selected Products:", selectedProducts);


  console.log(columns)

  return (

    <div className={styles.collection_list}>
      {showConfirmDelete && ( 
      <UploadOverlay onConfirm={handleDeleteConfirmed} onCancel={handleCancleDelete} selectedAmmount={selectedProducts.length}/>
      )}
     
        <Gutter className={styles.collection_list_wrap}  >
            <header className={styles.collection_list_header}>
                <h1>Products</h1>
                <Link href="/admin/collections/products/create" className={styles.collection_list_header_btn}>Create Product</Link>
            </header>
            {/* SEARCH+FILTER */}
                <SearchControl
                selectedItems={selectedProducts}
                toggleDeleteItems={toggleDeleteItems}
                showDeleteButton={selectedProducts.length > 0}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                showColumnSelector={showColumnSelector}
                toggleColumnSelector={toggleColumnSelector}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
                onDrop={onDrop}
                columns={columns}
                isColumnActive={isColumnActive}
                toggleColumnActive={toggleColumnActive}
                isDragging={isDragging}
                draggedIndex={draggedIndex}/>
                {selectedProducts.length > 0 ?
                <div className={styles.list_selection}>
                  <span>{`${selectedProducts.length} selected - `}</span>
                  {selectedProducts.length !== products.length ?
                  <button onClick={handleSelectAllProducts} className={styles.list_selection_btn}>{` Select all ${products.length} Products`}</button> :
                  <span>{`all selected`}</span>
                }
                </div> : <></> }
                {filteredProducts.length === 0 ? (
          // This will be shown if there are no products
          <div className={styles.no_results}>
            <p>No Products found. Either no Products exist yet or none match the filters you've specified above.</p>
            <Link href="/admin/collections/products/create" className={styles.no_result_btn}>Create Product</Link>
          </div>
        ) : (
               <>
               <Table
               activeColumns={activeColumns}
               selectedItems={selectedProducts}
               currentPage={currentPage}
               itemsPerPage={itemsPerPage}
               handleSelectAll={handleSelectAll}
               onSortAscending={onSortAscending}
               onSortDescending={onSortDescending}
               filteredItems={filteredProducts}
               items={products}
               getItemProperty={getProductProperty}
               handleItemSelection={handleProductSelection}
               sortColumn={sortColumn}
               sortDirection={sortDirection}/>
                
                
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              startItem={startItem}
              endItem={endItem}
              perPagePopupVisible={perPagePopupVisible}
              handlePageChange={handlePageChange}
              handleItemsPerPageChange={handleItemsPerPageChange}
              togglePerPagePopup={togglePerPagePopup}
               />  </>)}             
      </Gutter>
    </div>
  );
};



export default Products;