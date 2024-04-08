'use server'
import dotenv from 'dotenv';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';


dotenv.config();

const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY, { apiVersion: '2022-08-01' });

export async function createCustomer({email,name})  {
console.log('email:',email)
console.log('name:',name)

    try {
      // Extract user details from request body
      // Create a Stripe customer
      const customer = await stripe.customers.create({ email: email,
        name: name });
      // Return the customer ID
      return { success: true, message: 'Message sent', stripeCustomerId: customer.id };
    } catch (error) {
      // Handle errors
      return { success: false, message: 'Error sending message' };
    }
  
}

// ... existing imports and setup ...

export async function createStripeProductWithPrice({ title, description, unitAmount }) {
  try {
    // Create the product
    const product = await stripe.products.create({
      name: title,
      description: description,
      // Add more product-specific details if needed
    });

    // Create the price for the product
    const price = await stripe.prices.create({
      unit_amount: unitAmount, // Price in cents
      currency: 'eur',
      product: product.id,
    });

    return { success: true, stripeProductId: product.id, stripePriceId: price.id, priceJson: price};
  } catch (error) {
    console.error("Error creating Stripe product or price:", error);
    return { success: false, message: 'Error creating Stripe product or price' };
  }
}

export async function deleteStripeProductAndPrice(stripeProductId, stripePriceId) {
  try {
    await stripe.prices.update(stripePriceId, { active: false });
    await stripe.products.update(stripeProductId, { active: false });

    return { success: true, message: 'Stripe product and price deleted successfully' };
  } catch (error) {
    console.error("Error deleting Stripe product or price:", error);
    return { success: false, message: 'Error deleting Stripe product or price' };
  }
}




function convertToCents(price) {
  // Remove the currency symbol (€) and any spaces
  let numericPrice = price.toString().replace(/€|\s/g, '');

  // Replace the dot with an empty string (to remove thousand separators)
  numericPrice = numericPrice.replace(/\./g, '');

  // Replace the comma with a dot (to handle decimal numbers correctly)
  numericPrice = numericPrice.replace(/,/g, '.');

  // Parse the string as a float and multiply by 100 to convert to cents
  const priceInCents = parseFloat(numericPrice) * 100;

  // Return the price as an integer
  return Math.round(priceInCents);
}

export async function updateStripeProductPrice({ stripeProductId, newUnitAmount }) {
  try {
    // Create a new price for the existing product
    const unitAmount = convertToCents(newUnitAmount);
    const newPrice = await stripe.prices.create({
      unit_amount: unitAmount, // New price in cents
      currency: 'eur',
      product: stripeProductId,
    });

    // Optional: Deactivate the old price if you don't want it to be used anymore
    // const oldPriceId = ... // You need to know the ID of the old price
    // await stripe.prices.update(oldPriceId, { active: false });

    return { success: true, stripePriceId: newPrice.id, priceJson: newPrice };
  } catch (error) {
    console.error("Error updating Stripe product price:", error);
    return { success: false, message: 'Error updating Stripe product price' };
  }
}
export async function getAttachedPaymentMethods({ customer }) {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer,
      type: 'card',
    });

    return paymentMethods.data;
  } catch (error) {
    console.error("Error updating Stripe product price:", error);
    return { success: false, message: 'Error recieving payment methods' };
  }
}


// ... existing imports and setup ...

export async function updatePaymentIntent({ paymentIntentId, shipping, billing }) {
  try {
    // Update the payment intent with new details
    const updatedPaymentIntent = await stripe.paymentIntents.update(
      paymentIntentId,
      {
        shipping: shipping ? {
          name: `${shipping.firstName} ${shipping.lastName}`,
          address: {
            line1: shipping.address,
            city: shipping.city,
            postal_code: shipping.zip,
            country: 'DE',
          },
        } : undefined,
        metadata: billing ? {
          billingInfo: JSON.stringify(billing),
        } : undefined,
        // Include any other fields you want to update
      }
    );

    return { 
      success: true, 
      paymentIntentId: updatedPaymentIntent.id, 
      clientSecret: updatedPaymentIntent.client_secret 
    };
  } catch (error) {
    console.error("Error updating payment intent:", error);
    return { success: false, message: 'Error updating payment intent' };
  }
}

// Function to retrieve the payment method from a payment intent
export async function getPaymentMethodFromIntent(paymentIntentId) {
  console.log('paymentintent',paymentIntentId)
  try {
    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(`${paymentIntentId}`);
    console.log('paymentintent', paymentIntent)
    if (paymentIntent && paymentIntent.payment_method) {
      // Retrieve the payment method details
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);

      return {
        success: true,
        paymentMethod: {
          type: paymentMethod.type,
          details: paymentMethod.id, // Retrieves the details specific to the payment method type
          // You can include additional details you need to display
        },
      };
    } else {
      return { success: false, message: 'Payment intent or payment method not found' };
    }
  } catch (error) {
    console.error("Error retrieving payment method from intent:",);
    return { success: false, message: 'Error retrieving payment method from intent' };
  }
}

// ... other functions ...

export async function summarizePayment({paymentMethodId, amount, customerId}) {
  console.log('paymentMethodId',paymentMethodId)
  console.log('ammount', amount)
  try {
    const paymentMethod = await stripe.paymentMethods.attach(
      paymentMethodId,
      {
        customer: customerId,
      }
    );
    // List and cancel existing payment intents for this customer
   
    let details;
    if (paymentMethodId ) {
      const intent = await stripe.paymentIntents.create({
        payment_method: paymentMethodId,
        customer: customerId,
        setup_future_usage: 'off_session', // Set to 'off_session' to save the card details for later use
        amount: amount,
        currency: 'eur',
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {enabled: true},
        expand: ['payment_method'] 
      });
      details = intent;
    }
    return {
      success: true,
      paymentIntentId: details.id, 
      clientSecret: details.client_secret,
      paymentMethod: {
        details: details.payment_method, // Retrieves the details specific to the payment method type
      },
    };
  } catch (e) {
    console.error("Error retrieving payment method from intent:",e);
    return { success: false, message: 'Error retrieving payment method from intent' };
  }
}


export async function summarizePaymentAttached({paymentMethodId, amount, customerId}) {
  console.log('paymentMethodId',paymentMethodId)
  console.log('ammount', amount)
  try {
    let details;
    if (paymentMethodId ) {
      const intent = await stripe.paymentIntents.create({
        payment_method: paymentMethodId,
        customer: customerId,
        amount: amount,
        currency: 'eur',
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {enabled: true},
        expand: ['payment_method'] 
      });
      details = intent;
    }
    return {
      success: true,
      paymentIntentId: details.id, 
      clientSecret: details.client_secret,
      paymentMethod: {
        details: details.payment_method, // Retrieves the details specific to the payment method type
      },
    };
  } catch (e) {
    console.error("Error retrieving payment method from intent:",e);
    return { success: false, message: 'Error retrieving payment method from intent' };
  }
}

// ... other functions ...
export async function deletePaymentIntent(paymentIntentId) {
  const paymentIntentIdFormatted = paymentIntentId.split('_secret_')[0];
  console.log('paymentIntentIdFormatted', paymentIntentIdFormatted)
  try {
    // Cancel the payment intent
    await stripe.paymentIntents.cancel(paymentIntentIdFormatted);
    return { success: true, message: 'Payment intent deleted successfully' };
  } catch (error) {
    console.error("Error deleting payment intent:", error);
    return { success: false, message: 'Error deleting payment intent' };
  }
}


async function fetchAllTransactions(startDate, endDate) {
  let allTransactions = [];
  let hasMore = true;
  let startingAfter = null;

  while (hasMore) {
    const params = {
      created: {
        gte:startDate, // Convert to UNIX timestamp
        lte: endDate,   // Convert to UNIX timestamp
      },
      limit: 100
    };

    // Only add 'starting_after' if it's not null
    if (startingAfter) {
      params.starting_after = startingAfter;
    }

    const response = await stripe.balanceTransactions.list(params);

    allTransactions.push(...response.data);
    hasMore = response.has_more;

    if (hasMore) {
      startingAfter = response.data[response.data.length -1].id;
    }
  }

  return allTransactions;
}

function toUnixTimestamp(date) {
 // Offset in hours converted to milliseconds
 const offsetInMillis = -1 * 60 * 60 * 1000;

 // Apply offset and convert to UNIX timestamp
 return Math.floor((date.getTime() + offsetInMillis) / 1000);}

export async function retrieveLastMonthRevenue() {
  try {
    // Define the start and end of the previous month
    function addOneHourOffset(date) {
      return new Date(date.getTime() + (1 * 60 * 60 * 1000)); // Adds 1 hour in milliseconds
    }
    function addTwoHourOffset(date) {
      return new Date(date.getTime() + (2 * 60 * 60 * 1000)); // Adds 1 hour in milliseconds
    }
    
    const now = new Date();
    const current = addTwoHourOffset(new Date());
    const firstDayCurrMonth = addTwoHourOffset(new Date(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const lastDayPrevMonth = addOneHourOffset(new Date(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const firstDayPrevMonth = addOneHourOffset(new Date(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    
    console.log('firstDayPrevMonth', firstDayPrevMonth)
    console.log('lastDayPrevMonth', lastDayPrevMonth)
    console.log('firstDayCurrMonth', firstDayCurrMonth)
    console.log('now', now)
    console.log('current', current)

    // Convert dates to UNIX timestamps
    const startTimestampLastMonth = toUnixTimestamp(firstDayPrevMonth);
    const endTimestampLastMonth = toUnixTimestamp(lastDayPrevMonth);
    const startTimestampCurrMonth = toUnixTimestamp(firstDayCurrMonth);
    const endTimestampCurrMonth = toUnixTimestamp(current);
    console.log('startTimestampLastMonth', startTimestampLastMonth)
    console.log('endTimestampLastMonth', endTimestampLastMonth)


    // Fetch balance transactions for the last month
    const lastMonthTransactions = await fetchAllTransactions(
      startTimestampLastMonth, 
      endTimestampLastMonth
    );

    // Calculate total revenue for the last month
    const totalRevenueLastMonth = lastMonthTransactions.reduce((sum, transaction) => {
      return sum + transaction.net;
    }, 0);
    
    console.log('firstDayPrevMonth', firstDayPrevMonth)
    console.log('lastDayPrevMonth', lastDayPrevMonth)
    console.log('firstDayCurrMonth', firstDayCurrMonth)
    console.log('now', now)

    const currentMonthTransactions = await fetchAllTransactions(
      startTimestampCurrMonth,
      endTimestampCurrMonth
    )

const currentBalance = await stripe.balance.retrieve();
console.log('currentBalance', currentBalance)

// Sum the amounts from the transactions for the current month
const currentMonthRevenue = currentMonthTransactions.reduce((sum, transaction) => {
  return sum + transaction.net;
}, 0);

let percentageDifference = 0;
if (totalRevenueLastMonth !== 0) {
  percentageDifference = ((currentMonthRevenue - totalRevenueLastMonth) / totalRevenueLastMonth) * 100;
}

    return {
      success: true,
  totalRevenueLastMonth: totalRevenueLastMonth, // Last month's revenue
  totalRevenueCurrentMonth: currentMonthRevenue, // Current month's revenue
  percentageDifference: (percentageDifference).toFixed(1), // Percentage difference
  transactionsLastMonth: lastMonthTransactions,
  transactionsCurrentMonth: currentMonthTransactions.data,
    };
  } catch (error) {
    console.error("Error retrieving revenue for the last month:", error);
    return { success: false, message: 'Error retrieving revenue for the last month' };
  }
}
// ... other functions ...

