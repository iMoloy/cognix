import express from 'express';
import { createPaymentIntent, savePaymentSuccess, getPaymentHistory, getAllPayments } from '../controllers/payments.controller.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create payment intent
router.post('/create-intent', verifyToken, createPaymentIntent);

// Save payment success & upgrade user
router.post('/success', verifyToken, savePaymentSuccess);

// Get user payment history
router.get('/history/:email', verifyToken, getPaymentHistory);

// Admin: Get all payments
router.get('/all', verifyToken, verifyAdmin, getAllPayments);

export default router;
