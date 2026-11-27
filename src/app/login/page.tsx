import Link from "next/link";
import { SignInButtons } from "@/components/AuthButtons";
import Providers from "@/components/Providers";

export const metadata = { title: "Staff login" };

export default function Login({ searchParams }: { searchParams: { error?: string } }) {
  const err = searchParams.error;
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="card w-full max-w-sm">
        <h1 className="text-xl font-bold text-white">Staff Hub</h1>
        <p className="mb-5 mt-1 text-sm text-slate-400">Sign in with an account that has been whitelisted by the Executive Team.</p>
        {err && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
            {err === "NotWhitelisted" ? "This account is not whitelisted for the Staff Hub." : "Sign-in failed. Please try again."}
          </div>
        )}
        <Providers>
          <SignInButtons />
        </Providers>
        <Link href="/" className="mt-5 block text-center text-xs text-slate-500 hover:text-slate-300">← Back to site</Link>
      </div>
    </div>
  );
}
