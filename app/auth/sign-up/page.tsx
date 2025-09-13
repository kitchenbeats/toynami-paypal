import { AuthForm } from "@/components/auth-form";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10">
      <Link href="/" className="mb-8">
        <Image
          src="/images/toynami-logo.webp"
          alt="Toynami"
          width={200}
          height={60}
          className="h-12 w-auto"
          priority
        />
      </Link>
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Join Toynami to start shopping and save your favorites
        </p>
        <AuthForm view="sign_up" redirectTo="/protected" />
      </div>
    </div>
  );
}
