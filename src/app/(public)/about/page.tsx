import { CTAButtons, PORTFOLIO_URL, delay } from "@/components/ui";

export const metadata = { title: "About" };

const items = [
  ["Our story", "Founded in May and branded as Nosploit on June 24th, 2026 by MarinatxdMarshmallow."],
  ["Our mission", "To help your game's moderators work smoothly and easily with smart moderation systems."],
  ["Licenses for everyone", "We fully support and provide licenses for everyone, from small independent creators to big professional game studios."],
  ["Always improving", "New features are shipped out frequently, including ones you won't get anywhere else."],
];

const features = [
  "Extremely cheap cost",
  "Top-tier security and optimisation",
  "Clean, modern and responsive UI",
  "Smart AI-powered modules",
  "Automated punishment tracking",
  "Custom Discord webhooks",
  "And more features that you won't get anywhere else, with new ones being shipped out frequently!",
];

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="reveal text-4xl font-extrabold text-white">About Nosploit</h1>
      <p className="mt-4 text-lg text-slate-400">
        Nosploit is Roblox&apos;s #1 tech group specialising in smart moderation systems.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {items.map(([t, d], i) => (
          <div key={t} className="card card-hover reveal" style={delay(i)}>
            <h3 className="font-semibold text-white">{t}</h3>
            <p className="mt-2 text-sm text-slate-400">{d}</p>
          </div>
        ))}
      </div>
      <h2 className="mb-3 mt-12 text-2xl font-bold text-white">What our products have to offer</h2>
      <ul className="list-disc space-y-1 pl-6 text-slate-300">
        {features.map((f) => <li key={f}>{f}</li>)}
      </ul>
      <p className="mt-8 text-slate-300">
        Join our Roblox group and Discord server for more information on how we help communities grow, or apply for one of our
        products to make your own project strive today!
      </p>
      <div className="mt-6"><CTAButtons /></div>
      <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm text-slate-300 hover:text-white hover:underline">
        📘 Portfolio →
      </a>
    </div>
  );
}
