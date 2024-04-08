
import EditMediaModal from '@/components/admin/editPages/media';
import config from '../../../../../amplifyconfiguration.json';
import { Amplify } from 'aws-amplify'
Amplify.configure(config, {
  ssr: true
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'




const EditMedia =  ({ params }: { params: { id: string } }) => {
  const { id } = params;

 


  return (
   <div>
    <EditMediaModal mediaId={id}/>
   </div>
    
  );
};



export default EditMedia;