'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import '../../styles/css/variables.css'
import '../../styles/css/global.css'
import "../../node_modules/the-new-css-reset/css/reset.css"
import styles from './dashboard.module.scss'
import { Gutter } from '@/components/blocks/gutter/gutter';
import Link from 'next/link';
import Icon from '@/components/utils/icon.util';
import { useAuth } from '@/providers/Auth';
import MainLayout from './main-layout';
import { UsersIcon } from '@heroicons/react/24/outline';
import { Activity, CreditCard, Euro, Users } from 'lucide-react';
import { Overview } from '@/components/blocks/Overview';
import { retrieveLastMonthRevenue } from '../actions/stripe/createCustomer';

const Dashboard = () => {
  const router = useRouter();
  const {userAttributes} = useAuth()
  const [lastMonthRevenue, setLastMonthRevenue] = useState(0);
  const [lastMonthDifference, setlastMonthDifference] = useState(0);

  function formatPrice(cents: number): string {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
  }

  useEffect(() => {
    // ... existing code ...

    const fetchLastMonthRevenue = async () => {
      try {
        const data: any = await retrieveLastMonthRevenue();
        if (data?.success) {
          setLastMonthRevenue(data.totalRevenueCurrentMonth);
          setlastMonthDifference(data.percentageDifference)
          console.log('Last month transactions:', data.transactionsCurrentMonth);
          console.log('current month revenue:', data.totalRevenueCurrentMonth);
          console.log('Last month revenue:', data.totalRevenueLastMonth);
          console.log('Last month differnece:', data.percentageDifference);
          console.log('Last month transactions:', data.transactionsLastMonth);
        } else {
          // Handle error

          console.error('Failed to fetch last month revenue:', data.message);
        }
      } catch (err) {
        console.error('Error fetching last month revenue:', err);
      }
    };

    fetchLastMonthRevenue();
  }, []);

  useEffect(() => {
    // ... existing code ...

    const fetchCustomers = async () => {
      try {
        const data: any = await retrieveLastMonthRevenue();
        if (data?.success) {
          setLastMonthRevenue(data.totalRevenueCurrentMonth);
          setlastMonthDifference(data.percentageDifference)
          console.log('Last month transactions:', data.transactionsCurrentMonth);
          console.log('current month revenue:', data.totalRevenueCurrentMonth);
          console.log('Last month revenue:', data.totalRevenueLastMonth);
          console.log('Last month differnece:', data.percentageDifference);
          console.log('Last month transactions:', data.transactionsLastMonth);
        } else {
          // Handle error

          console.error('Failed to fetch last month revenue:', data.message);
        }
      } catch (err) {
        console.error('Error fetching last month revenue:', err);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        console.log('sign in', signInDetails)
        const userAttributesFetched = await fetchUserAttributes()
        console.log('fetched',userAttributesFetched);
        const role = userAttributesFetched?.['custom:role']
        console.log(`The username: ${username}`);
        console.log(`The userId: ${userId}`);
        console.log('The signInDetails:', signInDetails);
        if(!userId || role !== 'admin'){
          router.push('/login')
        }
        if(!userId || !userAttributesFetched?.['custom:role']){
          router.push('/admin/login')
        }
      } catch (err) {
        router.push('/admin/login')
        console.log(err);
      }
    };
    checkUser();

  }, [userAttributes]);

  const collectionLinks = [
    { title: 'Pages', url: '/admin/collections/pages/create', url2:'/admin/collections/pages' },
    { title: 'Products', url: '/admin/collections/products/create', url2:'/admin/collections/products' },
    { title: 'Orders', url: '/admin/collections/orders/create', url2:'/admin/collections/orders' },
    { title: 'Media', url: '/admin/collections/media/create', url2:'/admin/collections/media' },
    { title: 'Categories', url: '/admin/collections/categories/create', url2:'/admin/collections/categories' },
    { title: 'Users', url: '/admin/collections/users/create', url2:'/admin/collections/users' },
    { title: 'Redirects', url: '/admin/collections/redirects/create', url2:'/admin/collections/redirects' },
    // Add more links as needed
  ];

  return (
<MainLayout>
    <div className={styles.dashboard}>
        <div className={styles.dashboard_row_1_wrapper}>
          
          <div className={styles.dashboard_row_1_card}>
            <div className={styles.dashboard_row_1_card_top}>
              <h3>Total Revenue</h3>
              <Euro/>
            </div>
            <div className={styles.dashboard_row_1_card_bottom}>
              <div className={styles.dashboard_row_1_card_bottom_main}>{`${formatPrice(lastMonthRevenue)}`}</div>
              <p className={styles.dashboard_row_1_card_bottom_sub}>{`${lastMonthDifference}% from last month`}</p>
            </div>
          </div>
          {/*Row 1*/}
          <div className={styles.dashboard_row_1_card}>
            <div className={styles.dashboard_row_1_card_top}>
            <h3>Customers</h3>
              <Users />
            </div>
            <div className={styles.dashboard_row_1_card_bottom}>
              <div className={styles.dashboard_row_1_card_bottom_main}>{`+2350`}</div>
              <p className={styles.dashboard_row_1_card_bottom_sub}>{`+180.1% from last month`}</p>
            </div>
          </div>

          <div className={styles.dashboard_row_1_card}>
            <div className={styles.dashboard_row_1_card_top}>
              <h3>Orders</h3>
              <CreditCard />
            </div>
            <div className={styles.dashboard_row_1_card_bottom}>
              <div className={styles.dashboard_row_1_card_bottom_main}>{`+12,234`}</div>
              <p className={styles.dashboard_row_1_card_bottom_sub}>{`+19% from last month`}</p>
            </div>
          </div>

          <div className={styles.dashboard_row_1_card}>
            <div className={styles.dashboard_row_1_card_top}>
              <h3>Active Now</h3>
              <Activity />
            </div>
            <div className={styles.dashboard_row_1_card_bottom}>
              <div className={styles.dashboard_row_1_card_bottom_main}>{`+573`}</div>
              <p className={styles.dashboard_row_1_card_bottom_sub}>{`+201 since last hour`}</p>
            </div>
          </div>

        </div>

        {/*Row 2*/}
        <div className={styles.dashboard_row_2_wrapper}>
          <div className={styles.dashboard_row_2_column_1}>
            <div className={styles.dashboard_row_2_column_1_header}>
              <h3>Overview</h3>
            </div>
            <div className={styles.dashboard_row_2_column_1_chart}>
               <Overview/>
            </div>
           
          </div>
          <div className={styles.dashboard_row_2_column_2}>
            <div className={styles.dashboard_row_2_column_2_header}>
              <h3>Recent Orders</h3>
              <p>{`You made 265 sales this month.`}</p>
            </div>
            <div className={styles.dashboard_row_2_column_2_table_wrapper}>
              <div className={styles.dashboard_row_2_column_2_table}>
              <div className={styles.dashboard_row_2_column_2_table_item_first}>
                  <div className={styles.dashboard_row_2_column_2_table_item_status}>
                    <div className={styles.dashboard_row_2_column_2_table_item_status_circle_success}></div>
                    <p>fullfilled</p>
                  </div>
                  <div className={styles.dashboard_row_2_column_2_table_item_details}>
                    <p className={styles.dashboard_row_2_column_2_table_item_details_main}>{`aaron.rennau@darklake.me`}</p>
                    <p className={styles.dashboard_row_2_column_2_table_item_details_sub}>{`id: 8e404e59-72bb-4953-a1e5-912d4599e361`}</p>
                  </div>
                  <div className={styles.dashboard_row_2_column_2_table_item_price}>
                    <p  className={styles.dashboard_row_2_column_2_table_item_price_main}>{`145.99 €`}</p>
                    <p className={styles.dashboard_row_2_column_2_table_item_price_sub}>{`qty: 2`}</p>
                  </div>
                </div>

                <div className={styles.dashboard_row_2_column_2_table_item}>
                  <div className={styles.dashboard_row_2_column_2_table_item_status}>
                    <div className={styles.dashboard_row_2_column_2_table_item_status_circle}></div>
                    <p>pending</p>
                  </div>
                  <div className={styles.dashboard_row_2_column_2_table_item_details}>
                    <p className={styles.dashboard_row_2_column_2_table_item_details_main}>{`olivia.martin@email.com`}</p>
                    <p className={styles.dashboard_row_2_column_2_table_item_details_sub}>{`id: 8e404e59-72bb-4953-a1e5-912d4599e361`}</p>
                  </div>
                  <div className={styles.dashboard_row_2_column_2_table_item_price}>
                    <p  className={styles.dashboard_row_2_column_2_table_item_price_main}>{`45.99 €`}</p>
                    <p className={styles.dashboard_row_2_column_2_table_item_price_sub}>{`qty: 1`}</p>
                  </div>
                </div>

                <div className={styles.dashboard_row_2_column_2_table_item}>
                  <div className={styles.dashboard_row_2_column_2_table_item_status}>
                    <div className={styles.dashboard_row_2_column_2_table_item_status_circle_shipped}></div>
                    <p>shipped</p>
                  </div>
                  <div className={styles.dashboard_row_2_column_2_table_item_details}>
                    <p className={styles.dashboard_row_2_column_2_table_item_details_main}>{`jackson.lee@email.com`}</p>
                    <p className={styles.dashboard_row_2_column_2_table_item_details_sub}>{`id: 8e404e59-72bb-4953-a1e5-912d4599e361`}</p>
                  </div>
                  <div className={styles.dashboard_row_2_column_2_table_item_price}>
                    <p  className={styles.dashboard_row_2_column_2_table_item_price_main}>{`405.99 €`}</p>
                    <p className={styles.dashboard_row_2_column_2_table_item_price_sub}>{`qty: 1`}</p>
                  </div>
                </div>

                <div className={styles.dashboard_row_2_column_2_table_item}>
                  <div className={styles.dashboard_row_2_column_2_table_item_status}>
                    <div className={styles.dashboard_row_2_column_2_table_item_status_circle_confirm}></div>
                    <p>confirmed</p>
                  </div>
                  <div className={styles.dashboard_row_2_column_2_table_item_details}>
                    <p className={styles.dashboard_row_2_column_2_table_item_details_main}>{`sofia.davis@email.com`}</p>
                    <p className={styles.dashboard_row_2_column_2_table_item_details_sub}>{`id: 8e404e59-72bb-4953-a1e5-912d4599e361`}</p>
                  </div>
                  <div className={styles.dashboard_row_2_column_2_table_item_price}>
                    <p  className={styles.dashboard_row_2_column_2_table_item_price_main}>{`15.99 €`}</p>
                    <p className={styles.dashboard_row_2_column_2_table_item_price_sub}>{`qty: 1`}</p>
                  </div>
                </div>

                <div className={styles.dashboard_row_2_column_2_table_item}>
                  <div className={styles.dashboard_row_2_column_2_table_item_status}>
                    <div className={styles.dashboard_row_2_column_2_table_item_status_circle_confirm}></div>
                    <p>confirmed</p>
                  </div>
                  <div className={styles.dashboard_row_2_column_2_table_item_details}>
                    <p className={styles.dashboard_row_2_column_2_table_item_details_main}>{`will@email.com`}</p>
                    <p className={styles.dashboard_row_2_column_2_table_item_details_sub}>{`id: 8e404e59-72bb-4953-a1e5-912d4599e361`}</p>
                  </div>
                  <div className={styles.dashboard_row_2_column_2_table_item_price}>
                    <p  className={styles.dashboard_row_2_column_2_table_item_price_main}>{`215.99 €`}</p>
                    <p className={styles.dashboard_row_2_column_2_table_item_price_sub}>{`qty: 1`}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
    </div>
    </MainLayout>
  );
};



export default Dashboard;


/* 

        <Gutter className={styles.dashboard_wrap}>
            <div className={styles.dashboard_title_wrap}>
                <div className={styles.dashboard_title_banner}>
                    <span className={styles.dashboard_title_banner_content}>
                       <h4> Welcome to your Dashboard!</h4>
                    </span>
                </div>
            </div>
      <div className={styles.dashboard_group}>
        <h2 className={styles.dashboard_label}>Collections</h2>
        <ul className={styles.dashboard_card_list}>
        {collectionLinks.map((link, index) => (
              <li key={index}>
                <div className={styles.dashboard_card}>
                <Link href={link.url2} >
                    <h3 className={styles.dashboard_card_title}>{link.title}</h3>
                </Link>
                <div className={styles.dashboard_card_actions}>
                    <Link href={link.url} className={styles.dashboard_card_link_button}>
                        <span className={styles.btn_content}>
                            <span className={styles.btn_icon}>
                            <Icon icon={['fas', 'add']} />
                            </span>
                        </span>
                    </Link>
                </div>
                </div>
              </li>
            ))}
        </ul>

      </div>
      </Gutter>
       */