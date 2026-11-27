import { CTAButtons, Logo, PORTFOLIO_URL, delay } from "@/components/ui";

const features = [
  ["💸", "Extremely cheap cost", "Professional-grade moderation tools without the professional-grade price."],
  ["🛡️", "Top-tier security & optimisation", "Built to be safe, fast and light on your game."],
  ["✨", "Clean, modern & responsive UI", "A polished interface your moderators will actually enjoy using."],
  ["🤖", "Smart AI-powered modules", "Intelligent systems that help your team moderate smarter."],
  ["📋", "Automated punishment tracking", "Every action recorded automatically, so nothing slips through."],
  ["🔔", "Custom Discord webhooks", "Send logs and alerts straight to your own Discord server."],
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="orb -left-20 top-0 h-80 w-80 bg-brand" />
        <div className="orb -right-10 top-40 h-72 w-72 bg-fuchsia-500 [animation-delay:-6s]" />
        <div className="relative mx-auto max-w-6xl px-5 py-28 text-center">
          <div className="reveal float mb-6 flex justify-center drop-shadow-[0_0_40px_rgba(109,94,252,0.55)]">
            <Logo size={128} />
          </div>
          <span className="reveal badge bg-white/5 text-slate-300 backdrop-blur" style={delay(1)}>
            Roblox&apos;s #1 tech group for smart moderation
          </span>
          <h1 className="reveal mx-auto mt-6 max-w-3xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl" style={delay(2)}>
            Welcome to Nosploit
          </h1>
          <p className="reveal mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400" style={delay(3)}>
            Roblox&apos;s #1 tech group specialising in smart moderation systems. Our mission is to help your game&apos;s
            moderators work smoothly and easily. We fully support and provide licenses for everyone, from small independent
            creators to big professional game studios.
          </p>
          <div className="reveal mt-9 flex justify-center" style={delay(4)}>
            <CTAButtons />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="reveal mb-8 text-center text-3xl font-bold text-white">What our products have to offer</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([icon, t, d], i) => (
            <div key={t} className="card card-hover reveal" style={delay(i)}>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand/15 text-xl">{icon}</div>
              <h3 className="font-semibold text-white">{t}</h3>
              <p className="mt-2 text-sm text-slate-400">{d}</p>
            </div>
          ))}
        </div>
        <p className="reveal mt-8 text-center text-slate-400" style={delay(7)}>
          …and more features that you won&apos;t get anywhere else, with new ones being shipped out frequently!
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-24 text-center">
        <div className="card reveal border-brand/30 py-10" style={delay(2)}>
          <p className="text-slate-300">
            Join our Roblox group and Discord server for more information on how we help communities grow, or apply for one of
            our products to make your own project strive today!
          </p>
          <div className="mt-6 flex justify-center"><CTAButtons /></div>
          <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm text-slate-300 underline-offset-4 hover:text-white hover:underline">
            📘 View our portfolio →
          </a>
        </div>
      </section>
    </>
  );
}
