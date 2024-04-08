'use client'
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import styles from './styles.module.scss';
import { Gutter } from '../../../../components/blocks/gutter/gutter';
import Icon from '../../../../components/utils/icon.util';
import ProductSidebar from '../../../../components/admin/sidebar/createSidebar';
import TitleInput from '../../../../components/admin/titleInput/titleInput';
import Link from 'next/link';
import DropdownSelect from '../../../../components/admin/dropDownSelect/dropDownSelect';
import DropDownSelectAdd from '../../../../components/admin/dropDownSelectAdd/dropDownSelectAdd';
import TextInput from '../../../../components/admin/textInput/TextInput';
import TextAreaInput from '../../../../components/admin/textArea/textArea';
import MediaUploadButtons from '../../../../components/admin/uploadButton/MediaUploadButton';
import Image from 'next/image';
import { getUrl, uploadData } from "aws-amplify/storage";
import dataClient from '@/components/config/data-server-client';
import { useNotification } from '@/providers/Notification';
import UploadOverlay from '@/components/admin/uploadOverlay';
import CategoriesSidebar from '@/components/admin/sidebar/category/createSidebar';
import { useModal } from '@faceless-ui/modal';
import { DrawerModalCategory } from '@/components/admin/drawer/tableDrawer/drawer';
import { DrawerModalNewMedia } from '@/components/admin/drawer/newMedia/drawer';
import dataClientPrivate from '@/components/config/data-server-client-private';
import { set } from 'react-hook-form';



const EditCategoriesModal = ({categorieId}) => {
  const router = useRouter();
  const { toggleModal } = useModal();
  const [isLoading, setIsLoading] = useState(false)
   // State to track if drop zone is being hovered over
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [isPopupOpen, setIsPopupOpen] = useState(false);
   const [selectedCategory, setSelectedCategory] = useState();
   const[file, setFile]=useState(null)
   const[fileDataUrl, setFileDataUrl]=useState(null)
   const [fileName, setFileName] = useState('');
   const [imageWidth, setImageWidth] = useState(0);
   const [imageHeight, setImageHeight] = useState(0);
   const [title, setTitle] = useState('');
   const [uploadProgress, setUploadProgress] = useState(0);
   const [categories, setCategories] = useState([]);
   const [media, setMedia]=useState()
   const [mediaRaw, setMediaRaw]=useState()
   const [parent, setParent]=useState()
   const [createdAt, setCreatedAt]= useState('')
   const [updatedAt, setUpdatedAt]= useState('')

   const { showMessage } = useNotification();

   // New state for title
  const [metaTitle, setMetaTitle] = useState(''); // New state for title
  const [metaDescription, setMetaDescription] = useState(''); // New state for description

   
 
  const handleMediaRawSelect = (selectedMedia) => {
    setMediaRaw(selectedMedia)
    console.log('Selected Media Raw:', selectedMedia);
    // Further processing with selectedMedia
  };

  const handleMediaSelect = (selectedMedia) => {
    setMedia(selectedMedia)
    console.log('Selected Media:', selectedMedia);
    // Further processing with selectedMedia
  };
  const handleRemoveMedia = () => {
    setMedia(undefined)
    setMediaRaw(undefined)
    // Further processing with selectedMedia
  };
 


  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };


   // Handle dropdown toggle
   const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

   const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

// Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setParent(category)
    console.log('Selected Category:', category);
    setIsDropdownOpen(false);
  };
const resetSelectedCategory = () => {
    setSelectedCategory(undefined);
    setIsDropdownOpen(false);
  };
 

 
const fetchCategories =  async () => {
    const{data: fetchedCategories} = await dataClient.models.Category.list();
    setCategories(fetchedCategories)
}

const fetchCategory = async (id) => {
    const {data: fetchedCategory} = await dataClientPrivate.models.Category.get({id: id});
    console.log('Fetched category:', fetchedCategory);
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
      
      // Use these functions after fetching your category data
      const createdDate = formatDate(fetchedCategory.createdAt); // replace 'fetchedCategory.createdAt' with your actual data
      const modifiedDate = formatDate(fetchedCategory.updatedAt); // replace 'fetchedCategory.updatedAt' with your actual data

 if(fetchedCategory.categoryMediaId){
    const{data: fetchedMedia} = await dataClientPrivate.models.Media.get({ id: JSON.parse(JSON.stringify(fetchedCategory.categoryMediaId))})
    const mediaItemWithUrl = async (mediaItem) => {
        const {url: downloadResult} = await getUrl({ key: mediaItem.url});
        console.log('Download result', downloadResult);
        const blobUrl = downloadResult.href; // Create a URL for the blob
        console.log('Blob url', blobUrl);
        return { ...mediaItem, blobUrl }; // Add blobUrl to the mediaItem
      };

      const updatedMediaItem = await mediaItemWithUrl(fetchedMedia);
      console.log('Updated media item:', updatedMediaItem);
      setMedia(updatedMediaItem)
      setMediaRaw(JSON.parse(JSON.stringify(fetchedMedia)))
      setImageWidth(fetchedMedia.width)
      setImageHeight(fetchedMedia.height)
      setFileDataUrl(fetchedMedia.blobUrl)
      setFileName(fetchedMedia.fileName)
 }
   
      
      // To use this function, call it with your mediaItem
      
      
      setTitle(fetchedCategory.title)
     
      setCreatedAt(createdDate)
      setUpdatedAt(modifiedDate)
      console.log('Fetched category:', fetchedCategory);
      console.log('Parent:', parent);
      console.log('Selected category:', selectedCategory);
      console.log('Categories:', categories);
      console.log('Media:', media);
      console.log('Media raw:', mediaRaw);
      console.log('File data URL:', fileDataUrl);
      console.log('File name:', fileName);
      console.log('Image width:', imageWidth);
      console.log('Image height:', imageHeight);
}




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
    fetchCategories()
    fetchCategory(categorieId)
    checkUser();
  }, []);



  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await dataClientPrivate.models.Category.delete({ id: categorieId });
      showMessage("Category deleted successfully!");
      router.push('/admin/collections/categories');
      setIsLoading(false)
    } catch (error) {
      console.error("Error deleting category:", error);
      showMessage("Failed to delete category.");
      setIsLoading(false)
    }
  };

  const handleDuplicate = async () => {
    setIsLoading(true)
    try {
        if (!mediaRaw) {
            console.error("No Media selected");
            if(parent && parent !== undefined){
                const { data: newCategory } = await dataClientPrivate.models.Category.create({title: JSON.parse(JSON.stringify(`${title} - Copy`)),  parent: parent});
                showMessage("Category duplicated successfully!");
                router.push(`/admin/collections/categories/${newCategory.id}`);
                setIsLoading(false)
                  } else {
                      const { data: newCategory } = await dataClientPrivate.models.Category.create({title: JSON.parse(JSON.stringify(`${title} - Copy`))});
                showMessage("Category duplicated successfully!");
                router.push(`/admin/collections/categories/${newCategory.id}`);
                setIsLoading(false)
                  }
          }
        if(parent && parent !== undefined){
      const { data: newCategory } = await dataClientPrivate.models.Category.create({title: JSON.parse(JSON.stringify(`${title} - Copy`)), media: mediaRaw, parent: parent});
      showMessage("Category duplicated successfully!");
      router.push(`/admin/collections/categories/${newCategory.id}`);
      setIsLoading(false)
        } else {
            const { data: newCategory } = await dataClientPrivate.models.Category.create({title: JSON.parse(JSON.stringify(`${title} - Copy`)), media: mediaRaw});
      showMessage("Category duplicated successfully!");
      router.push(`/admin/collections/categories/${newCategory.id}`);
      setIsLoading(false)
        }
    } catch (error) {
      console.error("Error duplicating category:", error);
      showMessage("Failed to duplicate category.");
    }
  };
  
  
  
  
  

 
 

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true)

    
        
    
        try {

            if (!mediaRaw) {
                console.error("No Media selected");
                if(parent && parent !== undefined){
                  const {data: newCategories, errors} = await dataClientPrivate.models.Category.update({ id: categorieId, title: JSON.parse(JSON.stringify(title)), media: undefined, parent: parent});
                  console.log("New categories:", newCategories);
                  console.log("Errors:", errors);
                  //console.log("Categories created:", newCategories);
                  showMessage("Categorie was updated successfully!");
                  router.push('/admin/collections/categories')
                  setIsLoading(false)
                } else {
                  const {data: newCategories, errors} = await dataClientPrivate.models.Category.update({ id: categorieId, categoryMediaId: null, title: JSON.parse(JSON.stringify(title))});
                  console.log("New categories:", newCategories);
                  console.log("Errors:", errors);
                  //console.log("Categories created:", newCategories);
                  showMessage("Categorie was updated successfully!");
                  router.push('/admin/collections/categories')
                  setIsLoading(false)
                }
              }

    
          // Create a media item in the database
          if(parent && parent !== undefined){
            const {data: newCategories, errors} = await dataClientPrivate.models.Category.update({ id: categorieId, title: JSON.parse(JSON.stringify(title)), media: mediaRaw, parent: parent});
            console.log("New categories:", newCategories);
            console.log("Errors:", errors);
            //console.log("Categories created:", newCategories);
            showMessage("Categorie was updated successfully!");
            router.push('/admin/collections/categories')
            setIsLoading(false)
          } else {
            const {data: newCategories, errors} = await dataClientPrivate.models.Category.update({ id: categorieId, title: JSON.parse(JSON.stringify(title)), media: mediaRaw});
            console.log("New categories:", newCategories);
            console.log("Errors:", errors);
            //console.log("Categories created:", newCategories);
            showMessage("Categorie was updated successfully!");
            router.push('/admin/collections/categories')
            setIsLoading(false)
          }
    
          // Additional actions after successful upload and database entry
          // like resetting form, showing success message, etc.
        } catch (error) {
          console.error("Error in file upload or media creation:", error);
          setIsLoading(false)
        }
      };


  
      


  return (
    <main className={styles.collection_edit}>
        <DrawerModalCategory onMediaSelect={handleMediaSelect} onMediaRawSelect={handleMediaRawSelect} />
        <DrawerModalNewMedia onMediaSelect={handleMediaSelect} onMediaRawSelect={handleMediaRawSelect}/>
      {isLoading   && (
        <UploadOverlay uploadProgress={undefined}/>
      )}
      <form className={styles.collection_edit_form} onSubmit={handleSubmit}>
        <Gutter className={styles.collection_edit_form_header}>
          <h1 className={styles.collection_edit_form_header_h1}>
            {`${title || '[Untitled]'}`}
          </h1>
          <div className={styles.doc_tabs}>
            <div className={styles.doc_tabs_container}>
            <ul className={styles.doc_tabs_tabs}> 
                <li className={styles.doc_tabs_tab_active}>
                    <a type='button'  className={styles.doc_tabs_tab_link}>
                        <span className={styles.doc_tabs_container_link_text}>
                            Edit
                        </span>
                    </a>
                </li>
            </ul>
            </div>
          </div>
        </Gutter>
        <div className={styles.collection_edit_form_controls}>
          <div className={styles.collection_edit_form_controls_wrapper}>
            <div className={styles.collection_edit_form_controls_content}>
              <ul className={styles.collection_edit_form_controls_meta}>
                <li className={styles.collection_edit_form_controls_meta_list}>
                  <p className={styles.collection_edit_form_controls_content_label}>{`Created:`}&nbsp;</p>
                  <p className={styles.collection_edit_form_controls_content_value}>{` ${createdAt}`}</p>
                </li>
                <li className={styles.collection_edit_form_controls_meta_list}>
                  <p className={styles.collection_edit_form_controls_content_label}>{`Last Modified:`}&nbsp;</p>
                  <p className={styles.collection_edit_form_controls_content_value}>{`${updatedAt}`}</p>
                </li>
              </ul>
            </div>
            <div className={styles.collection_edit_form_controls_controls_wrapper}>
              <div className={styles.collection_edit_form_controls_controls}>
                <div className={styles.collection_edit_form_submit}>
                    <button type='submit' className={styles.collection_edit_form_submit_btn}>
                      <span className={styles.collection_edit_form_submit_btn_content}>
                        <span className={styles.collection_edit_form_submit_btn_label}>Save</span>
                      </span>
                    </button>
                </div>
              </div>
              <div className={styles.collection_edit_form_controls_controls_popup}>
                <div className={styles.collection_edit_form_controls_controls_popup_trigger_wrap}>
                    <button type='button' className={styles.collection_edit_form_controls_controls_popup_trigger_wrap_button} onClick={togglePopup}>
                        <div className={styles.collection_edit_form_controls_controls_popup_trigger_wrap_button_dots}>
                        <Icon icon={['fas','ellipsis-vertical' ]}/>
                        </div>
                    </button>
                </div>
                {isPopupOpen && (
                    <div className={styles.collection_edit_form_controls_controls_popup_content}>
                    <div className={styles.collection_edit_form_controls_controls_popup_content_hide_scrollbar}>
                        <div className={styles.collection_edit_form_controls_controls_popup_content_scroll_container}>
                            <div className={styles.collection_edit_form_controls_controls_popup_content_scroll_content}>
                                <Link href='/admin/collections/categories/create' className={styles.collection_edit_form_controls_controls_popup_list_btn}>Create New</Link>
                                <button type='button' onClick={handleDuplicate} className={styles.collection_edit_form_controls_controls_popup_list_btn}>Duplicate</button>
                                <button type='button' onClick={handleDelete} className={styles.collection_edit_form_controls_controls_popup_list_btn}>Delete</button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.popup_caret}></div>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.document_fields_with_sidebar}>
          <div className={styles.document_fields_main}>
          <div className={styles.document_fields_main_gutter}>
            <TitleInput
                value={title}
                onChange={handleTitleChange}
                label='Title'
                required
                />
           
                    <MediaUploadButtons
                    label='Media'
                    selectedMedia={media}
                    onRemoveMedia={handleRemoveMedia}
                    onUploadNewMedia={() => toggleModal('modal-drawer-new-media')}
                    onChooseExistingMedia={() => toggleModal('modal-drawer-categories')}/>
                         
          </div>
          </div>
          <CategoriesSidebar
                              selectedCategory={selectedCategory}
                              categories={categories}
                              handleCategorySelect={handleCategorySelect}
                              resetSelectedCategory={resetSelectedCategory}
                              isDropdownOpen={isDropdownOpen}
                              toggleDropdown={toggleDropdown}
                             />
                             
                              
        </div>
    
      </form>
    </main>
    
  );
};



export default EditCategoriesModal;