import express from 'express';
import { createPaymentIntent, savePaymentSuccess } from '../controllers/payments.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create payment intent
router.post('/create-intent', verifyToken, createPaymentIntent);

// Save payment success & upgrade user
router.post('/success', verifyToken, savePaymentSuccess);

export default router;
