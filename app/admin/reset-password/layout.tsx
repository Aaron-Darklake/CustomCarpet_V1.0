import React, { ReactNode } from 'react';
import Footer from "../../../layout/footer";
import Navbar from "../../../layout/navbar";
import ConfigureAmplifyClientSide from '../../../components/config/ConfigureAmplifyClientSide';
import config from '../../../amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import Stepper from '@/components/blocks/Stepmenu';


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
      <div style={{display:'flex', flexDirection:'column', justifyContent:'center', minHeight:'100vh'}}>
      {children}
      </div>
    </div>
  );
};

export default MainLayout;
