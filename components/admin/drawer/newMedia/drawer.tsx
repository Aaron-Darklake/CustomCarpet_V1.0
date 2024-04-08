'use client'
import React, { Fragment, useEffect, useRef, useState } from 'react';
import classes from './index.module.scss';
import { Modal, ModalToggler, useModal } from '@faceless-ui/modal';
import TitleInput from '../../titleInput/titleInput';
import Icon from '@/components/utils/icon.util';
import Image from 'next/image';
import { Gutter } from '@/components/blocks/gutter/gutter';
import UploadOverlay from '../../uploadOverlay';
import { useNotification } from '@/providers/Notification';
import { useRouter } from 'next/navigation';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { getUrl, uploadData } from 'aws-amplify/storage';
import dataClient from '@/components/config/data-server-client';
import dataClientPrivate from '@/components/config/data-server-client-private';


const modalSlug = 'modal-drawer-new-media';





export const DrawerModalNewMedia = ({onMediaSelect, onMediaRawSelect}) => {
  const router = useRouter()
  const [filesAttached, setFilesAttached] = useState(false);
  // State to track if drop zone is being hovered over
  const [isDropZoneHovered, setIsDropZoneHovered] = useState(false);
  const [isFileDraggingOver, setIsFileDraggingOver] = useState(false);
  const[file, setFile]=useState(null)
  const[fileDataUrl, setFileDataUrl]=useState(null)
  const [fileName, setFileName] = useState('');
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [alt, setAlt] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');

  const { showMessage } = useNotification();



  




 const handleAltChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   setAlt(event.target.value);
 };



 const { toggleModal } = useModal();






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

   checkUser();
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
 
 
 
 
 

 // Function to trigger file input click
 const handleButtonClick = () => {
   fileInputRef.current.click();
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
   
       if (!file) {
         console.error("No file selected");
         return;
       }
   
       try {
         // Upload the file to S3
         const { result: uploadResult  } =  uploadData({
           key: `media/${fileName}`,
           data: file,
           options: {
               onProgress: ({ transferredBytes, totalBytes }) => {
                 if (totalBytes) {
                   const progress = Math.round((transferredBytes / totalBytes) * 100);
                   setUploadProgress(progress);
                 }
               },
             },
           // other options if necessary
         });
   
         // URL of the uploaded file
         const fileUrl = (await uploadResult).key;
         console.log("File URL:", fileUrl);
         console.log("Upload result:", uploadResult);

         let mediaItem = {
          fileName: fileName,
          fileSize: file.size,
          mimeType: file.type,
          alt: alt,
          url: fileUrl,
          height: imageHeight,
          width: imageWidth,
        };


  
        // Create a media item in the database
        const {data: newMedia} = await dataClientPrivate.models.Media.create(JSON.parse(JSON.stringify(mediaItem)));

         const mediaItemWithUrl = async (mediaItem) => {
          const {url: downloadResult} = await getUrl({ key: mediaItem.url});
          console.log('Download result', downloadResult);
          const blobUrl = downloadResult.href; // Create a URL for the blob
          console.log('Blob url', blobUrl);
          return { ...mediaItem, blobUrl }; // Add blobUrl to the mediaItem
        };
        
        // To use this function, call it with your mediaItem
        const updatedMediaItem = await mediaItemWithUrl(newMedia);
         onMediaSelect(updatedMediaItem)
         onMediaRawSelect(newMedia)
         console.log("Media created:", newMedia);
         showMessage("Media was uploaded to databse successfully!");

         toggleModal(modalSlug)
   
         // Additional actions after successful upload and database entry
         // like resetting form, showing success message, etc.
       } catch (error) {
         console.error("Error in file upload or media creation:", error);
       }
     };


    
    

  return (
    <Fragment>
      <Modal
        slug={modalSlug}
        className={classes.modal}
      >
    
        
          <ModalToggler
            slug={modalSlug}
            className={classes.close}
          >
          </ModalToggler>

          <div className={classes.content}>
            <div className={classes.content_children}>
            <main className={classes.collection_edit}>
      {uploadProgress > 0 && uploadProgress < 100  && (
        <UploadOverlay uploadProgress={uploadProgress}/>
      )}
      <form className={classes.collection_edit_form} onSubmit={handleSubmit}>
        <Gutter className={classes.collection_edit_form_header}>
        <header className={classes.collection_list_header}>
                <h1>Add new Media</h1>
                <ModalToggler
                    slug={modalSlug}
                    className={classes.collection_list_header_btn_close}
                >
                    <Icon icon={['fas', 'close']} />
                 </ModalToggler>
            </header>
        </Gutter>
        <div className={classes.collection_edit_form_controls}>
          <div className={classes.collection_edit_form_controls_wrapper}>
            <div className={classes.collection_edit_form_controls_content}>
              <ul className={classes.collection_edit_form_controls_meta}>
                <li className={classes.collection_edit_form_controls_meta_list}>
                  <p className={classes.collection_edit_form_controls_content_value}>Creating new Media</p>
                </li>
              </ul>
            </div>
            <div className={classes.collection_edit_form_controls_controls_wrapper}>
              <div className={classes.collection_edit_form_controls_controls}>
                <div className={classes.collection_edit_form_submit}>
                    <button type='submit' className={classes.collection_edit_form_submit_btn}>
                      <span className={classes.collection_edit_form_submit_btn_content}>
                        <span className={classes.collection_edit_form_submit_btn_label}>Save Media</span>
                      </span>
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.document_fields_with_sidebar}>
          <div className={classes.document_fields_main}>
          <div className={classes.document_fields_main_gutter}>
           
            <div className={classes.document_fields_file_field}>
                <div className={classes.document_fields_file_field_upload}>
                    {filesAttached && file !== null ? (
                    <>
                    <div className={classes.document_fields_file_field_thumbnail}>
                        <div className={classes.document_fields_file_field_thumbnail_medium}>
                            <Image src={URL.createObjectURL(file)} alt="Thumbnail" layout='fill' />
                        </div>
                    </div>
                    <div className={classes.document_fields_file_adjustment}>
                        <input
                        type='text'
                        value={fileName} // Display the file name in the input field
                        onChange={(e) => setFileName(e.target.value)}
                        className={classes.document_fields_file_fileName}
                        />
                        <div className={classes.document_fields_file_mutation}>
                            <button type='button' className={classes.document_fields_file_mutation_btn}>Edit Image</button>
                        </div>
                    </div>
                    <button type='button' className={classes.document_fields_file_field_remove}>
                        <span className={classes.document_fields_file_field_remove_content}>
                            <span className={classes.document_fields_file_field_remove_icon}>
                            <Icon icon={['fas', 'remove']} />
                            </span>
                        </span>
                    </button>
                    </>
                    ):(
                <div ref={dropRef}
                  className={`${classes.document_fields_file_field_dropzone} ${isFileDraggingOver ? classes.dropZoneHovered : ''}`}
                  
                 >
                    <button  onClick={handleButtonClick} type='button' className={classes.document_fields_file_field_dropzone_file_btn}>
                        <span className={classes.document_fields_file_field_dropzone_file_btn_content}>
                            <span className={classes.document_fields_file_field_dropzone_file_btn_label}>Select a file</span>
                        </span>
                    </button>
                    <input 
                    ref={fileInputRef}
                    type="file"
                    className={classes.document_fields_file_field_dropzone_hidden_input}
                    onChange={(e) => handleFileSelect(e.target.files)} 
                    />
                    <p className={classes.document_fields_file_field_dropzone_label}>or drag and drop a file</p>
                </div>)}
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
            </div>
          </div>
      </Modal>
    </Fragment>
  )
}