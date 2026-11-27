"use client";

export default function HubError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="card mx-auto mt-16 max-w-lg text-center">
      <h1 className="text-xl font-bold text-white">Something went wrong</h1>
      <p className="mt-2 text-sm text-slate-400">
        The action could not be completed. Check that the values are valid and not already in use, then try again.
      </p>
      {error.digest && <p className="mt-3 text-xs text-slate-500">Reference: {error.digest}</p>}
      <div className="mt-5 flex justify-center gap-2">
        <button onClick={reset} className="btn-primary">Try again</button>
        <a href="/hub" className="btn-ghost">Back to Hub</a>
      </div>
    </div>
  );
}
