export const instant = false;

import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <LoginForm />
    </div>
  );
}
