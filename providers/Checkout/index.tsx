// CheckoutContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ShippingInformation {
  mail: string;
  phone?: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  country: {code:string,country:string};
  company?: string;
}
interface BillingInformation {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  country: {code:string,country:string};
  company?: string;
}

interface ShippingMethode{
    methode: string
}
interface PaymentMethodData {
    type: string; // e.g., "card", "paypal"
    details: any; // Detailed payment method information
  }

  interface ReviewData{
    summary: any
  }

interface CheckoutStepData {
  shippingInformation?: ShippingInformation;
  billingInformation?: BillingInformation | 'isSame';
  shippingMethod?: ShippingMethode;
  paymentMethod?: PaymentMethodData;
  reviewSummary?: ReviewData;
  // Add other step data types here
}

interface ICheckoutContext {
    currentStep: number;
    shippingMethod: ShippingMethode;
    completedSteps: CheckoutStepData[];
    goToStep: (step: number) => void;
    completeStep: (step: number, data?: CheckoutStepData) => void;
    updateShippingMethod: (method: string) => void;
    paymentIntentClientSecret: string;
    handlePaymentIntentClientSecret: (clientSecret: string) => void;
    paymentMethod: PaymentMethodData;
    handlePaymentMethod: (paymentMethodData: PaymentMethodData) => void;
    resetCheckout: () => void;
}

const initialContext: ICheckoutContext = {
  currentStep: 0,
  completedSteps: [],
  shippingMethod: { methode: '' },
  goToStep: () => {},
  completeStep: () => {},
  updateShippingMethod: () => {},
  paymentIntentClientSecret: '',
  handlePaymentIntentClientSecret: () => {},
  paymentMethod: { type: '', details: null },
  handlePaymentMethod: () => {},
  resetCheckout: () => {},
};

const CheckoutContext = createContext<ICheckoutContext>(initialContext);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<CheckoutStepData[]>([]);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethode>({ methode: '' });
  const [paymentIntentClientSecret, setPaymentIntentClientSecret] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodData>({ type: '', details: null });

  const resetCheckout = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setShippingMethod({ methode: '' });
    setPaymentIntentClientSecret('');
    setPaymentMethod({ type: '', details: null });
  };

  const handlePaymentIntentClientSecret = (clientSecret: string) => {
    setPaymentIntentClientSecret(clientSecret);
  }

  const handlePaymentMethod = (paymentMethodData: PaymentMethodData) => {
    setPaymentMethod(paymentMethodData);
    setCompletedSteps(prev => {
      const updatedSteps = [...prev];
      // Assuming the payment method is stored in a specific step (e.g., step 3)
      const currentPaymentData = updatedSteps[2]?.paymentMethod || {};
      updatedSteps[2] = {
        ...updatedSteps[2],
        paymentMethod: { ...currentPaymentData, ...paymentMethodData }
      };
      return updatedSteps;
    });
  };



  const updateShippingMethod = (method: string) => {
    const newShippingMethod = { methode: method };
    setShippingMethod(newShippingMethod);
    setCompletedSteps(prev => {
        const updatedSteps = [...prev];
        // Assuming the shipping method is stored in a specific step (e.g., step 2)
        const currentShippingData = updatedSteps[1]?.shippingMethod || {};
        updatedSteps[1] = {
          ...updatedSteps[1],
          shippingMethod: { ...currentShippingData, methode: method }
        };
        return updatedSteps;
      });
  };
  


  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const completeStep = (step: number, data: CheckoutStepData) => {
    setCompletedSteps(prev => {
      const updatedSteps = [...prev];
      updatedSteps[step] = data;
      return updatedSteps;
    });
  };

  return (
    <CheckoutContext.Provider value={{ currentStep, completedSteps, goToStep, completeStep, updateShippingMethod, shippingMethod, paymentIntentClientSecret, handlePaymentIntentClientSecret, paymentMethod, handlePaymentMethod, resetCheckout }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
