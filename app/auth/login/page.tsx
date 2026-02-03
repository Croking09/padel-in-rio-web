import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex w-full items-center justify-center p-10">
      <div className="w-full max-w-sm">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
