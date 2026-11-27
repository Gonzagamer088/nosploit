import { CTAButtons, Logo, PORTFOLIO_URL } from "@/components/ui";

const features = [
  ["Extremely cheap cost", "Professional-grade moderation tools without the professional-grade price."],
  ["Top-tier security & optimisation", "Built to be safe, fast and light on your game."],
  ["Clean, modern & responsive UI", "A polished interface your moderators will actually enjoy using."],
  ["Smart AI-powered modules", "Intelligent systems that help your team moderate smarter."],
  ["Automated punishment tracking", "Every action recorded automatically, so nothing slips through."],
  ["Custom Discord webhooks", "Send logs and alerts straight to your own Discord server."],
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(109,94,252,0.25),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 text-center">
          <div className="mb-4 flex justify-center"><Logo size={112} /></div>
          <span className="badge text-brand-soft">Roblox&apos;s #1 tech group for smart moderation</span>
          <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
            Welcome to <span className="text-brand-soft">Nosploit</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
            Roblox&apos;s #1 tech group specialising in smart moderation systems. Our mission is to help your game&apos;s
            moderators work smoothly and easily. We fully support and provide licenses for everyone, from small independent
            creators to big professional game studios.
          </p>
          <div className="mt-8 flex justify-center">
            <CTAButtons />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">What our products have to offer</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([t, d]) => (
            <div key={t} className="card">
              <h3 className="font-semibold text-white">{t}</h3>
              <p className="mt-2 text-sm text-slate-400">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-slate-400">
          …and more features that you won&apos;t get anywhere else, with new ones being shipped out frequently!
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-24 text-center">
        <p className="text-slate-300">
          Join our Roblox group and Discord server for more information on how we help communities grow, or apply for one of
          our products to make your own project strive today!
        </p>
        <div className="mt-6 flex justify-center"><CTAButtons /></div>
        <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm text-brand-soft hover:underline">
          📘 View our portfolio →
        </a>
      </section>
    </>
  );
}
