'use client'
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import Link from 'next/link';
import { Gutter } from '@/components/blocks/gutter/gutter';
import styles from './media.module.scss';
import Icon from '@/components/utils/icon.util';
import SearchControl from '@/components/admin/searchControl/searchControl';
import Pagination from '@/components/admin/pagination/pagination';
import Table from '@/components/admin/dataTable/table';
import dataClient from '@/components/config/data-server-client';
import { downloadData, getUrl, remove } from 'aws-amplify/storage';
import Image from 'next/image';
import { deleteStripeProductAndPrice } from '@/app/actions/stripe/createCustomer';
import { useNotification } from '@/providers/Notification';
import UploadOverlay from '@/components/admin/confirmOverlay';
import dataClientPrivate from '@/components/config/data-server-client-private';

interface Column {
    id: number;
    title: string;
  }

  

  const columnToPropertyMap = {
    'File Name': 'fileName',
    'Alt': 'alt',
    'ID': 'id',
    'Url': 'url',
    'File Size': 'fileSize',
    'MIME Type': 'mimeType',
    'Width': 'width',
    'Height': 'height',
    'Created At': 'createdAt',
    'Updated At': 'updatedAt',
  };


const Media = () => {
  const router = useRouter();
  const { showMessage } = useNotification();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  // Add a new state for the hovered index
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [sortColumn, setSortColumn] = useState('File Name');
  const [sortDirection, setSortDirection] = useState('ascending');
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(null); // This should come from your data
  const [perPagePopupVisible, setPerPagePopupVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDelete, setShowConfirmDelete]=useState(false);

  
  const [media, setMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);

  const fetchMediaData = async () => {
    try {
      // Fetch media metadata from your database
      const {data: mediaMetadata} = await dataClient.models.Media.list();
        console.log('Medialist',mediaMetadata)
      // For each media item, get the actual file URL from S3
     
      const mediaWithUrls = await Promise.all(mediaMetadata.map(async (mediaItem) => {
        const {url: downloadResult} = await getUrl({ key: mediaItem.url});
        const blobUrl = downloadResult.href; // Create a URL for the blob
        console.log('Blob url', blobUrl)
        return { ...mediaItem, blobUrl,  }; // Add both blobUrl and normalUrl
      }));

      setMedia(mediaWithUrls);
      setFilteredMedia(mediaWithUrls);
      setTotalItems(mediaWithUrls.length)
      console.log('Media with urls', mediaWithUrls)
    } catch (error) {
      console.error('Error fetching media data:', error);
    }
  };

  useEffect(() => {
    fetchMediaData();
  }, []);


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
      for (const productId of selectedMedia) {
        // Find the product details from your products array
        const mediaDetails = media.find(p => p.id === productId);
        if (!mediaDetails) continue;
        console.log('media details', mediaDetails)
        const removeFinished = await remove({key: mediaDetails.url});
        console.log('remove finished', removeFinished)
        const {data:deleteResult, errors} = await dataClientPrivate.models.Media.delete({id: productId})
        if(deleteResult){
          console.log('deleted successfully')
          setSelectedMedia([])
          setShowConfirmDelete(false)
          showMessage('Media/Image deleted sucessfully!')
          await fetchMediaData();
        } 
        if(errors){
          console.log('error deleting')
          setShowConfirmDelete(false)
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

  const filtered = media.filter(media => 
    media.fileName.toLowerCase().includes(newSearchTerm.toLowerCase())
  );
  setFilteredMedia(filtered);
  setCurrentPage(1); // Reset to the first page when search term changes
  setTotalItems(filtered.length); // Update total items count
  };
  

  console.log(perPagePopupVisible)



  const [activeColumns, setActiveColumns] = useState<Column[]>([
    { id:1, title: 'File Name' },
    { id: 2, title: 'Alt'},
    { id: 9, title: 'Url'},
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
  setSelectedMedia(prevSelected => {
    if (prevSelected.includes(productId)) {
      // If already selected, remove from the list
      return prevSelected.filter(id => id !== productId);
    } else {
      // If not selected, add to the list
      return [...prevSelected, productId];
    }
  });
  console.log(selectedMedia)
};


const handleSelectAll = () => {
  const allProductIdsOnPage = media.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(p => p.id);
  if (selectedMedia.length === allProductIdsOnPage.length || selectedMedia.length > 0) {
    // All are selected, so deselect all
    setSelectedMedia([]);
  } else if (selectedMedia.length === 0){
    // Not all are selected, so select all
    setSelectedMedia(allProductIdsOnPage);
  }
};

const handleSelectAllMedia = () => {
  const allProductIdsOnPage = media.map(p => p.id);
  
    setSelectedMedia(allProductIdsOnPage);
  
};









  const [columns, setColumns]  = useState<Column[]>([
    { id: 1,title: 'File Name' },
    { id: 2,title: 'Alt'},
    { id: 3,title: 'Created At' },
    { id: 4,title: 'ID'},
    { id: 5,title: 'MIME Type' },
    { id: 6,title: 'File Size' },
    { id: 7,title: 'Height'},
    { id: 8,title: 'Width'},
    { id: 9,title: 'Url'},
    { id: 10,title: 'Updated At'},
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
      sortMedia(column, 'ascending');
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
      sortMedia(column, 'descending');
    }
  };
  
  
  const sortMedia = (column, direction) => {
    const sortedMedia = [...filteredMedia].sort((a, b) => {
      if (a[columnToPropertyMap[column]] < b[columnToPropertyMap[column]]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[columnToPropertyMap[column]] > b[columnToPropertyMap[column]]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setMedia(sortedMedia);
    setFilteredMedia(sortedMedia);
  };
  
  
  

  const getProductProperty = (media, columnTitle) => {
    const propertyName = columnToPropertyMap[columnTitle];
    const propertyValue = media[propertyName];

    if (columnTitle === 'File Name') {
      return <Link href={`/admin/collections/media/${media.id}`} className={styles.cell_link}>
                <div className={styles.cell_link_file}>
                <div className={styles.cell_link_file_thumbnail}>
                    <Image src={media.blobUrl} alt={media.alt || 'alt'} width={media.width} height={media.height} priority/>
                </div>
                <span className={styles.cell_link_fileName}>{propertyValue}</span>
                </div>
                </Link>;
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
          router.push('/signin')
        }
      } catch (err) {
        
        console.log(err);
      }
    };

    checkUser();
  }, []);


    console.log("Selected Media:", selectedMedia);


  console.log(columns)

  return (

    <div className={styles.collection_list}>
       {showConfirmDelete && ( 
      <UploadOverlay onConfirm={handleDeleteConfirmed} onCancel={handleCancleDelete} selectedAmmount={selectedMedia.length}/>
      )}
        <Gutter className={styles.collection_list_wrap}>
            <header className={styles.collection_list_header}>
                <h1>Media</h1>
                <Link href="/admin/collections/media/create" className={styles.collection_list_header_btn}>Create Media</Link>
            </header>
            {/* SEARCH+FILTER */}
                <SearchControl
                searchTerm={searchTerm}
                selectedItems={selectedMedia}
                toggleDeleteItems={toggleDeleteItems}
                showDeleteButton={selectedMedia.length > 0}
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
                
                {selectedMedia.length > 0 ?
                <div className={styles.list_selection}>
                  <span>{`${selectedMedia.length} selected - `}</span>
                  {selectedMedia.length !== media.length ?
                  <button onClick={handleSelectAllMedia} className={styles.list_selection_btn}>{` Select all ${media.length} Media`}</button> :
                  <span>{`all selected`}</span>
                }
                </div> : <></> }
                {filteredMedia.length === 0 ? (
          // This will be shown if there are no media
          <div className={styles.no_results}>
            <p>No Media found. Either no Media exist yet or none match the filters you've specified above.</p>
            <Link href="/admin/collections/media/create" className={styles.no_result_btn}>Create Product</Link>
          </div>
        ) : (
               <>
               <Table
               activeColumns={activeColumns}
               selectedItems={selectedMedia}
               currentPage={currentPage}
               itemsPerPage={itemsPerPage}
               handleSelectAll={handleSelectAll}
               onSortAscending={onSortAscending}
               onSortDescending={onSortDescending}
               filteredItems={filteredMedia}
               items={media}
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



export default Media;