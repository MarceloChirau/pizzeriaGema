const stripe=require('stripe')(process.env.STRIPE_SECRET)
const Cart=require('./cartModel.js')


exports.getCheckoutSession=async(req,res,next)=>{
    try{
//1)get the current user's cart
const userId=req.user.id;

const cart=await Cart.findOne({user:userId});

if(!cart)return next(new Error("There is nothing in cart,please add something in shopping cart"));
const lineItems=cart.items.map(item => ({
    price_data: {
        currency: 'eur',
        product_data: {
            name: item.name,
            description: `Size: ${item.size}`,
        },
        // Stripe expects amounts in CENTS (e.g., 10.00 EUR = 1000)
        unit_amount: item.price * 100, 
    },
    quantity: item.quantity,
}));

//2)create checkout session
const session=await stripe.checkout.sessions.create({
    payment_method_types:['card'], // we can add more payments
    customer_email:req.user.email, //we get this through the protect controller

      client_reference_id:userId,
      line_items:lineItems,
      mode:'payment',
      success_url:`${req.protocol}://${req.get('host')}/success.html`,//our homepage
    cancel_url:`${req.protocol}://${req.get('host')}/cart.html`,


})


//3)create session as response
res.status(200).json({
    status:'success',
    session
})

    }
    catch(err){
        next(err);
    }
}


exports.webhookCheckout = async (req, res) => {
    const signature = req.headers['stripe-signature'];
    let event;

    try {
        // Stripe verifies that this message actually came from them
        event = stripe.webhooks.constructEvent(
            req.body, 
            signature, 
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the specific event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // The session contains the client_reference_id (User ID)
        // This is how we know WHOSE cart to delete!
        await Cart.findOneAndDelete({ user: session.client_reference_id });
        
        console.log('Cart cleared for user:', session.client_reference_id);
    }

    // You MUST send a 200 response to Stripe so they stop retrying
    res.status(200).json({ received: true });
};