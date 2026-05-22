import Link from "next/link";
import { ArrowRight, BarChart3, Building2, CheckCircle, DollarSign, ExternalLink, MapPin, Phone, Search, Shield } from "lucide-react";

export default function DevelopPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Nav */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="text-xl font-bold text-[#0f2240] tracking-tight">Devbud.</Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-slate-500">
          <Link href="#how" className="hover:text-[#0f2240] transition-colors">How it works</Link>
          <Link href="#finance" className="hover:text-[#0f2240] transition-colors">Finance</Link>
          <Link href="/marketplace" className="hover:text-[#0f2240] transition-colors">Browse listings</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/sell" className="text-sm text-slate-400 hover:text-slate-600 transition-colors hidden sm:block">
            I&apos;m a seller →
          </Link>
          <Link href="/login" className="text-sm text-slate-500 hover:text-[#0f2240] transition-colors">Sign in</Link>
          <Link
            href="/register?role=developer"
            className="bg-[#0f2240] hover:bg-[#1a3a5c] text-white font-semibold text-sm px-5 py-2 rounded-full transition-colors"
          >
            Register free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-20 pb-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c9a455] text-sm font-semibold tracking-widest uppercase mb-4">For developers</p>
          <h1 className="text-5xl md:text-7xl font-bold text-[#0f2240] leading-none mb-6 max-w-3xl">
            Australia&apos;s developer<br />property marketplace.
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mb-10 leading-relaxed">
            Curated, pre-assessed development sites across all 8 states and territories. Every listing has been reviewed for development feasibility before it reaches you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center gap-2 bg-[#0f2240] hover:bg-[#1a3a5c] text-white font-bold text-base px-8 py-4 rounded-full transition-colors"
            >
              Browse listings <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/register?role=developer"
              className="inline-flex items-center justify-center gap-2 border border-[#0f2240]/20 text-[#0f2240] text-base px-8 py-4 rounded-full hover:bg-slate-50 transition-colors"
            >
              Create free account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-slate-50 border-y border-slate-100 py-6">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "Pre-assessed", label: "Every listing reviewed" },
            { value: "All 8", label: "States & territories" },
            { value: "$500K–$50M", label: "Finance available" },
            { value: "Verified", label: "Developer network" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-xl font-bold text-[#0f2240]">{value}</div>
              <div className="text-xs text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c9a455] text-sm font-semibold tracking-widest uppercase mb-3">The process</p>
          <h2 className="text-4xl font-bold text-[#0f2240] mb-16">From register to site acquisition.</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { n: "01", title: "Register & get verified", desc: "Create your free profile. Once verified, you unlock full property data, feasibility reports, and direct access to make offers." },
              { n: "02", title: "Browse curated listings", desc: "Every property has been reviewed for development potential. Filter by state, size, zoning, and price." },
              { n: "03", title: "Access the data room", desc: "Verified developers get FSR, height limits, yield calcs, council overlays, and comparable sales for each site." },
              { n: "04", title: "Submit & secure", desc: "Submit your offer through the platform. We handle negotiations and documentation. You proceed to settlement." },
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

      {/* What you get */}
      <section className="py-20 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0f2240] mb-12 text-center">What verified developers get</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Search, title: "Curated listings only", desc: "No junk. Every property has been assessed before it hits the marketplace." },
              { icon: BarChart3, title: "Full feasibility data", desc: "FSR, height limits, gross floor area, yield modelling, planning overlays, and comparable sales." },
              { icon: Building2, title: "Direct purchase pathway", desc: "Clear, documented process from offer to settlement — no agent layers or opaque negotiations." },
              { icon: Shield, title: "Exclusive access", desc: "Some sites never go to market. Verified developers get first look at off-market opportunities." },
              { icon: DollarSign, title: "Finance arranged", desc: "Development finance from $500K to $50M arranged by our partner All Credit Solutions." },
              { icon: MapPin, title: "Australia-wide", desc: "NSW, VIC, QLD, WA, SA, TAS, ACT and NT — state-specific documentation for every jurisdiction." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#c9a455]/50 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#0f2240] flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-[#c9a455]" />
                </div>
                <h3 className="font-bold text-[#0f2240] mb-2 text-sm">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Finance section */}
      <section id="finance" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0f2240] rounded-3xl p-10 md:p-14">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-[#c9a455] text-xs font-semibold tracking-widest uppercase mb-3">Finance Partner</p>
                <h2 className="text-3xl font-bold text-white mb-4">Need construction or development finance?</h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Devbud. works exclusively with <strong className="text-white">All Credit Solutions</strong> — specialist private lending brokers with 15+ years experience and $7B+ in settlements. From $500K to $50M.
                </p>
                <div className="space-y-2 mb-8">
                  {["Construction & development finance", "Bridging finance", "Commercial & private lending", "Equity release & restructuring"].map((s) => (
                    <div key={s} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="h-4 w-4 text-[#c9a455] shrink-0" /> {s}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="https://www.allcreditsolutions.com.au/#contact" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#c9a455] hover:bg-[#b8933f] text-[#0f2240] font-bold text-sm px-6 py-3 rounded-full transition-colors">
                    Free assessment <ExternalLink className="h-4 w-4" />
                  </a>
                  <a href="tel:1300165360"
                    className="inline-flex items-center gap-2 border border-white/20 text-white text-sm px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
                    <Phone className="h-4 w-4" /> 1300 165 360
                  </a>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-center">
                  <div className="text-6xl font-bold text-white mb-2">$7B+</div>
                  <div className="text-slate-400 text-sm">In settlements</div>
                  <div className="mt-8 text-5xl font-bold text-[#c9a455] mb-2">15+</div>
                  <div className="text-slate-400 text-sm">Years experience</div>
                  <div className="mt-8 text-3xl font-bold text-white mb-2">100%</div>
                  <div className="text-slate-400 text-sm">Risk free assessment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 border-t border-slate-100 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#0f2240] mb-4">Ready to find your next site?</h2>
          <p className="text-slate-500 mb-8">Register free in minutes. Get verified and start browsing today.</p>
          <Link
            href="/register?role=developer"
            className="inline-flex items-center gap-2 bg-[#0f2240] hover:bg-[#1a3a5c] text-white font-bold text-base px-10 py-4 rounded-full transition-colors"
          >
            Create free account <ArrowRight className="h-5 w-5" />
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
