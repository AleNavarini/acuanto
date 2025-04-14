import { LoadingPage } from "@/components/loading-page";
import { SignInForm } from "@/components/sign-in-form";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<LoadingPage />}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
