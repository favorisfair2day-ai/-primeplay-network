const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    try {
        const { tier, userId, email } = JSON.parse(event.body);
        const priceMap = {
            plus: 'price_plus_monthly',
            premium: 'price_premium_monthly',
        };
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceMap[tier],
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.URL}/pricing`,
            customer_email: email,
            metadata: {
                userId,
                tier,
            },
        });
        return { statusCode: 200, body: JSON.stringify({ sessionId: session.id }), };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }), };
    }
};