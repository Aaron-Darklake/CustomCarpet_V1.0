import React, { ReactNode } from 'react';
import Footer from "../../../layout/footer";
import Navbar from "../../../layout/navbar";
import ConfigureAmplifyClientSide from '../../../components/config/ConfigureAmplifyClientSide';
import config from '../../../amplifyconfiguration.json';
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
      <Navbar />
      <div style={{display:'flex'}}>
      {children}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
