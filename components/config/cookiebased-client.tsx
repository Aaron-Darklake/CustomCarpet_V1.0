import type { Schema } from '../../amplify/data/resource'; // Path to your backend resource definition
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import amplifyConfig from '../../amplifyconfiguration.json'
import { cookies } from 'next/headers'

const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config: amplifyConfig,
  cookies
})

export default cookieBasedClient;
