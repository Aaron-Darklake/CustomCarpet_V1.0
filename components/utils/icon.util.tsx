'use client'

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library, IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core';

// Load icons into the library
library.add(fas, far, fab);

interface IconProps {
  icon?: [IconPrefix, IconName] | any[];
  className?: string | undefined;
}

const Icon: React.FC<IconProps> = ({ icon, className }) => {
  const [iconType, iconKey] = icon;
  const [stateIconType, setIconType] = useState<IconPrefix>('fas');
  const [stateIconKey, setIconKey] = useState<IconName>('circle-notch');

  useEffect(() => {
    setIconKey(iconKey);
    setIconType(iconType);
  }, [iconKey,iconType]);

  return (
    <FontAwesomeIcon icon={[stateIconType, stateIconKey]} className={className} />
  );
};

export default Icon;
