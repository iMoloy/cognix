"use client";

import { CreditCard, ArrowUpRight, Loader2, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

export default function AllPaymentsPage() {
  const { token, user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "admin") {
        router.push("/login");
      }
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role !== "admin") {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-rose-500" />
      </div>
    );
  }

  useEffect(() => {
    const fetchAllPayments = async () => {
      if (!token || user?.role !== "admin") return;
      
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://cognix-6lqn.onrender.com";
        const res = await fetch(`${apiUrl}/api/payments/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPayments(data);
        }
      } catch (err) {
        console.error("Failed to fetch all payments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPayments();
  }, [token, user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <CreditCard size={28} className="text-cyan-400" />
          Payment Transactions
        </h1>
        <p className="mt-2 text-zinc-400">View and track all Stripe checkout transactions for Premium access.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="border-b border-white/5 bg-white/[0.02] text-[10px] sm:text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold tracking-wider">Transaction ID</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold tracking-wider">User Email</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold tracking-wider">Amount</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-bold tracking-wider">Date</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right font-bold tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center">
                    <Loader2 className="mx-auto animate-spin text-emerald-400" />
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-sm text-zinc-500">
                    No payment transactions found.
                  </td>
                </tr>
              ) : payments.map((payment) => (
                <tr key={payment._id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-4 sm:px-6 py-4 font-mono text-xs text-zinc-500">
                    {payment.transactionId || payment._id}
                  </td>
                  <td className="whitespace-nowrap px-4 sm:px-6 py-4">
                    <div className="font-bold text-white text-xs sm:text-sm">{payment.email}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 sm:px-6 py-4 font-bold text-emerald-400 text-xs sm:text-sm">
                    ${((payment.amount || 500) / 100).toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-4 sm:px-6 py-4">
                    {payment.status === "succeeded" || payment.status === "completed" ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                        Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-red-400 border border-red-500/20">
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 sm:px-6 py-4 text-xs text-zinc-500">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-4 sm:px-6 py-4 text-right">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(payment.transactionId || payment._id);
                        toast.success("Transaction ID copied!");
                      }}
                      title="Copy Transaction ID"
                      className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-xs font-bold text-zinc-400 transition-colors hover:bg-cyan-500/10 hover:text-cyan-400"
                    >
                      <Copy size={12} className="mr-1" /> Copy ID
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
