import React, { ReactNode } from 'react';
import sections from '../../styles/structure/section.module.scss';

interface SectionProps {
  classProp?: string;
  children: ReactNode;
}

const Section: React.FC<SectionProps> = ({ classProp = '', children }) => {
  return (
    <section className={`${sections.default} ${classProp}`}>
      {children}
    </section>
  );
};

export default Section;
