import { SignUpForm } from "@/components/auth/sign-up-form";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex min-h-[80dvh] items-center justify-center">
      <div className="w-full max-w-sm">
        <Suspense>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  );
}
