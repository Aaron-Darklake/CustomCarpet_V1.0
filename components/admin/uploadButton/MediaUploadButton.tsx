import React from 'react';
import styles from './MediaUploadButton.module.scss';
import Image from 'next/image';
import Icon from '@/components/utils/icon.util';



interface MediaUploadButtonsProps {
  onUploadNewMedia: () => void;
  onChooseExistingMedia: () => void;
  onRemoveMedia?: (mediaId: string) => void;
  label:string;
  selectedMedia?: any[] | any;
  multipleSelect?: boolean;
}

const MediaUploadButtons: React.FC<MediaUploadButtonsProps> = ({ onUploadNewMedia, onChooseExistingMedia, label, selectedMedia, onRemoveMedia, multipleSelect=false }) => {
  console.log(selectedMedia);
  console.log(multipleSelect);
  return (
    <>
    <div style={{marginBottom: '5px', marginTop:'25px', position: 'relative', fontSize: '13px', lineHeight:'25px'}}>
    <div>{label}</div>
  </div>
  <div style={{marginBottom: '10px', position: 'relative', overflowY: multipleSelect ? 'auto' : 'hidden', maxHeight: multipleSelect ? '200px' : 'none'}}>
    {multipleSelect===true && selectedMedia && selectedMedia.length > 0 && (
         selectedMedia?.map(media => (
      <div className={styles.fileDetails}>
            <header>
                <div className={styles.document_fields_file_field_thumbnail_medium}>
                  <Image src={media?.blobUrl} alt={media?.alt || 'alt'} width={media?.width} height={media?.height} priority />
                </div>

              <div  className={styles.document_fields_file_field_details}>
                <div className={styles.document_fields_file_field_details_meta}>
                  <div className={styles.document_fields_file_field_details_meta_url}>
                    <a href={media?.blobUrl } target='_blank' rel='noreferrer'>{media?.blobUrl}</a>
                    <button className={styles.document_fields_file_field_details_meta_btn}>
                      <Icon icon={['fas', 'copy']} />
                    </button>
                    <button className={styles.document_fields_file_field_details_meta_btn}>
                      <Icon icon={['fas', 'edit']} />
                    </button>
                  </div>
                  <div className={styles.document_fields_file_field_details_meta_size_type}>
                    {`${(media?.fileSize / 1000000).toFixed(1)}MB - ${media?.width}x${media?.height} - ${media?.mimeType}`}
                  </div>
                </div>
              </div>
              <button type='button' className={styles.document_fields_file_field_remove} onClick={()=> onRemoveMedia(media.id)}>
                <span className={styles.document_fields_file_field_remove_content}>
                  <span className={styles.document_fields_file_field_remove_icon}>
                    <Icon icon={['fas', 'remove']} />
                  </span>
                </span>
              </button>


            </header>
    </div>)))}
    {selectedMedia && multipleSelect===false  ? (
    <div className={styles.fileDetails}>
            <header>

                <div className={styles.document_fields_file_field_thumbnail_medium}>
                  <Image src={selectedMedia?.blobUrl} alt={selectedMedia?.alt || 'alt'} width={selectedMedia?.width} height={selectedMedia?.height} priority />
                </div>

              <div  className={styles.document_fields_file_field_details}>
                <div className={styles.document_fields_file_field_details_meta}>
                  <div className={styles.document_fields_file_field_details_meta_url}>
                    <a href={selectedMedia?.blobUrl } target='_blank' rel='noreferrer'>{selectedMedia?.blobUrl}</a>
                    <button className={styles.document_fields_file_field_details_meta_btn}>
                      <Icon icon={['fas', 'copy']} />
                    </button>
                    <button className={styles.document_fields_file_field_details_meta_btn}>
                      <Icon icon={['fas', 'edit']} />
                    </button>
                  </div>
                  <div className={styles.document_fields_file_field_details_meta_size_type}>
                    {`${(selectedMedia?.fileSize / 1000000).toFixed(1)}MB - ${selectedMedia?.width}x${selectedMedia?.height} - ${selectedMedia?.mimeType}`}
                  </div>
                </div>
              </div>
              <button type='button' className={styles.document_fields_file_field_remove} onClick={()=> onRemoveMedia(selectedMedia.id)}>
                <span className={styles.document_fields_file_field_remove_content}>
                  <span className={styles.document_fields_file_field_remove_icon}>
                    <Icon icon={['fas', 'remove']} />
                  </span>
                </span>
              </button>


            </header>
    </div>
    ):(
    <div className={styles.field_type_image} style={{ marginBottom: '0px' }}>
      <div className={styles.field_type_image_wrap}>
        <div className={styles.field_type_image_upload_buttons}>
          <button type='button' className={styles.field_type_image_upload_btn} onClick={onUploadNewMedia}>
            <div className={styles.field_type_image_upload_btn_style}>
              <span className={styles.field_type_image_upload_btn_content}>Upload new Media</span>
            </div>
          </button>
          <button type='button' className={styles.field_type_image_upload_btn} onClick={onChooseExistingMedia}>
            <div className={styles.field_type_image_upload_btn_style}>
              <span className={styles.field_type_image_upload_btn_content}>Choose existing Media</span>
            </div>
          </button>
        </div>
      </div>
    </div>)}
    </div>
    </>
  );
};

export default MediaUploadButtons;
