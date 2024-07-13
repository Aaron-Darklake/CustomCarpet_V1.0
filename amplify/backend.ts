import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource.js';
import * as s3 from 'aws-cdk-lib/aws-s3';

const backend = defineBackend({
  auth,
  data: {
    ...data,
    apiKey: 'da2-ug7yud4jl5cpro5oo73ymhz2me',
  },
  storage
});




const cfnBucket =  backend.storage.resources.bucket.node.findChild('Resource') as s3.CfnBucket
cfnBucket.addPropertyOverride('CorsConfiguration', {
  CorsRules: [
    {
      AllowedOrigins: ['*'],
      AllowedMethods: ['HEAD', 'GET', 'PUT', 'POST', 'DELETE'],
      MaxAge: '3000',
      AllowedHeaders: ['*']
    }
  ]
})

const authRole = backend.auth.resources.authenticatedUserIamRole;
backend.storage.resources.bucket.grantReadWrite(authRole);
// allow any guest (unauthenticated) user to read from the bucket
const unauthRole = backend.auth.resources.unauthenticatedUserIamRole;
backend.storage.resources.bucket.grantRead(unauthRole);

// extract L1 CfnUserPool resources
const { cfnUserPool } = backend.auth.resources.cfnResources;
// use CDK's `addPropertyOverride` to modify properties directly
cfnUserPool.addPropertyOverride("Schema", [
  {
    Name: "stripeCustomerID",
    AttributeDataType: "String",
    Mutable: true,
  },
  {
    Name: "role",
    AttributeDataType: "String",
    Mutable: true,
  },
  {
    Name: "cartId",
    AttributeDataType: "String",
    Mutable: true,
  },
  {
    Name: "addressId",
    AttributeDataType: "String",
    Mutable: true,
  },
]);
