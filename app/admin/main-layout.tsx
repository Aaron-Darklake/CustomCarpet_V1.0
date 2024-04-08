'use client'
import Sidebar from "../../layout/admin/sidebar";
import styles from '../../layout/admin/layout.module.scss'
import { useState } from "react";
import Navbar from "@/layout/admin/navbar";
import { Modal } from "@faceless-ui/modal";
import { DrawerModalCategory } from "@/components/admin/drawer/tableDrawer/drawer";
import { useMedia } from "@/providers/Media";




export default function DashboardLayout({
    children, // will be a page or nested layout
  }) {
    const [menuState, setMenuState] = useState<boolean>(true);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const toggleMenu = () => {
    setMenuState(!menuState);
    setSidebarOpen(!menuState);
  };
  const { setSelectedMedia } = useMedia();
  const handleMediaSelect = (selectedMedia) => {
    setSelectedMedia(selectedMedia)
    console.log('Selected Media:', selectedMedia);
    // Further processing with selectedMedia
  };

    return (
      <section className={styles.container}>
        
        
       
				
        <Sidebar open={sidebarOpen}/>
        <div className={styles.template}>
            <Navbar open={sidebarOpen}/>
        {children}
        </div>
      </section>
    )
  }
   {/*
   <div className={styles.toggle_wrapper} data-open={menuState}>
  <button onClick={toggleMenu} className={styles.mobileToggle} data-open={menuState}>
  <div>
				  <span></span>
				  <span></span>
				</div>
			  </button>
        </div>
*/}