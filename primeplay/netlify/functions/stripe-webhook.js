const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  let eventData;

  try {
    eventData = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_ENDPOINT_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  switch (eventData.type) {
    case 'checkout.session.completed':
      const session = eventData.data.object;
      // Handle the checkout.session.completed event
      console.log('Checkout session completed:', session);
      break;
    case 'customer.subscription.deleted':
      const subscription = eventData.data.object;
      // Handle the customer.subscription.deleted event
      console.log('Subscription deleted:', subscription);
      break;
    default:
      console.log(`Unhandled event type ${eventData.type}`);
  }

  return { statusCode: 200, body: 'Webhook received' };
};