import EditCategoriesModal from '@/components/admin/editPages/categories';
import config from '../../../../../amplifyconfiguration.json';
import { Amplify } from 'aws-amplify'
Amplify.configure(config, {
  ssr: true
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'




const EditCategories =  ({ params }: { params: { id: string } }) => {
  const { id } = params;

 


  return (
   <div>
    <EditCategoriesModal categorieId={id}/>
   </div>
    
  );
};



export default EditCategories;