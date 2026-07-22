"use client";

import { CreditCard, ArrowUpRight, Loader2, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

export default function AllPaymentsPage() {
  const { token, user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [payments, setPayments] = useState([]);
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "admin") {
        router.push("/login");
      }
    }
  }, [user, authLoading, router]);

  const fetchPayoutData = async () => {
    if (!user || user?.role !== "admin") return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://cognix-6lqn.onrender.com";
      const [paymentsRes, payoutsRes] = await Promise.all([
        fetch(`${apiUrl}/api/payments/all`, { credentials: "include" }),
        fetch(`${apiUrl}/api/payments/payout-requests`, { credentials: "include" })
      ]);

      if (paymentsRes.ok) {
        const data = await paymentsRes.json();
        setPayments(data);
      }
      if (payoutsRes.ok) {
        const payoutData = await payoutsRes.json();
        setPayoutRequests(payoutData);
      }
    } catch (err) {
      console.error("Failed to fetch payments/payouts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayoutData();
  }, [user]);

  const handleUpdateStatus = async (id, status) => {
    setProcessingId(id);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://cognix-6lqn.onrender.com";
      const res = await fetch(`${apiUrl}/api/payments/payout-requests/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        toast.success(`Payout request marked as ${status}`);
        fetchPayoutData();
      } else {
        toast.error("Failed to update payout status");
      }
    } catch (err) {
      toast.error("Error updating payout status");
    } finally {
      setProcessingId(null);
    }
  };

  if (authLoading || !user || user.role !== "admin") {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-rose-500" />
      </div>
    );
  }

  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const currentPayments = payments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const generatePaginationNumbers = () => {
    const current = currentPage;
    const total = totalPages;
    let pages = [];
    
    if (total <= 5) {
      pages = Array.from({ length: total }, (_, i) => i + 1);
    } else {
      if (current <= 3) {
        pages = [1, 2, 3, 4, 5];
      } else if (current >= total - 2) {
        pages = [total - 4, total - 3, total - 2, total - 1, total];
      } else {
        pages = [current - 2, current - 1, current, current + 1, current + 2];
      }
    }
    return pages;
  };

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
              ) : currentPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-sm text-zinc-500">
                    No payment transactions found.
                  </td>
                </tr>
              ) : currentPayments.map((payment) => (
                <tr key={payment._id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 sm:px-6 py-4 font-mono text-xs text-zinc-500 max-w-[120px] sm:max-w-[150px] truncate" title={payment.transactionId || payment._id}>
                    {payment.transactionId || payment._id}
                  </td>
                  <td className="px-4 sm:px-6 py-4 max-w-[150px] sm:max-w-[200px] truncate" title={payment.email}>
                    <div className="font-bold text-white text-xs sm:text-sm truncate">{payment.email}</div>
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

        {/* Pagination Controls */}
        {!loading && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 bg-black/20 px-6 py-4 gap-4">
            <div className="text-xs text-zinc-500 font-medium">
              Showing Page <span className="font-bold text-white">{currentPage}</span> of <span className="font-bold text-white">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 p-1 backdrop-blur-md">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="flex h-8 items-center justify-center rounded-full px-3 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-emerald-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
              >
                <ChevronLeft size={14} className="mr-1" /> Prev
              </button>
              
              <div className="flex items-center gap-1">
                {generatePaginationNumbers().map(p => (
                  <button 
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      p === currentPage 
                        ? "bg-[length:200%_auto] animate-gradient-x bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(52,211,153,0.4)]" 
                        : "text-zinc-400 hover:bg-white/10 hover:text-emerald-400"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="flex h-8 items-center justify-center rounded-full px-3 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-emerald-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
              >
                Next <ChevronRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Creator Payout Requests Section */}
      <div className="pt-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-white mb-2">Creator Payout Requests</h2>
        <p className="text-zinc-400 text-sm mb-6">Manage withdrawal requests submitted by prompt creators.</p>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="border-b border-white/5 bg-white/[0.02] text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-6 py-4 font-bold">Creator</th>
                  <th className="px-6 py-4 font-bold">Payout Method & Details</th>
                  <th className="px-6 py-4 font-bold">Requested Amount</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payoutRequests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-sm text-zinc-500">
                      No payout requests received yet.
                    </td>
                  </tr>
                ) : (
                  payoutRequests.map((req) => (
                    <tr key={req._id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{req.userName}</div>
                        <div className="text-xs text-zinc-500">{req.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block font-bold text-xs uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mr-2">
                          {req.method}
                        </span>
                        <span className="text-xs text-zinc-300 font-mono">{req.details}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-white text-base">
                        ${(req.amount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {req.status === "paid" ? (
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">Paid</span>
                        ) : req.status === "rejected" ? (
                          <span className="rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-400 border border-rose-500/20">Rejected</span>
                        ) : (
                          <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === "pending" && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              disabled={processingId === req._id}
                              onClick={() => handleUpdateStatus(req._id, "paid")}
                              className="rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-xs font-bold transition-colors"
                            >
                              Mark as Paid
                            </button>
                            <button
                              disabled={processingId === req._id}
                              onClick={() => handleUpdateStatus(req._id, "rejected")}
                              className="rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 px-3 py-1 text-xs font-bold transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
