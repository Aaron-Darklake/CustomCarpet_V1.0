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
import dataClientPrivate from '@/components/config/data-server-client-private';



const CreateMedia = () => {
  const router = useRouter();
   // State to track if files are attached
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

   const { showMessage } = useNotification();

   // New state for title
  const [metaTitle, setMetaTitle] = useState(''); // New state for title
  const [metaDescription, setMetaDescription] = useState(''); // New state for description

   
 



  const handleAltChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAlt(event.target.value);
  };

  const handleMetaTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMetaTitle(event.target.value);
  };

  const handleMetaDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMetaDescription(event.target.value);
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
    
          console.log("Media created:", newMedia);
          showMessage("Media was uploaded to databse successfully!");
          setTimeout(() => setShowSnackBar(false), 3000);

          router.push('/admin/collections/media')
    
          // Additional actions after successful upload and database entry
          // like resetting form, showing success message, etc.
        } catch (error) {
          console.error("Error in file upload or media creation:", error);
        }
      };


      console.log('height',imageHeight)
    console.log('width', imageWidth)
    console.log('image name',fileName)
      


  return (
    <main className={styles.collection_edit}>
      {uploadProgress > 0 && uploadProgress < 100  && (
        <UploadOverlay uploadProgress={uploadProgress}/>
      )}
      <form className={styles.collection_edit_form} onSubmit={handleSubmit}>
        <Gutter className={styles.collection_edit_form_header}>
          <h1 className={styles.collection_edit_form_header_h1}>
            {`${alt || '[Untitled]'}`}
          </h1>
        </Gutter>
        <div className={styles.collection_edit_form_controls}>
          <div className={styles.collection_edit_form_controls_wrapper}>
            <div className={styles.collection_edit_form_controls_content}>
              <ul className={styles.collection_edit_form_controls_meta}>
                <li className={styles.collection_edit_form_controls_meta_list}>
                  <p className={styles.collection_edit_form_controls_content_value}>Creating new Media</p>
                </li>
              </ul>
            </div>
            <div className={styles.collection_edit_form_controls_controls_wrapper}>
              <div className={styles.collection_edit_form_controls_controls}>
                <div className={styles.collection_edit_form_submit}>
                    <button type='submit' className={styles.collection_edit_form_submit_btn}>
                      <span className={styles.collection_edit_form_submit_btn_content}>
                        <span className={styles.collection_edit_form_submit_btn_label}>Save Media</span>
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
           
            <div className={styles.document_fields_file_field}>
                <div className={styles.document_fields_file_field_upload}>
                    {filesAttached && file !== null ? (
                    <>
                    <div className={styles.document_fields_file_field_thumbnail}>
                        <div className={styles.document_fields_file_field_thumbnail_medium}>
                            <Image src={URL.createObjectURL(file)} alt="Thumbnail" layout='fill' />
                        </div>
                    </div>
                    <div className={styles.document_fields_file_adjustment}>
                        <input
                        type='text'
                        value={fileName} // Display the file name in the input field
                        onChange={(e) => setFileName(e.target.value)}
                        className={styles.document_fields_file_fileName}
                        />
                        <div className={styles.document_fields_file_mutation}>
                            <button type='button' className={styles.document_fields_file_mutation_btn}>Edit Image</button>
                        </div>
                    </div>
                    <button type='button' className={styles.document_fields_file_field_remove}>
                        <span className={styles.document_fields_file_field_remove_content}>
                            <span className={styles.document_fields_file_field_remove_icon}>
                            <Icon icon={['fas', 'remove']} />
                            </span>
                        </span>
                    </button>
                    </>
                    ):(
                <div ref={dropRef}
                  className={`${styles.document_fields_file_field_dropzone} ${isFileDraggingOver ? styles.dropZoneHovered : ''}`}
                  
                 >
                    <button  onClick={handleButtonClick} type='button' className={styles.document_fields_file_field_dropzone_file_btn}>
                        <span className={styles.document_fields_file_field_dropzone_file_btn_content}>
                            <span className={styles.document_fields_file_field_dropzone_file_btn_label}>Select a file</span>
                        </span>
                    </button>
                    <input 
                    ref={fileInputRef}
                    type="file"
                    className={styles.document_fields_file_field_dropzone_hidden_input}
                    onChange={(e) => handleFileSelect(e.target.files)} 
                    />
                    <p className={styles.document_fields_file_field_dropzone_label}>or drag and drop a file</p>
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
    
  );
};



export default CreateMedia;