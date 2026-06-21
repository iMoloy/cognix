import Stripe from 'stripe';
import { getDatabase } from "../db/client.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

// Create Payment Intent
const createPaymentIntent = async (req, res) => {
  try {
    const { price } = req.body; // In this app, it's typically always 500 ($5)
    const amount = price || 500; 

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Intent Error:", error);
    res.status(500).json({ message: "Failed to create payment intent", error: error.message });
  }
};

// Handle Payment Success
const savePaymentSuccess = async (req, res) => {
  try {
    const { email, transactionId, amount } = req.body;
    
    if (!email || !transactionId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const db = getDatabase();
    const paymentsCollection = db.collection("payments");
    const usersCollection = db.collection("users");

    // 1. Save transaction record
    const paymentRecord = {
      email,
      transactionId,
      amount,
      date: new Date(),
      status: "succeeded"
    };
    
    await paymentsCollection.insertOne(paymentRecord);

    // 2. Upgrade User Subscription
    const updateResult = await usersCollection.updateOne(
      { email },
      { $set: { subscription: "premium" } }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: "User not found to upgrade" });
    }

    res.status(200).json({ 
      message: "Payment saved and user upgraded successfully",
      paymentId: transactionId 
    });
  } catch (error) {
    console.error("Payment Success Error:", error);
    res.status(500).json({ message: "Failed to process payment success", error: error.message });
  }
};

export { createPaymentIntent, savePaymentSuccess };
