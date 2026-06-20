"use client";

import { Shield, Trash2, User, UserCheck, MoreVertical } from "lucide-react";
import { useState } from "react";

const mockUsers = [
  { _id: "u1", name: "Alex Dev", email: "alex@example.com", role: "admin", joinDate: "Oct 12, 2026" },
  { _id: "u2", name: "Sarah Copy", email: "sarah@example.com", role: "creator", joinDate: "Oct 24, 2026" },
  { _id: "u3", name: "John Doe", email: "john@example.com", role: "user", joinDate: "Nov 01, 2026" },
  { _id: "u4", name: "Emma Smith", email: "emma@example.com", role: "user", joinDate: "Nov 05, 2026" }
];

export default function AllUsersPage() {
  const [users, setUsers] = useState(mockUsers);

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
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
              {users.map((user) => (
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
                    {user.joinDate}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-right">
                    <button 
                      title="Delete User"
                      className="flex h-8 w-8 ml-auto items-center justify-center rounded-lg bg-white/5 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={16} />
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
