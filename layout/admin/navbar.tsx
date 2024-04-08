'use client'
import React, { useEffect, useState } from 'react';
import css from './navbar.module.scss'
import Link from 'next/link';
import Icon from '@/components/utils/icon.util';
import { usePathname, useRouter } from 'next/navigation';





const Navbar = ({open}) => {
    const router = useRouter();
    const pathname = usePathname()
    const nonRoutableRoutes = ['collections','admin'];
    const pathSegments = pathname.split('/').filter(segment => 
        segment && !nonRoutableRoutes.includes(segment)
    );

        console.log(pathSegments)
   

    return (
        <header className={css.header}>
           <div className={css.header_bg}></div>
           <div className={css.header_content}>
            <div className={css.header_wrapper}>
                <div className={css.header_controls_wraper}>
                    <div className={css.header_step_nav_wraper}>
                    <nav className={css.header_step_nav}>
                    <Link href='/admin' className={css.header_step_nav_home}>
                            <span title='Dashboard'><Icon icon={['fas', 'home']} /></span>
                    </Link>
                    {pathSegments.map((segment, index) => {
                    const isLast = index === pathSegments.length - 1;
                    const isNonRoutable = nonRoutableRoutes.includes(segment);
                    const href = `/admin/collections/${pathSegments.slice(0, index + 1).join('/')}`;

                    return (
                        <React.Fragment key={index}>
                            {index >= 0 && <span>/</span>}
                            {isLast && !isNonRoutable ? (
                                <span className={isLast ? css.header_step_nav_last : ''}>{segment}</span>
                            ) : (
                                <Link href={href}>
                                    <span>{segment}</span>
                                </Link>
                            )}
                        </React.Fragment>
                    );
                })}
                    </nav>
                    </div>
                    <div className={css.header_controls}>
                        <Link href='/admin/account' className={css.header_account}>
                        <Icon icon={['fas', 'circle-user']} />
                        </Link>
                    </div>
                </div>
            </div>
           </div>
        </header>


    )
}

export default Navbar;