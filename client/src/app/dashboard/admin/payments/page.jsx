"use client";

import { CreditCard, ArrowUpRight } from "lucide-react";
import { useState } from "react";

const mockPayments = [
  { _id: "txn_12345", user: "John Doe", email: "john@example.com", amount: 5.00, status: "completed", date: "Nov 02, 2026" },
  { _id: "txn_67890", user: "Emma Smith", email: "emma@example.com", amount: 5.00, status: "completed", date: "Oct 28, 2026" },
  { _id: "txn_54321", user: "Liam Brown", email: "liam@example.com", amount: 5.00, status: "failed", date: "Oct 25, 2026" },
];

export default function AllPaymentsPage() {
  const [payments] = useState(mockPayments);

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
            <thead className="border-b border-white/5 bg-white/[0.02] text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 font-bold tracking-wider">User</th>
                <th className="px-6 py-4 font-bold tracking-wider">Amount</th>
                <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold tracking-wider">Date</th>
                <th className="px-6 py-4 text-right font-bold tracking-wider">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.map((payment) => (
                <tr key={payment._id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-6 py-5 font-mono text-xs text-zinc-500">
                    {payment._id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    <div>
                      <div className="font-bold text-white">{payment.user}</div>
                      <div className="text-xs text-zinc-500">{payment.email}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 font-bold text-emerald-400">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    {payment.status === "completed" ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                        Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-400 border border-red-500/20">
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-xs text-zinc-500">
                    {payment.date}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-right">
                    <button 
                      title="View Receipt"
                      className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-xs font-bold text-zinc-400 transition-colors hover:bg-cyan-500/10 hover:text-cyan-400"
                    >
                      View <ArrowUpRight size={12} />
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
