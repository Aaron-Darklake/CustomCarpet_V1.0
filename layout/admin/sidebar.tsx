'use client'
import { useEffect, useState } from 'react';
import css from './sidebar.module.scss'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'aws-amplify/auth';
import Icon from '../../components/utils/icon.util';
import { useAuth } from '@/providers/Auth';
import { Home, LayoutDashboard, LucideArchive, LucideBarcode, LucideChevronDown, LucideHome, LucideImages, LucideListOrdered, LucideListTree, LucideLogOut, LucideNewspaper, LucideNotebookTabs, LucideReceipt, LucideReceiptText, LucideSettings, LucideUser, LucideUsers, LucideWarehouse, User } from 'lucide-react';






const Sidebar = ({open}) => {
    const pathname = usePathname()
    const router = useRouter();
    const{setUserAttributes, userAttributes}=useAuth()
    const [isCollectionMenuOpen, setIsCollectionMenuOpen] = useState(false);
    const [isPagesMenuOpen, setIsPagesMenuOpen] = useState(false);
    const [selectedPage, setSelectedPage] = useState('');
    const [isHomeOpen, setIsHomeOpen] = useState(true);
    const [isCollectionsOpen, setIsCollectionsOpen] = useState(true);

    console.log(selectedPage)

    useEffect(() => {
      // Extract the selected page from the pathname
      const page = pathname;
      setSelectedPage(page);
    }, [pathname]);




  const handleSignOut = async () => {
      try {
        await signOut();
        setUserAttributes({})
      router.push('/admin/login');
      console.log('Succesfully signed out from edit')
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  console.log(selectedPage)
  console.log('side bar open?', open)
  const sidebarClass = open ? css.sidebarOpen : css.sidebarClosed;

  const handleCollectionMenuToggle = () => {
    setIsCollectionMenuOpen(!isCollectionMenuOpen);
  }

  const handlePagesMenuToggle = () => {
    setIsPagesMenuOpen(!isPagesMenuOpen);
  }
 
  return (

   <aside className={`${css.sidebar} ${sidebarClass}`}>
    <div className={css.sidebar_header_title}>
        <span className={css.sidebar_header_title_span}>Menu</span>
    </div>
    <span className={css.sidebar_header_spacer}></span>
    <div className={css.sidebar_header_User}>
        <span className={css.sidebar_header_User_avatar}><User strokeWidth={1.5}/></span>
        <div className={css.sidebar_header_User_details}>
            <p className={css.sidebar_header_User_details_name}>{`${userAttributes?.given_name} ${userAttributes?.family_name}`}</p>
            <p className={css.sidebar_header_User_details_position}>{userAttributes?.['custom:role']}</p>
        </div>
    </div>

    <div className={css.sidebar_main_wrapper}>
        <div className={css.sidebar_main_content}>
            <nav className={css.sidebar_main_content_nav}>
                <li className={css.sidebar_main_content_nav_item_list}>
                    <span className={css.sidebar_main_content_nav_item_list_title}>Home</span>
                    <ul className={css.sidebar_main_content_nav_item_links}>

                    <Link href='/admin' className={css.sidebar_main_content_nav_item_link}>
                            <LucideHome strokeWidth={1.5}/>
                            <span className={css.sidebar__nav_group_content_label}>Dashboard</span>
                    </Link>

                    <Link href='/admin/account' className={css.sidebar_main_content_nav_item_link}>
                            <LucideUser strokeWidth={1.5}/>
                            <span className={css.sidebar__nav_group_content_label}>Account</span>
                    </Link>

                    <Link href='/admin/settings' className={css.sidebar_main_content_nav_item_link}>
                            <LucideSettings strokeWidth={1.5}/>
                            <span className={css.sidebar__nav_group_content_label}>Settings</span>
                    </Link>
                    </ul>
                </li>

                <li className={css.sidebar_main_content_nav_item_list}>
                    <span className={css.sidebar_main_content_nav_item_list_title}>CMS</span>
                    <ul className={css.sidebar_main_content_nav_item_links}>
                        <li className={css.sidebar_dropDown_button_wrapper}>
                          <span className={css.sidebar_dropDown_button_wrapper_span}>
                            <div className={css.sidebar_dropDown_button_container_wrapper}>
                                <div className={css.sidebar_dropDown_button_container}>
                              <h2 className={css.sidebar_dropDown_button_wrap}>
                                <button type='button' onClick={handleCollectionMenuToggle} className={`${css.sidebar_dropDown_button} ${isCollectionMenuOpen ? css.sidebar_dropDown_button_rotate : ''}`}>
                                    <div className={css.sidebar_dropDown_button_title_wrapper}>
                                      <span className={css.sidebar_dropDown_button_title_span}>
                                        <div className={css.sidebar_dropDown_button_title}>
                                          <LucideArchive strokeWidth={1.5}/>
                                          <span className={css.sidebar_dropDown_button_title_text}>Collections</span>
                                        </div>
                                      </span>
                                    </div>
                                    <span className={`${css.sidebar_dropDown_button_chevron} ${isCollectionMenuOpen ? css.sidebar_dropDown_button_chevron_rotate : ''}`}>
                                        <LucideChevronDown/>
                                    </span>
                                </button>
                              </h2>
                                                <section className={`${css.sidebar_dropDown_container} ${isCollectionMenuOpen ? css.sidebar_dropDown_container_open : ''}`}>
                                                    <div className={css.sidebar_dropDown_wrapper}>
                                                        <div className={css.sidebar_dropDown}>
                                                            <ul className={css.sidebar_dropDown_list}>
                                                                <Link href='/admin/collections/media' className={css.sidebar_main_content_nav_item_link}>
                                                                    <LucideImages strokeWidth={1.5} />
                                                                    <span className={css.sidebar__nav_group_content_label}>Media</span>
                                                                </Link>
                                                                <Link href='/admin/collections/categories' className={css.sidebar_main_content_nav_item_link}>
                                                                    <LucideListTree strokeWidth={1.5} />
                                                                    <span className={css.sidebar__nav_group_content_label}>Categories</span>
                                                                </Link>
                                                                <Link href='/admin/collections/products' className={css.sidebar_main_content_nav_item_link}>
                                                                    <LucideBarcode strokeWidth={1.5} />
                                                                    <span className={css.sidebar__nav_group_content_label}>Products</span>
                                                                </Link>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </section>
                                            </div>
                                        </div>
                                    </span>
                                </li>
                        <li className={css.sidebar_dropDown_button_wrapper}>
                          <span className={css.sidebar_dropDown_button_wrapper_span}>
                            <div className={css.sidebar_dropDown_button_container_wrapper}>
                                <div className={css.sidebar_dropDown_button_container}>
                              <h2 className={css.sidebar_dropDown_button_wrap}>
                                <button type='button' disabled onClick={handlePagesMenuToggle} className={`${css.sidebar_dropDown_button} ${isPagesMenuOpen ? css.sidebar_dropDown_button_rotate : ''}`}>
                                    <div className={css.sidebar_dropDown_button_title_wrapper}>
                                      <span className={css.sidebar_dropDown_button_title_span}>
                                        <div className={css.sidebar_dropDown_button_title} style={{color: 'var(--primary-dim)'}}>
                                          <LucideNewspaper strokeWidth={1.5}/>
                                          <span className={css.sidebar_dropDown_button_title_text} style={{color: 'var(--primary-dim)'}}>Pages</span>
                                        </div>
                                      </span>
                                    </div>
                                    <div className={css.comingsoon_wrapper}>
                                        <span className={css.comingsoon}>
                                            coming soon
                                        </span>
                                    </div>
                                    {/*<span className={`${css.sidebar_dropDown_button_chevron} ${isPagesMenuOpen ? css.sidebar_dropDown_button_chevron_rotate : ''}`}>
                                        <LucideChevronDown/>
                                    </span>*/}
                                </button>
                              </h2>
                                                <section className={`${css.sidebar_dropDown_container} ${isPagesMenuOpen ? css.sidebar_dropDown_container_open : ''}`}>
                                                    <div className={css.sidebar_dropDown_wrapper}>
                                                        <div className={css.sidebar_dropDown}>
                                                            <ul className={css.sidebar_dropDown_list}>
                                                                <Link href='/admin/collections/media' className={css.sidebar_main_content_nav_item_link}>
                                                                    <LucideImages strokeWidth={1.5} />
                                                                    <span className={css.sidebar__nav_group_content_label}>Media</span>
                                                                </Link>
                                                                <Link href='/admin/collections/categories' className={css.sidebar_main_content_nav_item_link}>
                                                                    <LucideListTree strokeWidth={1.5} />
                                                                    <span className={css.sidebar__nav_group_content_label}>Categories</span>
                                                                </Link>
                                                                <Link href='/admin/collections/products' className={css.sidebar_main_content_nav_item_link}>
                                                                    <LucideBarcode strokeWidth={1.5} />
                                                                    <span className={css.sidebar__nav_group_content_label}>Products</span>
                                                                </Link>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </section>
                                            </div>
                                        </div>
                                    </span>
                                </li>
                            </ul>
                        </li>

                    <li className={css.sidebar_main_content_nav_item_list}>
                    <span className={css.sidebar_main_content_nav_item_list_title}>Backoffice</span>
                    <ul className={css.sidebar_main_content_nav_item_links}>

                    <button type='button' disabled className={css.sidebar_dropDown_button} style={{padding:'6px 8px', height:'44px', fontSize:'14px', letterSpacing:'-.025em', gap:'8px', fontWeight:'400'}}>
                            <LucideUsers strokeWidth={1.5} style={{width: '20px',height:'20px', marginLeft:'4px', color: 'var(--primary-dim)'}}/>
                            <span className={css.sidebar__nav_group_content_label} style={{color: 'var(--primary-dim)'}}>Customers</span>
                            <div className={css.comingsoon_wrapper} style={{marginRight: '0px'}}>
                                        <span className={css.comingsoon} >
                                            coming soon
                                        </span>
                                    </div>
                    </button>

                    <Link href='/admin/orders' className={css.sidebar_main_content_nav_item_link}>
                            <LucideReceiptText strokeWidth={1.5}/>
                            <span className={css.sidebar__nav_group_content_label}>Orders</span>
                    </Link>

                    <button type='button' disabled className={css.sidebar_dropDown_button} style={{padding:'6px 8px', height:'44px', fontSize:'14px', letterSpacing:'-.025em', gap:'8px', fontWeight:'400'}}>
                            <LucideWarehouse strokeWidth={1.5} style={{width: '20px',height:'20px', marginLeft:'4px', color: 'var(--primary-dim)'}}/>
                            <span className={css.sidebar__nav_group_content_label} style={{color: 'var(--primary-dim)'}}>Inventory</span>
                            <div className={css.comingsoon_wrapper} style={{marginRight: '0px'}}>
                                        <span className={css.comingsoon} >
                                            coming soon
                                        </span>
                                    </div>
                    </button>
                    </ul>
                </li>
                    </nav>
                </div>
            </div>
            <span className={css.sidebar_bottom_spacer}></span>
            <div className={css.sidebar_bottom_wrapper}>
                <button className={css.sidebar_bottom_button}>
                    <LucideLogOut strokeWidth={1.5}/>
                    Log out
                </button>
            </div>



            
        </aside>

    );
};



export default Sidebar;