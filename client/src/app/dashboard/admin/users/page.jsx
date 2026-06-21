"use client";

import { Shield, Trash2, User, UserCheck, MoreVertical, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleRoleChange = async (userId, newRole) => {
    // Optimistic UI update
    const prevUsers = [...users];
    setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    
    try {
      const res = await fetch(`${API_URL}/api/users/role/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (!res.ok) throw new Error("Failed to update role");
    } catch (error) {
      console.error(error);
      setUsers(prevUsers); // Revert on failure
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        setUsers(users.filter(u => u._id !== userId));
      }
    } catch (error) {
      console.error("Failed to delete user", error);
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
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
                        <User size={16} />
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
      </div>
    </div>
  );
}
