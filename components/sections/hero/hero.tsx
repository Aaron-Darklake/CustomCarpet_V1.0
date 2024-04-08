import React from 'react';
import hero from './hero.module.scss';


const Hero: React.FC = () => {
  return (
    <section className={hero.hero}>
    <div className={hero.heroWrapper} style={{ backgroundImage:'url(/hero/hero-1.png)' }}>
        <div className={hero.heroTextBox}>
          <h2 className={hero.heroTitle}>Tech Haven.</h2>
          <p className={hero.heroSubtitle}>Technical Online-Shop</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
