import { BrainCircuit, CheckCircle2, Sparkles } from "lucide-react";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-zinc-900 px-4 py-12">
      <section className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-xl shadow-black/40 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative flex min-h-[560px] flex-col justify-between overflow-hidden bg-zinc-900 p-8 text-zinc-50">
          <div className="absolute inset-x-0 top-0 h-32 bg-emerald-300/5" />
          <div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-300 text-zinc-950">
              <BrainCircuit size={26} />
            </div>
            <h1 className="mt-8 max-w-sm text-4xl font-bold leading-tight">
              Build your prompt library with confidence.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-zinc-400">
              Cognix helps creators publish, discover, bookmark, review, and monetize AI prompts.
            </p>

            <div className="mt-8 space-y-3">
              {["Role-based dashboard access", "Premium prompt paywall ready", "Search and moderation friendly data"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                    <CheckCircle2 size={18} className="text-emerald-300" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <strong className="block text-2xl">5+</strong>
              AI tools
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <strong className="block text-2xl">$5</strong>
              Premium
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <strong className="flex items-center gap-1 text-2xl">
                <Sparkles size={18} />
                RBAC
              </strong>
              Secure roles
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-zinc-50">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
