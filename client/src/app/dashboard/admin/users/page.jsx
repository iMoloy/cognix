"use client";

import { Shield, Trash2, User, UserCheck, MoreVertical, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

export default function AllUsersPage() {
  const { token, user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cognix-6lqn.onrender.com";

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

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users?page=${currentPage}&limit=${limit}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        // Adjust depending on whether the backend was updated to return pagination object or array
        if (data.users) {
          setUsers(data.users);
          setTotalPages(data.totalPages || 1);
        } else {
          setUsers(data);
        }
      } else {
        toast.error("Failed to fetch users.");
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Failed to fetch users.");
    } finally {
      setIsLoading(false);
    }
  };

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

  /* eslint-disable */
  useEffect(() => {
    if (user) fetchUsers();
  }, [user, currentPage]);
  /* eslint-enable */

  const handleRoleChange = async (userId, newRole) => {
    // Optimistic UI update
    const prevUsers = [...users];
    setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    
    try {
      const res = await fetch(`${API_URL}/api/users/role/${userId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (!res.ok) throw new Error("Failed to update role");
      toast.success("User role updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user role");
      setUsers(prevUsers); // Revert on failure
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (res.ok) {
        setUsers(users.filter(u => u._id !== userId));
        toast.success("User deleted successfully");
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user", error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Manage Users</h1>
        <p className="mt-2 text-zinc-400">View all registered users, change roles, or manage accounts.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="border-b border-white/5 bg-white/[0.02] text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">User</th>
                <th className="px-6 py-4 font-bold tracking-wider">Email</th>
                <th className="px-6 py-4 font-bold tracking-wider">Role</th>
                <th className="px-6 py-4 font-bold tracking-wider">Join Date</th>
                <th className="px-6 py-4 text-right font-bold tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-zinc-500">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-zinc-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                <tr key={user._id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 overflow-hidden items-center justify-center rounded-full bg-zinc-800 text-zinc-400 shrink-0">
                        <img 
                          src={user.image || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'user')}`} 
                          alt={user.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-bold text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-zinc-300">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    <select 
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-bold uppercase tracking-wider outline-none transition-colors ${
                        user.role === 'admin' ? 'border-purple-500/30 bg-purple-500/10 text-purple-400' :
                        user.role === 'creator' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                        'border-white/10 bg-black/20 text-zinc-400'
                      }`}
                    >
                      <option value="user" className="bg-zinc-900 text-white">User</option>
                      <option value="creator" className="bg-zinc-900 text-white">Creator</option>
                      <option value="admin" className="bg-zinc-900 text-white">Admin</option>
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-xs text-zinc-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-right">
                    <button 
                      onClick={() => handleDeleteUser(user._id)}
                      title="Delete User"
                      className="flex h-8 w-8 ml-auto items-center justify-center rounded-lg bg-white/5 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 bg-black/20 px-6 py-4 gap-4">
            <div className="text-xs text-zinc-500 font-medium">
              Showing Page <span className="font-bold text-white">{currentPage}</span> of <span className="font-bold text-white">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 p-1 backdrop-blur-md">
              <button 
                disabled={currentPage === 1 || isLoading}
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
                disabled={currentPage === totalPages || isLoading}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="flex h-8 items-center justify-center rounded-full px-3 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-emerald-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
              >
                Next <ChevronRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
