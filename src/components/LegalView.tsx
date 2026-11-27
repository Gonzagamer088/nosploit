import type { ReactNode } from "react";

/** Minimal safe renderer: "## " headings, "- " bullets, paragraphs. Never injects HTML. */
export default function LegalView({ title, content, updatedAt }: { title: string; content: string; updatedAt: Date | null }) {
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];
  const flush = (k: number) => {
    if (bullets.length) {
      blocks.push(
        <ul key={`u${k}`} className="my-3 list-disc space-y-1 pl-6 text-slate-300">
          {bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>,
      );
      bullets = [];
    }
  };
  content.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.trim();
    if (line.startsWith("- ")) return void bullets.push(line.slice(2));
    flush(i);
    if (line.startsWith("## ")) blocks.push(<h2 key={i} className="mb-2 mt-8 text-xl font-bold text-white">{line.slice(3)}</h2>);
    else if (line) blocks.push(<p key={i} className="my-3 text-slate-300">{line}</p>);
  });
  flush(-1);
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-4xl font-extrabold text-white">{title}</h1>
      {blocks}
      <p className="mt-10 border-t border-line pt-4 text-xs text-slate-500">
        Last updated: {updatedAt ? updatedAt.toLocaleDateString("en-US", { dateStyle: "long" }) : "November 27, 2026"}
      </p>
    </div>
  );
}
