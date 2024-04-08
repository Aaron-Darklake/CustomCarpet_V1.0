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

const steps = [{name:'Shipping Information',href:'/checkout'}, {name:'Shipping Methode',href:'/checkout/shipping'},  {name:'Payment',href:'/checkout/payment'}, {name:'Review',href:'/checkout/review'}];


const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  
  return (
    <div>
      <ConfigureAmplifyClientSide/>
      <Navbar />
      <div style={{display:'flex', flexDirection:'column', justifyContent:'center', minHeight:'100vh'}}>
      <Stepper steps={steps} />
      {children}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
