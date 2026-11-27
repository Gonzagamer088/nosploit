import { delay } from "@/components/ui";
export const metadata = { title: "Contact" };

const execs = ["Chief Executive Officer", "Chief Operating Officer", "Chief Commercial Officer"];

export default function Contact() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="reveal text-4xl font-extrabold text-white">Contact</h1>
      <p className="mt-3 text-slate-400">Official executive email addresses are coming soon.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {execs.map((e, i) => (
          <div key={e} className="card card-hover reveal text-center" style={delay(i)}>
            <div className="font-semibold text-white">{e}</div>
            <div className="mt-2 text-sm text-slate-500">Coming soon</div>
          </div>
        ))}
      </div>
    </div>
  );
}
