import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Register | Cognix",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Cognix to publish prompts, save favorites, and unlock premium prompt access."
    >
      <RegisterForm />
    </AuthShell>
  );
}

