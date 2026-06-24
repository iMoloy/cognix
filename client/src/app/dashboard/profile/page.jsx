"use client";

import { CheckCircle2, Shield, User, Crown, Key, Camera, Save, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { uploadImage } from "@/utils/uploadImage";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { user, token, updateProfile, loading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [imageMode, setImageMode] = useState("local"); // "local" or "url"
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    photoURL: user?.image || user?.photoURL || "",
    email: user?.email || "",
    role: user?.role || "",
  });

  const fetchPayments = async () => {
    if (!user?.email) return;
    setLoadingPayments(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://cognix-6lqn.onrender.com";
      const res = await fetch(`${apiUrl}/api/payments/history/${user.email}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      }
    } catch (err) {
      console.error("Failed to fetch payments", err);
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line
      setFormData({
        name: user.name || "",
        photoURL: user.image || user.photoURL || "",
        email: user.email || "",
        role: user.role || "",
      });
      fetchPayments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest animate-pulse">Loading Profile</p>
        </div>
      </div>
    );
  }

  const isPremium = user.subscription === "premium";
  const isAdmin = user.role === "admin";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
      // Show local preview immediately
      setFormData(prev => ({ ...prev, photoURL: URL.createObjectURL(e.target.files[0]) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      let finalPhotoURL = formData.photoURL;
      if (imageMode === "local" && photoFile) {
        finalPhotoURL = await uploadImage(photoFile);
      } else if (imageMode === "url" && formData.photoURL) {
        finalPhotoURL = formData.photoURL;
      }
      
      await updateProfile({ ...formData, photoURL: finalPhotoURL });
      
      setIsSaving(false);
      toast.success("Profile settings updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update profile.");
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Profile Settings</h1>
        <p className="mt-2 text-zinc-400">Manage your account identity, profile image, and subscription preferences.</p>
      </div>

      {/* Profile Identity Card */}
      <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 shadow-2xl backdrop-blur-xl">
        <div className="border-b border-white/5 bg-white/[0.02] px-8 py-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <User size={18} className="text-emerald-400" /> Identity Details
          </h2>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <img 
                  src={formData.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.name || "User")}`} 
                  alt="Profile" 
                  className={`h-32 w-32 rounded-full bg-zinc-800 object-cover transition-opacity group-hover:opacity-50 ${isPremium ? 'border-4 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)]' : 'border-4 border-white/5'}`}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <Camera size={24} className="text-white" />
                </div>
                <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-zinc-950 ring-4 ring-[#030303]">
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Profile Picture</p>
            </div>
            
            {/* Form Fields */}
            <div className="flex-1 w-full space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm font-medium text-white outline-none transition-colors focus:border-emerald-500/50 focus:bg-black/60"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Profile Image</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setImageMode("local")} className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase transition-colors ${imageMode === "local" ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-zinc-500 hover:text-zinc-300"}`}>Upload</button>
                    <button type="button" onClick={() => setImageMode("url")} className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase transition-colors ${imageMode === "url" ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-zinc-500 hover:text-zinc-300"}`}>URL</button>
                  </div>
                </div>
                
                {imageMode === "local" ? (
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-zinc-400 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/5 file:text-emerald-400 hover:file:bg-white/10 transition-all cursor-pointer border border-white/10 bg-black/40 rounded-xl"
                  />
                ) : (
                  <input 
                    type="url" 
                    name="photoURL"
                    value={formData.photoURL}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm font-medium text-white outline-none transition-colors focus:border-emerald-500/50 focus:bg-black/60"
                  />
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    disabled={!isAdmin}
                    value={isAdmin ? formData.email : user.email}
                    onChange={handleChange}
                    className={`h-12 w-full rounded-xl border px-4 text-sm font-medium outline-none transition-colors ${isAdmin ? "border-white/10 bg-black/40 text-white focus:border-emerald-500/50" : "border-white/5 bg-white/5 text-zinc-500 cursor-not-allowed"}`}
                    title={isAdmin ? "" : "Email cannot be changed"}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Account Role</label>
                  {isAdmin ? (
                    <select 
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm font-medium text-white outline-none transition-colors focus:border-emerald-500/50 capitalize"
                    >
                      <option value="user" className="bg-zinc-900 text-white">user</option>
                      <option value="creator" className="bg-zinc-900 text-white">creator</option>
                      <option value="admin" className="bg-zinc-900 text-white">admin</option>
                    </select>
                  ) : (
                    <div className="h-12 w-full flex items-center rounded-xl border border-white/5 bg-white/5 px-4 text-sm font-medium text-zinc-400 capitalize">
                      <Shield size={14} className="mr-2 text-emerald-400" /> {user.role}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  isLoading={isSaving}
                  className="h-11 px-6 text-sm"
                >
                  <Save size={16} className="mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>

            </div>
          </div>
        </div>
      </form>

      {/* Subscription Card */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 shadow-2xl backdrop-blur-xl">
        <div className="border-b border-white/5 bg-white/[0.02] px-8 py-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Crown size={18} className="text-amber-400" /> Subscription Plan
          </h2>
        </div>
        
        <div className="p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold text-white capitalize">{user.subscription} Plan</span>
              {isPremium && (
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-400 ring-1 ring-emerald-500/30">
                  Active
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-zinc-400 max-w-md">
              {isPremium 
                ? "You have full access to all premium private prompts in the marketplace." 
                : "Upgrade to premium for a one-time payment of $5 to unlock all private, high-quality prompts."}
            </p>
          </div>
          
          {!isPremium && (
            <Link 
              href="/payment"
              className="shrink-0 group flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] animate-gradient-x px-8 text-sm font-bold text-zinc-950 shadow-md transition-all hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(52,211,153,0.25)]"
            >
              <Key size={16} className="transition-transform group-hover:scale-110" />
              Upgrade for $5
            </Link>
          )}
        </div>
      </div>

      {/* Payment History Card */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 shadow-2xl backdrop-blur-xl">
        <div className="border-b border-white/5 bg-white/[0.02] px-8 py-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Payment History
          </h2>
        </div>
        
        <div className="p-8">
          {loadingPayments ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin text-emerald-400" />
            </div>
          ) : payments.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-6">No payment history found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="text-xs uppercase text-zinc-500 bg-white/5">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Date</th>
                    <th className="px-4 py-3">Transaction ID</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3 rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-white">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{payment.transactionId}</td>
                      <td className="px-4 py-3 font-bold text-emerald-400">${(payment.amount / 100).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded-md uppercase font-bold">
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
