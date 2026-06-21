"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import Button from "@/components/ui/Button";
import { ShieldCheck, Lock } from "lucide-react";

export default function CheckoutForm({ onSuccess, isProcessing, setIsProcessing }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
    } else {
      setErrorMessage("An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-1">
        <PaymentElement 
          options={{ 
            layout: "tabs",
            theme: "night",
            variables: {
              colorPrimary: '#10b981',
              colorBackground: '#09090b',
              colorText: '#f4f4f5',
              colorDanger: '#ef4444',
              fontFamily: 'inherit',
              borderRadius: '12px',
            }
          }} 
        />
      </div>
      
      {errorMessage && (
        <div className="text-sm font-medium text-rose-500 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
          {errorMessage}
        </div>
      )}

      <div className="pt-4">
        <Button 
          fullWidth 
          type="submit"
          disabled={!stripe || isProcessing}
          isLoading={isProcessing}
        >
          <ShieldCheck size={18} className="mr-2" />
          {isProcessing ? "Processing..." : "Pay $5.00"}
        </Button>
        <p className="mt-4 text-center text-xs font-medium text-zinc-500 flex items-center justify-center gap-1.5">
          <Lock size={10} /> Payments are secure and encrypted by Stripe.
        </p>
      </div>
    </form>
  );
}
