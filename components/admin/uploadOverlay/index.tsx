import React from 'react';
import styles from './UploadOverlay.module.scss'; // Import your CSS module here

const UploadOverlay = ({ uploadProgress }) => {
  return (
    <div className={styles.overlay}>
      {uploadProgress !== undefined ? (
       <div className={styles.progress_overlay}>
       <div className={styles.progressBar_text}>Uploading..{uploadProgress}%</div>
       <div className={styles.progressBar_container} style={{width:'40%'}}>
         <div className={styles.progressBar} style={{width: `${uploadProgress}%`,height:'2px', background:'green'}}></div>
       </div>
     </div>
      ) : (
        <div className={styles.progress_overlay}>
        <div className={styles.loading}>Loading...</div>
        </div>
      )}
    </div>
  );
};

export default UploadOverlay;
