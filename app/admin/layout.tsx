import React, { ReactNode } from 'react';
import ConfigureAmplifyClientSide from '@/components/config/ConfigureAmplifyClientSide';
import config from '@/amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';


Amplify.configure(config, {
  ssr: true
});

interface MainLayoutProps {
  children: ReactNode;
}



const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  
  return (
    <div>
      <ConfigureAmplifyClientSide/>
      {children}
    </div>
  );
};

export default MainLayout;
