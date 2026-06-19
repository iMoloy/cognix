import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Copy,
  LockKeyhole,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";

const promptRows = [
  {
    title: "Product Launch Planner",
    category: "Marketing",
    tool: "ChatGPT",
    level: "Intermediate",
    copies: "1,842",
    rating: "4.9",
  },
  {
    title: "UX Audit Assistant",
    category: "Design",
    tool: "Claude",
    level: "Pro",
    copies: "936",
    rating: "4.8",
  },
  {
    title: "Lesson Plan Builder",
    category: "Education",
    tool: "Gemini",
    level: "Beginner",
    copies: "721",
    rating: "4.7",
  },
];

const workflowItems = [
  "Submit prompts into a moderation queue",
  "Discover approved public prompts with filters",
  "Unlock premium private prompts after payment",
  "Track copies, bookmarks, reviews, and creator growth",
];

export default function Home() {
  return (
    <main className="bg-zinc-950">
      <section className="border-b border-zinc-800 bg-zinc-900 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              AI prompt marketplace
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-[1.04] text-zinc-50 sm:text-6xl">
              A curated workspace for prompts worth reusing.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
              Cognix is built for publishing, reviewing, bookmarking, and selling practical AI prompts across the tools teams already use.
            </p>

            <div className="mt-8 flex max-w-2xl items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-2 shadow-sm">
              <Search className="ml-2 text-zinc-500" size={20} />
              <input
                className="h-11 flex-1 bg-transparent text-sm text-zinc-50 outline-none"
                placeholder="Search by title, tag, or AI tool"
                aria-label="Search prompts"
              />
              <Link
                href="/prompts"
                className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-300 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
              >
                Search
              </Link>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-300 px-6 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
              >
                Create account
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/prompts"
                className="inline-flex h-12 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 px-6 text-sm font-semibold text-zinc-200 transition hover:border-zinc-700"
              >
                Browse marketplace
              </Link>
            </div>

            <div className="mt-9 grid max-w-xl grid-cols-3 divide-x divide-zinc-800 border-y border-zinc-800 py-5">
              <div>
                <strong className="block text-2xl text-zinc-50">3</strong>
                <span className="text-xs font-medium text-zinc-500">User roles</span>
              </div>
              <div className="pl-5">
                <strong className="block text-2xl text-zinc-50">$5</strong>
                <span className="text-xs font-medium text-zinc-500">Premium unlock</span>
              </div>
              <div className="pl-5">
                <strong className="block text-2xl text-zinc-50">2+</strong>
                <span className="text-xs font-medium text-zinc-500">Paginated views</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 shadow-xl shadow-black/40">
            <div className="border-b border-zinc-800 px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-zinc-50">Marketplace Preview</h2>
                  <p className="mt-1 text-sm text-zinc-500">Approved prompts sorted by engagement</p>
                </div>
                <span className="rounded-md bg-emerald-300 px-3 py-1 text-xs font-bold text-emerald-950">
                  Live queue
                </span>
              </div>
            </div>

            <div className="divide-y divide-zinc-800">
              {promptRows.map((prompt) => (
                <article key={prompt.title} className="grid gap-4 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <h3 className="font-semibold text-zinc-50">{prompt.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-zinc-500">
                      <span>{prompt.category}</span>
                      <span>·</span>
                      <span>{prompt.tool}</span>
                      <span>·</span>
                      <span>{prompt.level}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-zinc-400">
                    <span className="inline-flex items-center gap-1">
                      <Copy size={15} />
                      {prompt.copies}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Star size={15} />
                      {prompt.rating}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <div className="grid gap-3 border-t border-zinc-800 bg-zinc-900 p-5 sm:grid-cols-2">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-50">
                  <LockKeyhole size={17} />
                  Premium gate
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Private prompts remain blurred until payment access is confirmed.
                </p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-50">
                  <Bookmark size={17} />
                  Saved library
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Users can bookmark useful prompts without creating duplicates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Product flow
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-zinc-50">
              Designed around moderation, discovery, and creator ownership.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {workflowItems.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-5">
                <CheckCircle2 className="mt-0.5 shrink-0 text-zinc-50" size={19} />
                <p className="text-sm font-medium leading-6 text-zinc-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 bg-zinc-900 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400">
              <ShieldCheck size={18} />
              Role-based marketplace foundation
            </div>
            <h2 className="mt-2 text-2xl font-bold text-zinc-50">
              Start with the client experience, then wire each screen to the API.
            </h2>
          </div>
          <Link
            href="/register"
            className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-300 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
          >
            Continue setup
          </Link>
        </div>
      </section>
    </main>
  );
}
