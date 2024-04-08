'use client'
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import styles from './create.module.scss';
import { Gutter } from '../../../../../components/blocks/gutter/gutter';
import Icon from '../../../../../components/utils/icon.util';
import ProductSidebar from '../../../../../components/admin/sidebar/createSidebar';
import TitleInput from '../../../../../components/admin/titleInput/titleInput';
import Link from 'next/link';
import DropdownSelect from '../../../../../components/admin/dropDownSelect/dropDownSelect';
import DropDownSelectAdd from '../../../../../components/admin/dropDownSelectAdd/dropDownSelectAdd';
import TextInput from '../../../../../components/admin/textInput/TextInput';
import TextAreaInput from '../../../../../components/admin/textArea/textArea';
import MediaUploadButtons from '../../../../../components/admin/uploadButton/MediaUploadButton';
import Image from 'next/image';
import { uploadData } from "aws-amplify/storage";
import dataClient from '@/components/config/data-server-client';
import { useNotification } from '@/providers/Notification';
import UploadOverlay from '@/components/admin/uploadOverlay';
import CategoriesSidebar from '@/components/admin/sidebar/category/createSidebar';
import { useModal } from '@faceless-ui/modal';
import { DrawerModalCategory } from '@/components/admin/drawer/tableDrawer/drawer';
import { DrawerModalNewMedia } from '@/components/admin/drawer/newMedia/drawer';
import dataClientPrivate from '@/components/config/data-server-client-private';



const CreateCategories = () => {
  const router = useRouter();
  const { toggleModal } = useModal();
   // State to track if files are attached
   const [filesAttached, setFilesAttached] = useState(false);
   // State to track if drop zone is being hovered over
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const handleMetaTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMetaTitle(event.target.value);
  };

  const handleMetaDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMetaDescription(event.target.value);
  };


   // Handle dropdown toggle
   const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
    checkUser();
  }, []);



 
  
  
  
  
  

 
 

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!mediaRaw) {
          console.error("No Media selected");
          return;
        }
    
        try {

          let CategoryItem = {
            title: title,
            media: mediaRaw,
          };


    
          // Create a media item in the database
          if(parent && parent !== undefined){
            const {data: newCategories, errors} = await dataClientPrivate.models.Category.create({title: JSON.parse(JSON.stringify(title)), media: mediaRaw, parent: parent});
            console.log("New categories:", newCategories);
            console.log("Errors:", errors);
            //console.log("Categories created:", newCategories);
            showMessage("Categorie was created successfully!");
  
            router.push('/admin/collections/categories')
          } else {
            const {data: newCategories, errors} = await dataClientPrivate.models.Category.create({title: JSON.parse(JSON.stringify(title)), media: mediaRaw});
            console.log("New categories:", newCategories);
            console.log("Errors:", errors);
            //console.log("Categories created:", newCategories);
            showMessage("Categorie was created successfully!");
  
            router.push('/admin/collections/categories')
          }
    
          // Additional actions after successful upload and database entry
          // like resetting form, showing success message, etc.
        } catch (error) {
          console.error("Error in file upload or media creation:", error);
        }
      };


  
      


  return (
    <main className={styles.collection_edit}>
        <DrawerModalCategory onMediaSelect={handleMediaSelect} onMediaRawSelect={handleMediaRawSelect} />
        <DrawerModalNewMedia onMediaSelect={handleMediaSelect} onMediaRawSelect={handleMediaRawSelect}/>
      {uploadProgress > 0 && uploadProgress < 100  && (
        <UploadOverlay uploadProgress={undefined}/>
      )}
      <form className={styles.collection_edit_form} onSubmit={handleSubmit}>
        <Gutter className={styles.collection_edit_form_header}>
          <h1 className={styles.collection_edit_form_header_h1}>
            {`${title || '[Untitled]'}`}
          </h1>
        </Gutter>
        <div className={styles.collection_edit_form_controls}>
          <div className={styles.collection_edit_form_controls_wrapper}>
            <div className={styles.collection_edit_form_controls_content}>
              <ul className={styles.collection_edit_form_controls_meta}>
                <li className={styles.collection_edit_form_controls_meta_list}>
                  <p className={styles.collection_edit_form_controls_content_value}>Creating new Categories</p>
                </li>
              </ul>
            </div>
            <div className={styles.collection_edit_form_controls_controls_wrapper}>
              <div className={styles.collection_edit_form_controls_controls}>
                <div className={styles.collection_edit_form_submit}>
                    <button type='submit' className={styles.collection_edit_form_submit_btn}>
                      <span className={styles.collection_edit_form_submit_btn_content}>
                        <span className={styles.collection_edit_form_submit_btn_label}>Save Categories</span>
                      </span>
                    </button>
                </div>
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



export default CreateCategories;