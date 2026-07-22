"use client";

import { useState, useEffect } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { Users, FileText, Bookmark, Eye, TrendingUp, Loader2, Shield, MessageSquare, Copy, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";

export default function AnalyticsPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeRole = user?.role || "user";

  // Creator Payout System State
  const [payoutMethod, setPayoutMethod] = useState({ method: "bkash", details: "" });
  const [isEditingMethod, setIsEditingMethod] = useState(false);
  const [myPayoutRequests, setMyPayoutRequests] = useState([]);
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);

  const fetchPayoutDetails = async () => {
    if (!user || activeRole !== "creator") return;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cognix-6lqn.onrender.com";
    try {
      const [methodRes, reqsRes] = await Promise.all([
        fetch(`${API_URL}/api/payments/payout-method`, { credentials: "include" }),
        fetch(`${API_URL}/api/payments/my-payout-requests`, { credentials: "include" })
      ]);
      if (methodRes.ok) {
        const mData = await methodRes.json();
        if (mData.payoutMethod) {
          setPayoutMethod(mData.payoutMethod);
        }
      }
      if (reqsRes.ok) {
        const rData = await reqsRes.json();
        setMyPayoutRequests(rData);
      }
    } catch (err) {
      console.error("Failed to fetch payout details", err);
    }
  };

  useEffect(() => {
    if (user && activeRole === "creator") {
      fetchPayoutDetails();
    }
  }, [user, activeRole]);

  const handleSavePayoutMethod = async (e) => {
    e.preventDefault();
    if (!payoutMethod.details.trim()) {
      toast.error("Please enter your payout details (e.g. Account Number or Email).");
      return;
    }
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cognix-6lqn.onrender.com";
    try {
      const res = await fetch(`${API_URL}/api/payments/payout-method`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payoutMethod)
      });
      if (res.ok) {
        toast.success("Payout method saved successfully!");
        setIsEditingMethod(false);
      } else {
        toast.error("Failed to save payout method.");
      }
    } catch (err) {
      toast.error("Error saving payout method.");
    }
  };

  const handleRequestPayout = async () => {
    if (!payoutMethod.details.trim()) {
      toast.error("Please set up your payout method first!");
      setIsEditingMethod(true);
      return;
    }

    const availableEarnings = data?.totalEarnings || 0;
    if (availableEarnings <= 0) {
      toast.error("You have no earnings available to withdraw.");
      return;
    }

    setIsSubmittingPayout(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cognix-6lqn.onrender.com";
    try {
      const res = await fetch(`${API_URL}/api/payments/request-payout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: availableEarnings,
          method: payoutMethod.method,
          details: payoutMethod.details
        })
      });

      const resData = await res.json();
      if (res.ok) {
        toast.success("Payout request submitted successfully!");
        fetchPayoutDetails();
      } else {
        toast.error(resData.message || "Failed to submit payout request.");
      }
    } catch (err) {
      toast.error("Error submitting payout request.");
    } finally {
      setIsSubmittingPayout(false);
    }
  };

  const handleExportCSV = () => {
    if (!data) return;

    let csvRows = [];

    if (activeRole === "creator") {
      csvRows.push(["Metric", "Value"]);
      csvRows.push(["Total Prompts", data.totalPrompts || 0]);
      csvRows.push(["Total Copies", data.totalCopies || 0]);
      csvRows.push(["Total Bookmarks", data.totalBookmarks || 0]);
      csvRows.push(["Total Earnings ($)", data.totalEarnings || 0]);
      csvRows.push([]);
      csvRows.push(["Prompt Title", "Price ($)", "Copies", "Earnings ($)"]);
      (data.earningsBreakdown || []).forEach(p => {
        csvRows.push([`"${(p.title || "").replace(/"/g, '""')}"`, p.price || 0, p.copies || 0, (p.earnings || 0).toFixed(2)]);
      });
    } else {
      csvRows.push(["Metric", "Value"]);
      csvRows.push(["Total Users", data.totalUsers || 0]);
      csvRows.push(["Total Prompts", data.totalPrompts || 0]);
      csvRows.push(["Total Reviews", data.totalReviews || 0]);
      csvRows.push(["Total Copies", data.totalCopies || 0]);
      csvRows.push(["Total Revenue ($)", data.totalRevenue || 0]);
      csvRows.push([]);
      csvRows.push(["Date", "New Users", "New Prompts", "New Reviews"]);
      (data.platformActivityData || []).forEach(row => {
        csvRows.push([row.name, row.users, row.prompts, row.reviews]);
      });
    }

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics-report-${activeRole}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Analytics report exported successfully!");
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      // Don't try fetching until auth is completely resolved
      if (authLoading) return;
      
      // If no user or token after auth resolves, we can't fetch
      if (!user) {
        setLoading(false);
        setError("You must be logged in to view analytics.");
        return;
      }
      
      try {
        setLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cognix-6lqn.onrender.com";
        
        let url = `${API_URL}/api/analytics`;
        // If user is creator, fetch their specific stats. If admin, fetch global stats.
        if (activeRole === "creator") {
          url += `?creatorId=${user._id}`;
        }

        const res = await fetch(url, {
          credentials: "include",
        });

        if (res.ok) {
          const result = await res.json();
          setData(result);
          setError(null);
        } else {
          const errData = await res.json().catch(() => ({}));
          console.error("Failed to fetch analytics", res.status, errData);
          const errorMsg = `Failed to fetch analytics (Status ${res.status})`;
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        const errorMsg = "Network error or server unreachable";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, token, activeRole, authLoading]);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest animate-pulse">Loading Analytics</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <h2 className="text-xl font-bold text-white">Error Loading Analytics</h2>
          <p className="text-zinc-400">{error || "No data received from server."}</p>
        </div>
      </div>
    );
  }

  const renderCreatorAnalytics = () => (
    <div className="space-y-8">
      {/* Creator Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400">Total Prompts</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <FileText size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-white">{data.totalPrompts || 0}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400">Total Copies</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Eye size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-white">{data.totalCopies || 0}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400">Total Bookmarks</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Bookmark size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-white">{data.totalBookmarks || 0}</p>
        </div>

        {/* Earnings Card */}
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 p-6 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between relative">
            <h3 className="text-sm font-bold text-emerald-300">Total Earnings</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 text-lg font-black">
              $
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-emerald-400 relative">
            ${(data.totalEarnings || 0).toFixed(2)}
          </p>
          <p className="mt-1 text-[11px] text-emerald-500/70 relative">70% revenue share</p>
        </div>
      </div>

      {/* Earnings Breakdown Table */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400" /> Earnings by Prompt
          </h3>
          <span className="text-xs text-zinc-500 bg-white/5 rounded-lg px-3 py-1">Top 5 performers</span>
        </div>

        {(!data.earningsBreakdown || data.earningsBreakdown.length === 0) ? (
          <p className="text-zinc-500 text-sm italic py-4">No prompt earnings data yet. Add premium prompts to start earning.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-zinc-500 pb-3">Prompt</th>
                  <th className="text-right text-xs font-bold uppercase tracking-wider text-zinc-500 pb-3">Price</th>
                  <th className="text-right text-xs font-bold uppercase tracking-wider text-zinc-500 pb-3">Copies</th>
                  <th className="text-right text-xs font-bold uppercase tracking-wider text-zinc-500 pb-3">Your Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.earningsBreakdown.map((item) => (
                  <tr key={item._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 pr-4">
                      <p className="font-semibold text-white truncate max-w-[200px]" title={item.title}>
                        {item.title}
                      </p>
                    </td>
                    <td className="py-4 text-right text-zinc-400">
                      {item.price > 0 ? `$${item.price}` : <span className="text-xs text-zinc-600">Free</span>}
                    </td>
                    <td className="py-4 text-right text-zinc-400">{item.copies}</td>
                    <td className="py-4 text-right">
                      <span className={`font-bold ${item.earnings > 0 ? "text-emerald-400" : "text-zinc-600"}`}>
                        ${(item.earnings || 0).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payout Method & Action Panel */}
        <div className="mt-6 flex flex-col md:flex-row gap-4 items-start justify-between rounded-xl border border-white/5 bg-black/30 p-5">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Your Payout Method</h4>
            {payoutMethod.details ? (
              <p className="text-xs text-zinc-400">
                <span className="font-bold text-emerald-400 uppercase mr-2">{payoutMethod.method}</span> 
                <span className="font-mono">{payoutMethod.details}</span>
              </p>
            ) : (
              <p className="text-xs text-amber-400">No payout method configured yet.</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button 
              variant="secondary" 
              onClick={() => setIsEditingMethod(!isEditingMethod)}
              className="text-xs py-2 px-4 bg-white/5 hover:bg-white/10"
            >
              {isEditingMethod ? "Cancel" : payoutMethod.details ? "Edit Payout Method" : "Set Payout Method"}
            </Button>

            <Button
              onClick={handleRequestPayout}
              disabled={isSubmittingPayout || (data?.totalEarnings || 0) <= 0}
              className="text-xs py-2 px-5"
            >
              {isSubmittingPayout ? (
                <><Loader2 size={14} className="mr-2 animate-spin" /> Submitting...</>
              ) : (
                <>Request Payout (${(data?.totalEarnings || 0).toFixed(2)})</>
              )}
            </Button>
          </div>
        </div>

        {/* Payout Method Edit Form */}
        {isEditingMethod && (
          <form onSubmit={handleSavePayoutMethod} className="mt-4 p-4 rounded-xl border border-white/10 bg-zinc-950/80 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Configure Payout Method</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Select Method</label>
                <select
                  value={payoutMethod.method}
                  onChange={(e) => setPayoutMethod(prev => ({ ...prev, method: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50"
                >
                  <option value="bkash" className="bg-zinc-900">bKash (Personal/Agent)</option>
                  <option value="nagad" className="bg-zinc-900">Nagad</option>
                  <option value="bank" className="bg-zinc-900">Bank Transfer (SWIFT / Local)</option>
                  <option value="paypal" className="bg-zinc-900">PayPal</option>
                  <option value="wise" className="bg-zinc-900">Wise (TransferWise)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Account Number / Email / Details</label>
                <input
                  type="text"
                  value={payoutMethod.details}
                  onChange={(e) => setPayoutMethod(prev => ({ ...prev, details: e.target.value }))}
                  placeholder="e.g. 01700000000 or email@domain.com"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit" size="sm">Save Method</Button>
            </div>
          </form>
        )}

        {/* Payout Requests History */}
        {myPayoutRequests.length > 0 && (
          <div className="mt-6 border-t border-white/5 pt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Your Withdrawal Requests</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-500">
                    <th className="pb-2 font-bold">Amount</th>
                    <th className="pb-2 font-bold">Method</th>
                    <th className="pb-2 font-bold">Details</th>
                    <th className="pb-2 font-bold">Status</th>
                    <th className="pb-2 font-bold">Requested Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {myPayoutRequests.map((req) => (
                    <tr key={req._id}>
                      <td className="py-3 font-bold text-white">${(req.amount || 0).toFixed(2)}</td>
                      <td className="py-3 font-bold uppercase text-emerald-400">{req.method}</td>
                      <td className="py-3 text-zinc-300 font-mono">{req.details}</td>
                      <td className="py-3">
                        {req.status === "paid" ? (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-400 border border-emerald-500/20">Paid</span>
                        ) : req.status === "rejected" ? (
                          <span className="rounded-full bg-rose-500/10 px-2 py-0.5 font-bold text-rose-400 border border-rose-500/20">Rejected</span>
                        ) : (
                          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 font-bold text-amber-400 border border-amber-500/20">Pending</span>
                        )}
                      </td>
                      <td className="py-3 text-zinc-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Creator Charts */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
        <h3 className="mb-6 text-lg font-bold text-white">Prompt Growth</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.promptGrowthData || []}>
              <defs>
                <linearGradient id="colorPrompts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff20', borderRadius: '12px' }}
                itemStyle={{ color: '#34d399', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="prompts" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorPrompts)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderAdminAnalytics = () => (
    <div className="space-y-8">
      {/* Admin Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400">Total Users</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Users size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-white">{data.totalUsers || 0}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400">Total Prompts</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <FileText size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-white">{data.totalPrompts || 0}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400">Total Reviews</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <MessageSquare size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-white">{data.totalReviews || 0}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400">Total Copies</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <Copy size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-white">{data.totalCopies || 0}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400">Total Revenue</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <span className="font-bold">$</span>
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-white">${data.totalRevenue || 0}</p>
        </div>
      </div>

      {/* Admin Charts */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
        <h3 className="mb-6 text-lg font-bold text-white">Platform Activity Overview</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.platformActivityData || []} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff20', borderRadius: '12px' }}
                cursor={{ fill: '#ffffff05' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="users" name="New Users" fill="#a855f7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="prompts" name="New Prompts" fill="#34d399" radius={[4, 4, 0, 0]} />
              <Bar dataKey="reviews" name="New Reviews" fill="#22d3ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  if (activeRole === "user") {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="text-center space-y-4">
          <Shield className="mx-auto h-12 w-12 text-zinc-500" />
          <h2 className="text-xl font-bold text-white">Access Denied</h2>
          <p className="text-zinc-400">You must be a Creator or Admin to view analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Analytics</h1>
          <p className="mt-2 text-zinc-400">Analyze performance and track key metrics.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" onClick={handleExportCSV} className="text-xs bg-white/5 hover:bg-white/10 border-white/10">
            <Download size={14} className="mr-2" /> Export CSV Report
          </Button>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
            <span className="text-sm font-bold text-emerald-400 capitalize">{activeRole} View Active</span>
          </div>
        </div>
      </div>

      {activeRole === "creator" ? renderCreatorAnalytics() : renderAdminAnalytics()}
    </div>
  );
}
