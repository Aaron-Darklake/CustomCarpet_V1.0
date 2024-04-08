'use client'
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import styles from './create.module.scss';
import { Gutter } from '../../../blocks/gutter/gutter';
import Icon from '../../../utils/icon.util';
import ProductSidebar from '../../sidebar/createSidebar';
import TitleInput from '../../titleInput/titleInput';
import Link from 'next/link';
import DropdownSelect from '../../dropDownSelect/dropDownSelect';
import DropDownSelectAdd from '../../dropDownSelectAdd/dropDownSelectAdd';
import TextInput from '../../textInput/TextInput';
import TextAreaInput from '../../textArea/textArea';
import MediaUploadButtons from '../../uploadButton/MediaUploadButton';
import Image from 'next/image';
import { getUrl, uploadData } from "aws-amplify/storage";
import dataClient from '@/components/config/data-server-client';
import { useNotification } from '@/providers/Notification';
import UploadOverlay from '@/components/admin/uploadOverlay';
import dataClientPrivate from '@/components/config/data-server-client-private';



const EditMediaModal = ({mediaId}) => {
  const router = useRouter();
   // State to track if files are attached
   const [filesAttached, setFilesAttached] = useState(false);
   const [isLoading, setIsLoading] = useState(false)
   // State to track if drop zone is being hovered over
   const [isDropZoneHovered, setIsDropZoneHovered] = useState(false);
   const [isFileDraggingOver, setIsFileDraggingOver] = useState(false);
   const[file, setFile]=useState(null)
   const[fileType, setFileType] = useState('')
   const[fileDataUrl, setFileDataUrl]=useState(null)
   const [fileName, setFileName] = useState('');
   const [imageWidth, setImageWidth] = useState(0);
   const [imageHeight, setImageHeight] = useState(0);
   const [alt, setAlt] = useState('');
   const [uploadProgress, setUploadProgress] = useState(0);
   const [isPopupOpen, setIsPopupOpen] = useState(false);
   const [fileSize, setFileSize] = useState(0)
   const { showMessage } = useNotification();
   const [createdAt, setCreatedAt]= useState('')
   const [updatedAt, setUpdatedAt]= useState('')

   
 



  const handleAltChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAlt(event.target.value);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };


  const fetchMedia = async (id) => {
    const {data: fetchedMedia} = await dataClientPrivate.models.Media.get({id: id})
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

    const createdDate = formatDate(fetchedMedia.createdAt); // replace 'fetchMedia.createdAt' with your actual data
    const modifiedDate = formatDate(fetchedMedia.updatedAt); // replace 'fetchedCategory.updatedAt' with your actual data

    const {url: downloadResult} = await getUrl({ key: fetchedMedia.url});
    const blobUrl = downloadResult.href;
    setFileDataUrl(blobUrl)
    setFileName(fetchedMedia.fileName)
    setCreatedAt(createdDate)
    setImageHeight(fetchedMedia.height)
    setImageWidth(fetchedMedia.width)
    setUpdatedAt(modifiedDate)
    setAlt(fetchedMedia.alt)
    setFileSize(fetchedMedia.fileSize)
    setFilesAttached(true)
    setFileType(fetchedMedia.mimeType)
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

    checkUser();
    fetchMedia(mediaId)
  }, []);


  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  // Function to handle file selection
  const handleFileSelect = (files: FileList) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setFilesAttached(true);
    setFileName(selectedFile.name);
  
    if (selectedFile) {
      const reader = new FileReader();
  
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const dataUrl = e.target?.result;
        setFileDataUrl(dataUrl as string);
  
        // Use 'window.Image' to refer to the native HTML Image object
        const image = new window.Image();
        image.onload = () => {
            setImageWidth(image.width);
            setImageHeight(image.height);
        };
        image.src = dataUrl as string;
      };
  
      reader.readAsDataURL(selectedFile);
    }
   
  };
  
  
  
  
  

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await dataClientPrivate.models.Media.delete({ id: mediaId });
      showMessage("Category deleted successfully!");
      router.push('/admin/collections/media');
      setIsLoading(false)
    } catch (error) {
      console.error("Error deleting category:", error);
      showMessage("Failed to delete category.");
      setIsLoading(false)
    }
  };

  // Function to handle drop event
  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleFileSelect(files);
    setIsFileDraggingOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
};

const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDraggingOver(true);
};

const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDraggingOver(false);
};
useEffect(() => {
const div = dropRef.current;
        if (div) {
            div.addEventListener('dragenter', handleDragEnter);
            div.addEventListener('dragleave', handleDragLeave);
            div.addEventListener('dragover', handleDragOver);
            div.addEventListener('drop', handleDrop);
            //div.addEventListener('paste', handlePaste);
            return ()=>{
                div.removeEventListener('dragenter', handleDragEnter);
                div.removeEventListener('dragleave', handleDragLeave);
                div.removeEventListener('dragover', handleDragOver);
                div.removeEventListener('drop', handleDrop);
                //div.removeEventListener('paste', handlePaste);
            };
        }
        return ()=>null;
    }, [
        handleDragEnter,
        handleDragLeave,
        handleDrop,
        //handlePaste
    ]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true)
        
    
        try {
    
          // URL of the uploaded file

          let mediaItem = {
            id: mediaId,
            fileName: fileName,
            fileSize: fileSize,
            mimeType: fileType,
            alt: alt,
            height: imageHeight,
            width: imageWidth,
          };


    
          // Create a media item in the database
          const {data: newMedia} = await dataClientPrivate.models.Media.update(JSON.parse(JSON.stringify(mediaItem)));
          showMessage("Media was uploaded to databse successfully!");

          router.push('/admin/collections/media')
          setIsLoading(false)
          // like resetting form, showing success message, etc.
        } catch (error) {
          console.error("Error in file upload or media creation:", error);
          setIsLoading(false)
        }
      };


  return (
    <main className={styles.collection_edit}>
      {isLoading  && (
        <UploadOverlay uploadProgress={undefined}/>
      )}
      <form className={styles.collection_edit_form} onSubmit={handleSubmit}>
        <Gutter className={styles.collection_edit_form_header}>
          <h1 className={styles.collection_edit_form_header_h1}>
            {`${alt || '[Untitled]'}`}
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
                                <Link href='/admin/collections/media/create' className={styles.collection_edit_form_controls_controls_popup_list_btn}>Create New</Link>
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
           
            <div className={styles.document_fields_file_field}>
                <div className={styles.document_fields_file_field_upload}>
                    {filesAttached && (
                    <>
                    <div className={styles.document_fields_file_field_thumbnail}>
                        <div className={styles.document_fields_file_field_thumbnail_medium}>
                            <Image src={fileDataUrl} alt="Thumbnail" layout='fill' />
                        </div>
                    </div>
                    <div className={styles.document_fields_file_adjustment}>
                    <div className={styles.document_fields_file_field_details_meta_url}>
                    <a href={fileDataUrl } target='_blank' rel='noreferrer'>{fileName}</a>
                    </div>
                         <div className={styles.document_fields_file_field_details_meta_size_type}>
                    {`${(fileSize / 1000000).toFixed(1)}MB - ${imageWidth}x${imageHeight} - ${fileType}`}
                  </div>
                        <div className={styles.document_fields_file_mutation}>
                            <button type='button' className={styles.document_fields_file_mutation_btn}>Edit Image</button>
                        </div>
                    </div>
                    </>
                    )}
                </div>
                
            </div>

            <TitleInput
                value={alt}
                onChange={handleAltChange}
                label='Alt'
                required
                noBorder
                />


          </div>
          </div>
        </div>
        
      </form>
    </main>
    
  );
};



export default EditMediaModal;