'use server'


import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import { priceFromJSON } from "@/components/blocks/Price";

dotenv.config();



export async function sendEmail({ name, email, subject, message }) {
   
  

  
    // Implement your logic here to send the email using Nodemailer
    try {
      // Create a Nodemailer transporter using your email service provider's settings
        const transporter = nodemailer.createTransport({
            host: "smtps.udag.de",
            port: 587,
            secure: false,
            auth: {
              user: process.env.REACT_APP_MAIL,
              pass: process.env.REACT_APP_MAIL_PASSWORD,
            },
          });

  
          const [info, confirmationInfo] = await Promise.all([
            transporter.sendMail({
              from: 'contact@darklake.me', // sender address
              to: 'info@darklake.me', // list of receivers
              subject: `${subject} - ${email}`, // Subject line
              html: `
                    <div style="background: linear-gradient(to bottom, #4B4E6D, #2B2D42); padding: 10px;">
                    <h1 style="color: #7a7f9d; font-size: 36px; margin-bottom: 15px; text-align: left;">Darklake.</h1>
                <p style="color: #fff; font-size: 18px; margin-bottom: 5px; text-align: left;">A new support message was sent by mail Adress: ${email}.</p>
                <p style="color: #fff; font-size: 18px; margin-bottom: 40px; text-align: left;">The message from the customer: "${message}" </p>
                </div>
                  `
            }), 
            transporter.sendMail({
              from: 'contact@darklake.me', // sender address
              to: email, // list of receivers
              subject: 'Thank you for your message', // Subject line
              text: 'We have received your message and will get back to you as soon as possible.'+ // plain text body
                    `Your message sent to us: ${message}`, // plain text body
              html: `
                    <div style="background: linear-gradient(to bottom, #4B4E6D, #2B2D42); padding: 10px;">
                    <h1 style="color: #7a7f9d; font-size: 36px; margin-bottom: 15px; text-align: left;">Darklake.</h1>
                    <h1 style="color: #fff; font-size: 28px; margin-bottom: 30px; text-align: center;">Thank you for getting in Touch with us!</h1>
                <p style="color: #fff; font-size: 16px; margin-bottom: 5px; text-align: left;">We have received your message and will get back to you as soon as possible.</p>
                <p style="color: #fff; font-size: 16px; margin-bottom: 40px; text-align: left;">Your message sent to us: "${message}"</p>
                </div>
                  `
            })
          ]);
      
          console.log(`Message sent: ${info.messageId}`);
          console.log(`Confirmation message sent: ${confirmationInfo.messageId}`);
          return { success: true, message: 'Message sent' };
        } catch (error) {
          console.error(error);
          return { success: false, message: 'Error sending message' };
        }
  };

  
  
export  async function sendOrderConfirmEmail(orderDetails) {
  const {
    name,
    email,
    products,
    shippingAddress,
    billingAddress,
    paymentMethod,
    orderDate,
    deliveryMethod,
    totalPrice,
    subtotal,
    shippingCost,
    orderId,
  } = orderDetails;

 
 

  // Implement your logic here to send the email using Nodemailer
  try {
    // Create a Nodemailer transporter using your email service provider's settings
    const transporter = nodemailer.createTransport({
      host: "smtps.udag.de",
      port: 587,
      secure: false,
      auth: {
        user: process.env.REACT_APP_MAIL_SUPPORT,
        pass: process.env.REACT_APP_MAIL_SUPPORT_PASSWORD,
      },
    });

    console.log('orderDetails', orderDetails)
    console.log('products', products[0].productPrice)
    const billingAddressContent = typeof billingAddress === 'string'
  ? 'Billing- and delivery address are the same.'
  : `
    <p style="margin: 0;">${billingAddress.name}</p>
    <p style="margin: 0;">${billingAddress.street}</p>
    <p style="margin: 0;">${billingAddress.city}-${billingAddress.zip}</p>
    <p style="margin: 0;">${billingAddress.country}</p>
  `;

  const emailHtmlContentForOwner = `
  <body style="min-width:100%;Margin:0px;padding:0px;background-color:#242424; display: flex; align-items: center">
  <div style="background-color:#F8F8F8; margin: auto; margin-top: 10px; margin-bottom: 10px; border-radius: 8px;">
<div style="font-family: Arial, sans-serif;color:#333;width:100%;max-width:700px;margin:0 auto;padding:20px;box-sizing:border-box;">


  <!-- Header -->
  <div style=" padding: 20px 10px; text-align: left;">
      <h1 style="font-size: 32px; margin: 0; color: #333333; font-weight: bold;">ThechHaven.</h1>
    </div>
    <div style="padding: 0 10px; text-align: center;">
    <p style="font-size: 20px; font-weight: bold; color: #333333; margin-top: 10px;"> New Order Received!</p>
  </div>

  <!-- Order Details -->
  <div padding:20px;">
    <div style="max-width:600px;margin:0 auto;">
      <p style="font-size:14px;color:#555;">Order ID: ${orderId}</p>
      <p style="font-size:14px;color:#555;">Order placed on: ${orderDate}</p>
      <p style="font-size:14px;color:#555;">Customer: ${name} (${email})</p>
    </div>
  </div>

  <!-- Summary Section -->
  <div style="width:100%; display: flex; flex-direction:column; align-items: start;" >
  <h2 style="font-size: 28px; line-height: 29px; font-weight: 600;">Summary</h2>
  <div style="width:100%; border-bottom: 1px solid #e2e2e2"></>
  </div>
<table style="width: 100%; border-collapse: collapse;">
  ${products.map(product => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #cccccc;">
        <img src="${product.metaImage}" alt="${product.product.title}" style="vertical-align: middle; width: 50px; height: auto; margin-right: 10px;">
        
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #cccccc; text-align: right;">
      <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; min-width: 100px;">
      <h6 style="line-height: 20px; margin-bottom: 8px; font-size: 16px; font-weight: bold; color: #2e2e2e">${product.product.title}</h6>
      <p style="color: #707070; margin-top: 16px">Quantity: ${product.quantity}</p>
     </div>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #cccccc; text-align: right; font-size: 14px;">${product.productPrice}</td>
    </tr>
  `).join('')}
</table>
<table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
<tr>
  <td style=" padding: 20px 10px; text-align: left; font-size: 14px; color: #707070;">Subtotal</td>
  <td style=" padding: 20px 10px; text-align: right; font-size: 14px; color: #707070;">${subtotal}</td>
</tr>
<tr>
  <td style="padding: 10px; text-align: left; font-size: 14px; color: #707070;">Shipping</td>
  <td style="padding: 10px; text-align: right; font-size: 14px; color: #707070;">${shippingCost/100} €</td>
</tr>
<tr>
  <td style="padding: 10px; text-align: left; font-size: 14px; color: #707070;">Taxes</td>
  <td style="padding: 10px; text-align: right; font-size: 14px; color: #707070;">0.00 €</td>
</tr>
<tr>
  <td style="border-top: 1px solid #cccccc; border-bottom: 1px solid #cccccc; padding: 20px 10px; text-align: left; font-size: 16px; font-weight: 600;">Total</td>
  <td style="border-top: 1px solid #cccccc; border-bottom: 1px solid #cccccc; padding: 20px 10px; text-align: right; font-size: 18px;"><strong>${totalPrice}</strong></td>
</tr>
</table>

<!-- Shipping section -->
 
  
<div style=" font-family: 'Helvetica Neue', Arial, sans-serif; width: 100%; max-width: 600px; margin: auto">
<!-- Outer container to match the width with the rest of the content -->
<div style="max-width: 600px; margin: 20px auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-radius: 8px; padding:10px 20px">
  <!-- Shipping and Payment Information Table -->
  <table style="width: 100%; border-collapse: collapse;">
<tr>
  <td style="padding: 20px;">
    <h4 style="margin-bottom: 5px; vertical-align: top; font-size: 16px">Delivery Address</h4>
    <p style="margin: 0;">${shippingAddress.name}</p>
    <p style="margin: 0;">${shippingAddress.street}</p>
    <p style="margin: 0;">${shippingAddress.city}-${shippingAddress.zip}</p>
    <p style="margin: 0;">${shippingAddress.country}</p>
  </td>
  <td style="padding: 20px;  vertical-align: top;">
    <h4 style="margin-bottom: 5px; font-size: 16px">Billing Address</h4>
    ${billingAddressContent}
  </td>
</tr>
<tr>
  <td style="padding: 20px; vertical-align: top;">
    <h4 style="margin-bottom: 5px; font-size: 16px">Delivery Method</h4>
    <p style="margin: 0;">${deliveryMethod}</p>
  </td>
  <td style="padding: 20px; vertical-align: top;">
    <h4 style="margin-bottom: 5px; font-size: 16px">Payment Method</h4>
    <p style="margin: 0; text-transform: uppercase">${paymentMethod.card.brand}-${paymentMethod.type}</p>
  </td>
</tr>
</table>
</div>
</div>


<!-- Footer section -->
<div style=" color: #000000; width: 100%; margin: auto; margin-top: 25px; text-align: center; font-family: 'Helvetica Neue', Arial, sans-serif;">
<p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">TechHaven. by Darklake</p>
<!-- Social Media Icons -->
<p style="margin: 0;">Marka Radovica 7A, 81000-Podgorica, Montenegro</p>
<!-- Footer Links -->
</div>

</div>
</body>
  `;

  const emailTextContent= `
  ThechHaven.
  ------------------------------------------------------------
  
  Thank you for your order!
  
  Your order is confirmed! Review your order information below.We'll drop you another email when your order ships.
  Checked
  
  Ordered on:
  ${orderDate}
  Ready to ship
  
  Ready to ship
  Delivery
  
  Expected delivery:
  3-5 days
  
  
  ** Summary
  ------------------------------------------------------------
  >
  ${products.map(product => `
  ${product.product.title}
  
  ${product.product.title}
  
  Quantity: ${product.quantity}
  ${product.productPrice}
  `).join('')}
  Subtotal ${subtotal}
  Shipping ${shippingCost/100} €
  Taxes    0.00 €
  Total    ${totalPrice}
  
  
  ** Delivery Address
  ------------------------------------------------------------
  
  ${shippingAddress.name}
  
  ${shippingAddress.street}
  
  ${shippingAddress.city}-${shippingAddress.zip}
  
  ${shippingAddress.country}
  
  
  ** Billing Address
  ------------------------------------------------------------
  ${billingAddressContent}
  
  
  ** Delivery Method
  ------------------------------------------------------------
  
  ${deliveryMethod}
  
  
  ** Payment Method
  ------------------------------------------------------------
  
  ${paymentMethod.card.brand}-${paymentMethod.type}
  
  TechHaven. by Darklake
  https://twitter.com/ https://facebook.com/ https://youtube.com/ https://instagram.com/
  
  Marka Radovica 7A, 81000-Podgorica, Montenegro`

    const emailHtmlContent = `
    <body style="min-width:100%;Margin:0px;padding:0px;background-color:#242424; display: flex; align-items: center">
    <div style="background-color:#F8F8F8; margin: auto; margin-top: 10px; margin-bottom: 10px; border-radius: 8px;">
    <div style="font-family: Arial, sans-serif; color: #333333; width: 100%; max-width: 700px; margin: 0 auto; padding: 20px; box-sizing: border-box;">
    <!-- Header -->
    <div style=" padding: 20px 10px; text-align: left;">
      <h1 style="font-size: 32px; margin: 0; color: #333333; font-weight: bold;">ThechHaven.</h1>
    </div>
    <div style="padding: 0 10px; text-align: center;">
    <p style="font-size: 20px; font-weight: bold; color: #333333; margin-top: 10px;">Thank you for your order!</p>
    <p style="font-size: 13px; font-weight: normal; color: #333333; margin-top: 10px;">Your order is confirmed! Review your order information below.We'll drop you another email when your order ships.</p>
  </div>
  
    <!-- Order Status -->

    <div padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; display: flex; justify-content: center;">
        <div style="display: inline-block; padding: 10px; ">
        <div style="box-shadow: 0 4px 8px rgba(0,0,0,0.1); background-color: #000000; width: 150px; height: 100px; border-radius: 10px; padding: 10px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 5px; text-align: center">
            <img src="https://ad096103-da25-4a38-abc6-761d3cce0839.b-cdn.net/e/be184e5c-e229-44a8-a3eb-8231f01854b1/c0cc9bff-f0d4-4b21-9e2d-219b5b63db5b.png" alt="Checked" style="width: 24px; height: 24px;">
            <p style="margin: 0; color: #FFFFFF; font-size: 9px;">Ordered on:<br>${orderDate}</p>
            </div>
           
        </div>
        <div style="display: inline-block; padding: 10px;  ">
        <div style="box-shadow: 0 4px 8px rgba(0,0,0,0.1); background-color: #D9D7D7; width: 150px; height: 100px; border-radius: 10px; padding: 10px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 9px; text-align: center">
            <img src="https://ad096103-da25-4a38-abc6-761d3cce0839.b-cdn.net/e/be184e5c-e229-44a8-a3eb-8231f01854b1/fde8cd89-70ac-4ca5-a640-43002bb8fbe9.png" alt="Ready to ship" style="width: 24px; height: 24px;">
            <p style="margin: 0; color: #787878; font-size: 9px;">Ready to ship</p>
            </div>
            
        </div>
        <div style="display: inline-block; padding: 10px;  ">
        <div style="box-shadow: 0 4px 8px rgba(0,0,0,0.1); background-color: #D9D7D7; width: 150px; height: 100px; border-radius: 10px; padding: 10px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 5px; text-align: center">
            <img src="https://ad096103-da25-4a38-abc6-761d3cce0839.b-cdn.net/e/be184e5c-e229-44a8-a3eb-8231f01854b1/fde8cd89-70ac-4ca5-a640-43002bb8fbe9.png" alt="Delivery" style="width: 24px; height: 24px;">
            <p style="margin: 0; color: #787878; font-size: 9px;">Expected delivery:<br>3-5 days</p>
            </div>
            
        </div>
    </div>
</div>


    <!-- Summary Section -->
    <div style="width:100%; display: flex; flex-direction:column; align-items: start;" >
    <h2 style="font-size: 28px; line-height: 29px; font-weight: 600;">Summary</h2>
    <div style="width:100%; border-bottom: 1px solid #e2e2e2"></>
    </div>
  <table style="width: 100%; border-collapse: collapse;">
    ${products.map(product => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #cccccc;">
          <img src="${product.metaImage}" alt="${product.product.title}" style="vertical-align: middle; width: 50px; height: auto; margin-right: 10px;">
          
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #cccccc; text-align: right;">
        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; min-width: 100px;">
        <h6 style="line-height: 20px; margin-bottom: 8px; font-size: 16px; font-weight: bold; color: #2e2e2e">${product.product.title}</h6>
        <p style="color: #707070; margin-top: 16px">Quantity: ${product.quantity}</p>
       </div>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #cccccc; text-align: right; font-size: 14px;">${product.productPrice}</td>
      </tr>
    `).join('')}
  </table>
  <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
  <tr>
    <td style=" padding: 20px 10px; text-align: left; font-size: 14px; color: #707070;">Subtotal</td>
    <td style=" padding: 20px 10px; text-align: right; font-size: 14px; color: #707070;">${subtotal}</td>
  </tr>
  <tr>
    <td style="padding: 10px; text-align: left; font-size: 14px; color: #707070;">Shipping</td>
    <td style="padding: 10px; text-align: right; font-size: 14px; color: #707070;">${shippingCost/100} €</td>
  </tr>
  <tr>
    <td style="padding: 10px; text-align: left; font-size: 14px; color: #707070;">Taxes</td>
    <td style="padding: 10px; text-align: right; font-size: 14px; color: #707070;">0.00 €</td>
  </tr>
  <tr>
    <td style="border-top: 1px solid #cccccc; border-bottom: 1px solid #cccccc; padding: 20px 10px; text-align: left; font-size: 16px; font-weight: 600;">Total</td>
    <td style="border-top: 1px solid #cccccc; border-bottom: 1px solid #cccccc; padding: 20px 10px; text-align: right; font-size: 18px;"><strong>${totalPrice}</strong></td>
  </tr>
</table>



    <!-- Shipping section -->
 
  
    <div style=" font-family: 'Helvetica Neue', Arial, sans-serif; width: 100%; max-width: 600px; margin: auto">
    <!-- Outer container to match the width with the rest of the content -->
    <div style="max-width: 600px; margin: 20px auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-radius: 8px; padding:10px 20px">
      <!-- Shipping and Payment Information Table -->
      <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 20px;">
        <h4 style="margin-bottom: 5px; vertical-align: top; font-size: 16px">Delivery Address</h4>
        <p style="margin: 0;">${shippingAddress.name}</p>
        <p style="margin: 0;">${shippingAddress.street}</p>
        <p style="margin: 0;">${shippingAddress.city}-${shippingAddress.zip}</p>
        <p style="margin: 0;">${shippingAddress.country}</p>
      </td>
      <td style="padding: 20px;  vertical-align: top;">
        <h4 style="margin-bottom: 5px; font-size: 16px">Billing Address</h4>
        ${billingAddressContent}
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; vertical-align: top;">
        <h4 style="margin-bottom: 5px; font-size: 16px">Delivery Method</h4>
        <p style="margin: 0;">${deliveryMethod}</p>
      </td>
      <td style="padding: 20px; vertical-align: top;">
        <h4 style="margin-bottom: 5px; font-size: 16px">Payment Method</h4>
        <p style="margin: 0; text-transform: uppercase">${paymentMethod.card.brand}-${paymentMethod.type}</p>
      </td>
    </tr>
  </table>
</div>
</div>


<!-- Footer section -->
<div style=" color: #000000; width: 100%; margin: auto; margin-top: 25px; text-align: center; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">TechHaven. by Darklake</p>
  <!-- Social Media Icons -->
  <div style="margin-bottom: 20px;">
    <!-- Replace # with the actual URLs to your social media profiles -->
    <a href="https://twitter.com/" style="text-decoration: none; margin: 0 10px;"><img src="https://ad096103-da25-4a38-abc6-761d3cce0839.b-cdn.net/e/be184e5c-e229-44a8-a3eb-8231f01854b1/919f3d6f-98e7-4226-a9ee-512a9cec3a54.png" alt="Twitter" style="width: 24px; height: 24px;"></a>
    <a href="https://facebook.com/" style="text-decoration: none; margin: 0 10px;"><img src="https://ad096103-da25-4a38-abc6-761d3cce0839.b-cdn.net/e/be184e5c-e229-44a8-a3eb-8231f01854b1/4bf2d76e-44e1-40ad-8e42-9a17fefcdd38.png" alt="Facebook" style="width: 24px; height: 24px;"></a>
    <a href="https://youtube.com/" style="text-decoration: none; margin: 0 10px;"><img src="https://ad096103-da25-4a38-abc6-761d3cce0839.b-cdn.net/e/be184e5c-e229-44a8-a3eb-8231f01854b1/205c6954-f50b-435c-abd8-f40423cfaa7f.png" alt="YouTube" style="width: 24px; height: 24px;"></a>
    <a href="https://instagram.com/" style="text-decoration: none; margin: 0 10px;"><img src="https://ad096103-da25-4a38-abc6-761d3cce0839.b-cdn.net/e/be184e5c-e229-44a8-a3eb-8231f01854b1/e0a67ae0-8093-4bbf-9c11-89e1082d81c5.png" alt="Instagram" style="width: 24px; height: 24px;"></a>
  </div>
  <p style="margin: 0;">Marka Radovica 7A, 81000-Podgorica, Montenegro</p>
  <!-- Footer Links -->
</div>

</div>
</body>
    `;

    const [info, confirmationInfo] = await Promise.all([
      transporter.sendMail({
        from: "support@darklake.me", // sender address
        to: "info@darklake.me", // list of receivers
        subject: `TechHaven. | New Order | [id: ${orderId}]`, // Subject line
        html: emailHtmlContentForOwner,
      }),
      transporter.sendMail({
        from: "support@darklake.me", // sender address
        to: email, // list of receivers
        subject: `TechHaven. | Order Confirmation | [id: ${orderId}]`, // Subject line
        text: emailTextContent, // plain text body
        html: emailHtmlContent,
      }),
    ]);

    console.log(`Message sent: ${info.messageId}`);
    console.log(`Confirmation message sent: ${confirmationInfo.messageId}`);
    return { success: true, message: "Message sent" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error sending message" };
  }
};


  