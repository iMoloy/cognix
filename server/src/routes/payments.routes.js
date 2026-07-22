import express from 'express';
import { 
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
} from '../controllers/payments.controller.js';
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

// --- Creator Payout System Routes ---

// Save / update creator payout method
router.post('/payout-method', verifyToken, savePayoutMethod);

// Get creator payout method
router.get('/payout-method', verifyToken, getPayoutMethod);

// Request a payout
router.post('/request-payout', verifyToken, requestPayout);

// Get my payout requests history
router.get('/my-payout-requests', verifyToken, getMyPayoutRequests);

// Admin: Get all payout requests
router.get('/payout-requests', verifyToken, verifyAdmin, getAllPayoutRequests);

// Admin: Update payout request status
router.patch('/payout-requests/:id', verifyToken, verifyAdmin, updatePayoutRequestStatus);

export default router;
