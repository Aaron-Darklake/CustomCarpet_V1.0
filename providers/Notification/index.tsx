import { createContext, useContext, useState, ReactNode } from 'react';
import styles from './notification.module.scss';
import { set } from 'react-hook-form';

interface INotificationContext {
  message: string;
  showMessage: (msg: string) => void;
}

const initialContext = {
  message: '',
  subMessage: '',
  showMessage: () => {},
};

const NotificationContext = createContext<INotificationContext>(initialContext);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  const showMessage = (msg: string) => {
    setMessage(msg);
    // Automatically hide after 3 seconds
    setIsVisible(true); // Show snackbar
    setTimeout(() => {
      setIsVisible(false); // Start slide down animation
      setTimeout(() => setMessage(''), 500); // Clear message after animation
    }, 4000);
  };


  return (
    <NotificationContext.Provider value={{ message, showMessage}}>
      {children}
      {message && <div  className={`${styles.snackbar} ${isVisible ? '' : styles.snackbar_slyde_down}`}>
        <div className={styles.snackbar_content}>
          <span className={styles.snackbar_content_title}>{message}</span>
        </div>
      </div>} {/* Notification bar */}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
