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

// Get Payment History
const getPaymentHistory = async (req, res) => {
  try {
    const { email } = req.params;
    
    // Verify that the requested email matches the logged-in user's email
    if (req.decoded.email !== email) {
      return res.status(403).json({ message: "Forbidden access to other user's data" });
    }

    const db = getDatabase();
    const paymentsCollection = db.collection("payments");

    const payments = await paymentsCollection.find({ email }).sort({ date: -1 }).toArray();

    res.status(200).json(payments);
  } catch (error) {
    console.error("Fetch Payment History Error:", error);
    res.status(500).json({ message: "Failed to fetch payment history", error: error.message });
  }
};

// Admin: Get All Payments
const getAllPayments = async (req, res) => {
  try {
    const db = getDatabase();
    const paymentsCollection = db.collection("payments");

    const payments = await paymentsCollection.find().sort({ date: -1 }).toArray();

    res.status(200).json(payments);
  } catch (error) {
    console.error("Fetch All Payments Error:", error);
    res.status(500).json({ message: "Failed to fetch all payments", error: error.message });
  }
};

// --- CREATOR PAYOUT SYSTEM ---

// Save / Update Payout Method
const savePayoutMethod = async (req, res) => {
  try {
    const email = req.decoded.email;
    const { method, details } = req.body;

    if (!method || !details) {
      return res.status(400).json({ message: "Method and details are required." });
    }

    const db = getDatabase();
    const usersCollection = db.collection("users");

    await usersCollection.updateOne(
      { email },
      { $set: { payoutMethod: { method, details, updatedAt: new Date() } } }
    );

    res.status(200).json({ message: "Payout method updated successfully", payoutMethod: { method, details } });
  } catch (error) {
    console.error("Save Payout Method Error:", error);
    res.status(500).json({ message: "Failed to save payout method", error: error.message });
  }
};

// Get Payout Method
const getPayoutMethod = async (req, res) => {
  try {
    const email = req.decoded.email;
    const db = getDatabase();
    const user = await db.collection("users").findOne({ email });

    res.status(200).json({ payoutMethod: user?.payoutMethod || null });
  } catch (error) {
    console.error("Get Payout Method Error:", error);
    res.status(500).json({ message: "Failed to fetch payout method", error: error.message });
  }
};

// Request Payout
const requestPayout = async (req, res) => {
  try {
    const email = req.decoded.email;
    const userName = req.decoded.name || "Creator";
    const { amount, method, details } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid payout amount." });
    }

    const db = getDatabase();
    const payoutsCollection = db.collection("payout_requests");

    // Check if there is already a pending request
    const existingPending = await payoutsCollection.findOne({ email, status: "pending" });
    if (existingPending) {
      return res.status(400).json({ message: "You already have a pending payout request." });
    }

    const payoutDoc = {
      email,
      userName,
      amount: parseFloat(amount),
      method,
      details,
      status: "pending",
      createdAt: new Date()
    };

    const result = await payoutsCollection.insertOne(payoutDoc);

    res.status(201).json({ message: "Payout request submitted successfully!", requestId: result.insertedId });
  } catch (error) {
    console.error("Request Payout Error:", error);
    res.status(500).json({ message: "Failed to request payout", error: error.message });
  }
};

// Get Creator's Payout Requests
const getMyPayoutRequests = async (req, res) => {
  try {
    const email = req.decoded.email;
    const db = getDatabase();
    const requests = await db.collection("payout_requests").find({ email }).sort({ createdAt: -1 }).toArray();

    res.status(200).json(requests);
  } catch (error) {
    console.error("Get My Payout Requests Error:", error);
    res.status(500).json({ message: "Failed to fetch payout requests", error: error.message });
  }
};

// Admin: Get All Payout Requests
const getAllPayoutRequests = async (req, res) => {
  try {
    const db = getDatabase();
    const requests = await db.collection("payout_requests").find().sort({ createdAt: -1 }).toArray();

    res.status(200).json(requests);
  } catch (error) {
    console.error("Get All Payout Requests Error:", error);
    res.status(500).json({ message: "Failed to fetch all payout requests", error: error.message });
  }
};

// Admin: Update Payout Request Status (Paid / Rejected)
const updatePayoutRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    if (!["paid", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const db = getDatabase();
    const ObjectId = (await import("mongodb")).ObjectId;

    await db.collection("payout_requests").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, adminNote: adminNote || "", processedAt: new Date() } }
    );

    res.status(200).json({ message: `Payout request marked as ${status}` });
  } catch (error) {
    console.error("Update Payout Request Error:", error);
    res.status(500).json({ message: "Failed to update payout request", error: error.message });
  }
};

export { 
  createPaymentIntent, 
  savePaymentSuccess, 
  getPaymentHistory, 
  getAllPayments,
  savePayoutMethod,
  getPayoutMethod,
  requestPayout,
  getMyPayoutRequests,
  getAllPayoutRequests,
  updatePayoutRequestStatus
};
