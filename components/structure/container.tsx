import React, { ReactNode } from 'react';
import Spacing from '../utils/spacing.util';
import css from '../../styles/structure/container.module.scss';

interface ContainerProps {
  classProp?: string;
  spacing?: string | string[];
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ classProp = '', spacing, children }) => {
  return (
    <div className={`${css.readingWidth} ${classProp} ${Spacing(spacing ?? '')}`}>
      {children}
    </div>
  );
};

export default Container;
