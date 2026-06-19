"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Bookmark,
  ChartNoAxesCombined,
  Crown,
  FilePlus2,
  MessageSquareText,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const stats = [
  { label: "Prompts", value: "0", icon: FilePlus2 },
  { label: "Bookmarks", value: "0", icon: Bookmark },
  { label: "Reviews", value: "0", icon: MessageSquareText },
  { label: "Copies", value: "0", icon: TrendingUp },
];

const dashboardLinks = [
  { label: "Add Prompt", icon: FilePlus2, href: "/dashboard/add-prompt" },
  { label: "Saved Prompts", icon: Bookmark, href: "/dashboard/saved-prompts" },
  { label: "My Reviews", icon: MessageSquareText, href: "/dashboard/my-reviews" },
  { label: "Profile", icon: UserRound, href: "/dashboard/profile" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { loading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-zinc-900">
        <div className="h-10 w-10 rounded-full border-4 border-zinc-800 border-t-emerald-300" />
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-zinc-900 px-4 py-8">
      <section className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold text-zinc-50">Welcome, {user?.name}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              A working area for prompts, reviews, bookmarks, and subscription status.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm font-semibold text-zinc-200">
            <Crown size={17} />
            {user?.subscription === "premium" ? "Premium account" : "Free account"}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-500">{item.label}</span>
                  <Icon size={19} className="text-zinc-500" />
                </div>
                <strong className="mt-4 block text-3xl text-zinc-50">{item.value}</strong>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h2 className="font-bold text-zinc-50">Workspace shortcuts</h2>
            </div>
            <div className="divide-y divide-zinc-800">
              {dashboardLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-zinc-900"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-md bg-zinc-800 text-zinc-300">
                        <Icon size={19} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-zinc-50">{item.label}</span>
                        <span className="text-xs text-zinc-500">Open {item.label.toLowerCase()}</span>
                      </span>
                    </span>
                    <span className="text-sm text-zinc-500">Open</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <aside className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center gap-2">
              <ChartNoAxesCombined size={20} className="text-zinc-500" />
              <h2 className="font-bold text-zinc-50">Analytics preview</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Prompt growth and copy activity charts will connect here when real creator data is available.
            </p>

            <div className="mt-6 space-y-4">
              {[
                { label: "Copy activity", width: "w-28" },
                { label: "Prompt growth", width: "w-36" },
                { label: "Bookmarks", width: "w-20" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex justify-between text-xs font-semibold text-zinc-500">
                    <span>{item.label}</span>
                    <span>0</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800">
                    <div className={`h-2 rounded-full bg-emerald-300 ${item.width}`} />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
