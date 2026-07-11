import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex min-h-[80dvh] items-center justify-center">
      <div className="w-full max-w-sm">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
