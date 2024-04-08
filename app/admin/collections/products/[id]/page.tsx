

import EditProductModal from '@/components/admin/editPages/products';
import config from '../../../../../amplifyconfiguration.json';
import { Amplify } from 'aws-amplify'
Amplify.configure(config, {
  ssr: true
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'




const EditProduct =  ({ params }: { params: { id: string } }) => {
  const { id } = params;

 


  return (
   <div>
    <EditProductModal productId={id}/>
   </div>
    
  );
};



export default EditProduct;