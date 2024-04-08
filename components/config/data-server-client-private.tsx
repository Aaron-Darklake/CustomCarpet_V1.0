import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource'; // Path to your backend resource definition

const dataClientPrivate = generateClient<Schema>({
    authMode: 'userPool'
});

export default dataClientPrivate;