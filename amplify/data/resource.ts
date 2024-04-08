import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rules below
specify that owners, authenticated via your Auth resource can "create",
"read", "update", and "delete" their own records. Public users,
authenticated via an API key, can only "read" records.
=========================================================================*/
const schema = a.schema({


  

  Order: a
  .model({
    stripePaymentIntentID: a.string(),
    paymentStatus: a.string(),
    total: a.float(),
    subTotal: a.float(),
    tax: a.float(),
    shippingCost: a.float(),
    shippingStatus: a.string(),
    shippingId: a.string(),
    shippingFirstName: a.string(),
    shippingLastName: a.string(),
    shippingCompany: a.string(),
    shippingAddress1: a.string(),
    shippingCity: a.string(),
    shippingZip: a.string(),
    shippingCountry: a.string(),
    shippingCountryCode: a.string(),
    billingSame: a.boolean().default(true),
    billingFirstName: a.string(),
    billingLastName: a.string(),
    billingCompany: a.string(),
    billingAddress1: a.string(),
    billingCity: a.string(),
    billingZip: a.string(),
    billingCountry: a.string(),
    billingCountryCode: a.string(),
    orderStatus: a.string(),
    shippingMethod: a.string(),
    orderItems: a.string().array(),
  })
  .authorization([a.allow.owner(),a.allow.specificGroup('Admin')]),


  Product: a.model({
    title: a.string(),
    description: a.string(),
    slug: a.string(),
    images: a.string().array(),
    categories: a.string().array(),
    relatedProducts: a.string().array(),
    priceJSON: a.string(),
    stripeProductID: a.string(),
    stripePriceID: a.string(),
  })
  .authorization([a.allow.owner(), a.allow.public().to(['read']),a.allow.specificGroup('Admin')]),
  


    Media: a.model({
      fileName: a.string(),
      alt: a.string(),
      url: a.string(),
      fileSize: a.float(),
      mimeType: a.string(),
      height: a.float(),
      width: a.float(),
    })
    .authorization([a.allow.owner(), a.allow.public().to(['read']),a.allow.specificGroup('Admin')]),

    Category: a.model({
      title: a.string(),
    })
    .authorization([a.allow.owner(), a.allow.public().to(['read']),a.allow.specificGroup('Admin')]),

    Address: a.model({
      firstName: a.string(),
      lastName: a.string(),
      company: a.string(),
      address1: a.string(),
      city: a.string(),
      zip: a.string(),
      country: a.string(),
      countryCode: a.string(), 
    })
    .authorization([a.allow.owner(),a.allow.specificGroup('Admin')]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
