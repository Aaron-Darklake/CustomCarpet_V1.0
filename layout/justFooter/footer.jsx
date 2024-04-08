import { useState, useEffect } from 'react'
import Link from 'next/link'



import css from '../../styles/structure/footer.module.scss'
import Icon from '../../components/utils/icon.util';


export default function Footer() {
	
	const handleNavigation = (id) => {
		const element = document.getElementById(id);
		element.scrollIntoView({ behavior: "smooth" });
	  };
	
	return (
		<footer className={css.container}>
			
      <section className={css.containerWrap}>
        <div className={css.companyColumn}>
          <h3>Administrata Dresden GmbH</h3>
         {/* <p>Digital Solutions d.o.o.</p>*/}
		  <div className={css.companyDetails}>
		  <Icon  icon={['fas', 'location-dot']} />
		  <div className={css.companyAdress}>
          <p>Gutschmidstraße 9</p>
          <p>01097 Dresden</p>
          <p>Germany</p>
		  </div>
		  </div>
        </div>
        <div className={css.column}>
          <h3>Menu Links</h3>
          <ul>
            <li>
			<button	onClick={() => handleNavigation('about')} >
				About
			</button>
            </li>
            <li>
			<button	onClick={() => handleNavigation('projects')} >
				Projects
			</button>
            </li>
            <li>
			<button	onClick={() => handleNavigation('technical')} >
				Technical Stack
			</button>
            </li>
            <li>
			<button	onClick={() => handleNavigation('contact')} >
				Contact
			</button>
            </li>
          </ul>
        </div>
        <div className={css.column}>
          <h3>Company Links</h3>
          <ul>
            <li>
              <Link href="/case-studies">FAQ</Link>
            </li>
            <li>
              <Link href="/case-studies">Privacy Police</Link>
            </li>
            <li>
              <Link href="/case-studies">Terms & Condictions</Link>
            </li>
            <li>
              <Link href="/impressum">Impressum</Link>
            </li>
          </ul>
        </div>
        <div className={css.column}>
          <h3>Kontakt</h3>
          <div className={css.companyMail}>
		  <Icon  icon={['fas', 'envelope']} />
          <p>kontakt@administrata-gmbh.de</p>
		  </div>
          <div className={css.companyMail}>
		  <Icon  icon={['fas', 'phone']} />
          <p>{`0351-80 320 64 (Festnetz)`}</p>
		  </div>
          <div className={css.companyMail}>
		  <Icon  icon={['fas', 'fax']} />
          <p>{`0351-80 320 69 (Fax)`}</p>
		  </div>
        </div>
      </section>
      <hr className={css.divider} />
      <div className={css.copyRight}>
        &copy; {new Date().getFullYear()} Administrata Dresden GmbH. All rights reserved.
		
      </div>
	  
	  <canvas id='gradient-canvas' className={''} data-transition-in></canvas>	
    </footer>
	
  );
};