import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, Shield, DollarSign, Phone, MapPin } from "lucide-react";

export default function SellPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Nav */}
      <header className="bg-[#0f2240] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">Devbud.</Link>
        <div className="flex items-center gap-4">
          <Link href="/develop" className="text-sm text-slate-300 hover:text-white transition-colors hidden sm:block">
            I&apos;m a developer →
          </Link>
          <Link
            href="/register?role=homeowner"
            className="bg-[#c9a455] hover:bg-[#b8933f] text-[#0f2240] font-semibold text-sm px-5 py-2 rounded-full transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#0f2240] px-6 pt-20 pb-28 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-5 pointer-events-none"
          style={{ background: "radial-gradient(circle at 80% 50%, #c9a455, transparent 60%)" }} />
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c9a455] text-sm font-semibold tracking-widest uppercase mb-4">For property owners</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-none mb-6 max-w-2xl">
            We purchase<br />with confidence.
          </h1>
          <p className="text-slate-300 text-lg max-w-xl mb-10 leading-relaxed">
            Skip the agents, the open homes, and the uncertainty. Devbud. buys directly from you — fast, fair, and fully handled.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/register?role=homeowner"
              className="inline-flex items-center justify-center gap-2 bg-[#c9a455] hover:bg-[#b8933f] text-[#0f2240] font-bold text-base px-8 py-4 rounded-full transition-colors"
            >
              Get your offer <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="tel:1300165360"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white text-base px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              <Phone className="h-4 w-4" /> Talk to us
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1a3a5c] py-6">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
          {[
            { value: "48hrs", label: "Typical offer turnaround" },
            { value: "All 8", label: "States & territories" },
            { value: "Zero", label: "Agent fees" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl font-bold text-[#c9a455]">{value}</div>
              <div className="text-xs text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c9a455] text-sm font-semibold tracking-widest uppercase mb-3">The process</p>
          <h2 className="text-4xl font-bold text-[#0f2240] mb-16">Simple. Fast. Certain.</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { n: "01", title: "Tell us about your property", desc: "Submit your details online in under 5 minutes. Location, size, your situation." },
              { n: "02", title: "We assess & make an offer", desc: "Our team reviews your property and comes back with a direct purchase offer." },
              { n: "03", title: "Paperwork handled for you", desc: "We manage the legal documents. You review and sign — no solicitor stress." },
              { n: "04", title: "Settlement on your timeline", desc: "We move to settlement when it suits you. You get your money." },
            ].map(({ n, title, desc }) => (
              <div key={n}>
                <div className="text-5xl font-bold text-[#0f2240]/10 mb-4 leading-none">{n}</div>
                <h3 className="font-bold text-[#0f2240] mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Devbud */}
      <section className="py-20 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0f2240] mb-12 text-center">Why sell through Devbud.?</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: DollarSign, title: "No agent commissions", desc: "You keep more of your sale price. No 2–3% commissions walking out the door." },
              { icon: Clock, title: "Move fast when you need to", desc: "Traditional sales take months. We can move within weeks if the situation calls for it." },
              { icon: Shield, title: "Certainty over chaos", desc: "No open inspections. No finance fall-throughs. No gazumping. A firm buyer from day one." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-slate-200 rounded-2xl p-7 hover:border-[#c9a455]/50 hover:shadow-md transition-all">
                <div className="w-11 h-11 rounded-xl bg-[#0f2240] flex items-center justify-center mb-5">
                  <Icon className="h-5 w-5 text-[#c9a455]" />
                </div>
                <h3 className="font-bold text-[#0f2240] mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we buy */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#c9a455] text-sm font-semibold tracking-widest uppercase mb-3">What we buy</p>
            <h2 className="text-3xl font-bold text-[#0f2240] mb-6">We look for land with development potential</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              We're most active in properties with potential for residential or mixed-use development — corner blocks, large lots, older homes on prime land, and infill sites across metropolitan areas.
            </p>
            <div className="space-y-3">
              {[
                "Corner blocks & large residential lots",
                "Sites with subdivision potential",
                "Older homes on prime development land",
                "Commercial or mixed-use zoned properties",
                "Metropolitan and growth corridor locations",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle className="h-4 w-4 text-[#c9a455] shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="bg-[#0f2240] rounded-2xl p-8 text-white">
              <div className="flex flex-wrap gap-2 mb-6">
                {["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"].map((s) => (
                  <div key={s} className="flex items-center gap-1 px-3 py-1.5 border border-white/20 rounded-full text-xs font-medium text-slate-300">
                    <MapPin className="h-3 w-3 text-[#c9a455]" /> {s}
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-300 mb-1">Buying across all Australian states &amp; territories</p>
              <p className="text-xs text-slate-500">State-specific documentation handled for every jurisdiction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0f2240] py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to get your offer?</h2>
          <p className="text-slate-300 mb-8">No obligation. No pressure. Just a straightforward conversation about your property.</p>
          <Link
            href="/register?role=homeowner"
            className="inline-flex items-center gap-2 bg-[#c9a455] hover:bg-[#b8933f] text-[#0f2240] font-bold text-base px-10 py-4 rounded-full transition-colors"
          >
            Submit my property <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1828] py-6 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <span>© {new Date().getFullYear()} Devbud. All rights reserved.</span>
        <div className="flex gap-5">
          <Link href="/legal/disclaimer" className="hover:text-slate-300 transition-colors">Legal disclaimer</Link>
          <Link href="/legal/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
