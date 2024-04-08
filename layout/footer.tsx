'use client'

import React from 'react';
import Link from 'next/link';
import Icon from '../components/utils/icon.util';
import css from './styles/footer.module.scss';

const Footer: React.FC = () => {
  const handleNavigation = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className={css.container}>
      <section className={css.containerWrap}>
        <div className={css.companyColumn}>
          <h3>TechHaven</h3>
         {/* */} <p> </p>
          <div className={css.socialIconsContainer}>
            <div className={css.icon}>
              <a href="mailto:contact@darklake.me" className={css.mail}>
                <Icon icon={['fas', 'envelope']} />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className={css.facebook}>
                <Icon icon={['fab', 'facebook']} />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className={css.instagram}>
                <Icon icon={['fab', 'instagram']} />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className={css.youtube}>
                <Icon icon={['fab', 'youtube']} />
              </a>
            </div>
          </div>
        </div>
        <div className={css.column}>
          <h3>Menu</h3>
          <ul>
            <li>
              <button onClick={() => handleNavigation('about')}>
                About
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('projects')}>
                Projects
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('team')}>
                Team
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('contact')}>
                Contact
              </button>
            </li>
          </ul>
        </div>
        <div className={css.column}>
          <h3>Company</h3>
          <ul>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/admin">Admin</Link>
            </li>
            <li>
              <Link href="/case-studies">Help</Link>
            </li>
            <li>
              <Link href="/impressum">Press</Link>
            </li>
          </ul>
        </div>
        <div className={css.column}>
          <h3>Legal</h3>
          <ul>
            <li>
              <Link href="/case-studies">FAQ</Link>
            </li>
            <li>
              <Link href="/case-studies">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/case-studies">Terms & Conditions</Link>
            </li>
            <li>
              <Link href="/impressum">Impressum</Link>
            </li>
          </ul>
        </div>
        <div className={css.column}>
          <h3>Resources</h3>
          <ul>
            <li>
              <Link href="/case-studies">Blog</Link>
            </li>
            <li>
              <Link href="/case-studies">Service</Link>
            </li>
            <li>
              <Link href="/case-studies">Products</Link>
            </li>
            <li>
              <Link href="/impressum">Price</Link>
            </li>
          </ul>
        </div>
      </section>
      <hr className={css.divider} />
      <div className={css.copyRight}>
        &copy; {new Date().getFullYear()} TechHaven GmbH. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
