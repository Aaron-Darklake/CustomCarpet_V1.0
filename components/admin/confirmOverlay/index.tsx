import React from 'react';
import styles from './UploadOverlay.module.scss'; // Import your CSS module here

interface UploadOverlayProps {
  selectedAmmount?
  onConfirm: () => void;
  onCancel: () => void;
}

const UploadOverlay: React.FC<UploadOverlayProps> = ({ onConfirm, onCancel, selectedAmmount=1 }) => {
  return (
 
   
    <div className={styles.overlay}>
       <div className={styles.delete_confirmation}>
        <h1>Confirm deletion</h1>
          <p>You are about to delete {selectedAmmount} Items</p>
          <div className={styles.delete_buttons}>
            <button type='button'onClick={()=>onCancel()} className={styles.cancel_button}>Cancel</button>
            <button onClick={onConfirm} className={styles.confirm_button} style={{background:'var(--primary)', color:'var(--background)'}}>Confirm</button>
          </div>
        </div>
      </div>
  
  );
};

export default UploadOverlay;
