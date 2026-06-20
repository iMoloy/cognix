import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";

export const metadata = {
  title: "Login | Cognix",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Login to manage prompts, bookmarks, reviews, and your creator workspace."
    >
      <Suspense fallback={<div className="h-20 flex items-center justify-center text-zinc-500 text-sm">Loading form...</div>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}

