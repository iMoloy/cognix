import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login | Cognix",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Login to manage prompts, bookmarks, reviews, and your creator workspace."
    >
      <LoginForm />
    </AuthShell>
  );
}

