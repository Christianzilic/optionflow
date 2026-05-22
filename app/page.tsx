import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2, FileText, TrendingUp, CheckCircle, ArrowRight,
  MapPin, Phone, ExternalLink, DollarSign, Clock, Shield, BarChart3,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ── Navigation ── */}
      <header className="bg-[#0f2240] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Building2 className="h-6 w-6 text-[#c9a455]" />
            <span className="text-xl font-bold text-white tracking-tight">OptionFlow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-slate-300">
            <Link href="/marketplace" className="hover:text-white transition-colors">Properties</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
            <Link href="#finance" className="hover:text-white transition-colors">Finance</Link>
            <Link href="/legal/disclaimer" className="hover:text-white transition-colors">Legal</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-[#c9a455] hover:bg-[#b8933f] text-[#0f2240] font-semibold">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="bg-[#0f2240] pt-20 pb-28 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #c9a455 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto relative">
          <Badge className="mb-5 bg-[#c9a455]/20 text-[#c9a455] border-[#c9a455]/30 hover:bg-[#c9a455]/20">
            Australia-wide · All 8 states &amp; territories
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl">
            Unlock your property&apos;s<br />
            <span className="text-[#c9a455]">development potential</span>
          </h1>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl leading-relaxed">
            OptionFlow connects property owners with capital and developers seeking opportunity.
            We acquire call options on developable land across Australia — and arrange development
            finance through our trusted lending partner.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/register?role=homeowner">
              <Button size="lg" className="w-full sm:w-auto bg-[#c9a455] hover:bg-[#b8933f] text-[#0f2240] font-semibold">
                List my property <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register?role=developer">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white">
                Browse as developer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-[#1a3a5c] py-6 border-y border-[#c9a455]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "8", label: "States & territories" },
              { value: "$500K–$50M", label: "Finance available" },
              { value: "15+", label: "Years experience" },
              { value: "$7B+", label: "In settlements" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold text-[#c9a455]">{value}</div>
                <div className="text-xs text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0f2240] mb-3">How it works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">A straightforward process from submission to settlement, with expert support at every step.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-16">
            {/* Homeowners */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-[#0f2240] flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-[#c9a455]" />
                </div>
                <h3 className="text-lg font-semibold text-[#0f2240]">For property owners</h3>
              </div>
              <div className="space-y-6">
                {[
                  { n: 1, title: "Submit your property", desc: "Tell us about your land — location, size, current zoning, and development ideas." },
                  { n: 2, title: "We assess the potential", desc: "Our team reviews development feasibility, planning overlays, and market conditions." },
                  { n: 3, title: "Call option deed executed", desc: "If approved, we enter a call option deed with a small deposit — you retain ownership." },
                  { n: 4, title: "We find a developer", desc: "We market your property to our verified developer network and handle all negotiations." },
                  { n: 5, title: "Deal completes", desc: "The option is assigned to the developer. You receive your agreed sale price." },
                ].map(({ n, title, desc }) => (
                  <div key={n} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0f2240] text-[#c9a455] flex items-center justify-center text-sm font-bold">{n}</div>
                    <div>
                      <div className="font-medium text-[#0f2240]">{title}</div>
                      <div className="text-sm text-slate-500 mt-1">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/register?role=homeowner" className="mt-8 inline-block">
                <Button className="bg-[#0f2240] hover:bg-[#1a3a5c]">
                  List my property <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Developers */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-[#c9a455] flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-[#0f2240]" />
                </div>
                <h3 className="text-lg font-semibold text-[#0f2240]">For developers</h3>
              </div>
              <div className="space-y-6">
                {[
                  { n: 1, title: "Register & get verified", desc: "Create your profile and get verified to access full property analytics and information packs." },
                  { n: 2, title: "Browse curated listings", desc: "Every property has been pre-assessed for development potential and planning feasibility." },
                  { n: 3, title: "Access feasibility data", desc: "FSR, height limits, yield calculations, council overlays, and comparable sales." },
                  { n: 4, title: "Submit an offer", desc: "Submit your offer and deposit structure directly through the platform." },
                  { n: 5, title: "Assignment deed executed", desc: "The call option is assigned to you. Proceed to settlement with the landowner." },
                ].map(({ n, title, desc }) => (
                  <div key={n} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#c9a455]/20 text-[#0f2240] flex items-center justify-center text-sm font-bold">{n}</div>
                    <div>
                      <div className="font-medium text-[#0f2240]">{title}</div>
                      <div className="text-sm text-slate-500 mt-1">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/register?role=developer" className="mt-8 inline-block">
                <Button variant="outline" className="border-[#0f2240] text-[#0f2240] hover:bg-[#0f2240] hover:text-white">
                  Browse properties <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── All Credit Solutions Finance Section ── */}
      <section id="finance" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-4">
            <span className="text-xs font-semibold tracking-widest text-[#c9a455] uppercase">Finance Partner</span>
          </div>
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#0f2240] mb-3">
              Need development finance?
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              OptionFlow works exclusively with <strong className="text-[#0f2240]">All Credit Solutions</strong> — specialist private lending brokers with 15+ years experience and $7B+ in settlements. From $500K to $50M, they arrange funding for the full development lifecycle.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: Building2,
                title: "Construction & Development Finance",
                desc: "Senior and mezzanine construction loans for residential, commercial, and mixed-use projects.",
              },
              {
                icon: Clock,
                title: "Bridging Finance",
                desc: "Short-term bridging solutions to unlock equity or complete time-sensitive acquisitions.",
              },
              {
                icon: DollarSign,
                title: "Commercial & Private Lending",
                desc: "Non-bank and private lending for complex deals that don't fit the traditional mould.",
              },
              {
                icon: BarChart3,
                title: "Equity Release & Restructuring",
                desc: "Unlock equity in existing assets and restructure lending to improve project feasibility.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-slate-200 rounded-xl p-6 hover:border-[#c9a455]/50 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#0f2240] flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-[#c9a455]" />
                </div>
                <h3 className="font-semibold text-[#0f2240] mb-2">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#0f2240] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-xs font-semibold tracking-widest text-[#c9a455] uppercase mb-2">100% Risk Free</div>
              <h3 className="text-2xl font-bold text-white mb-2">See if we can get you better terms</h3>
              <p className="text-slate-300 text-sm max-w-lg">
                Free assessment, no obligation. All Credit Solutions specialise in deals that banks won&apos;t touch — complex, fast, and relationship-driven.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a href="https://www.allcreditsolutions.com.au/#contact" target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#c9a455] hover:bg-[#b8933f] text-[#0f2240] font-semibold whitespace-nowrap">
                  Get free assessment <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="tel:1300165360">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white whitespace-nowrap">
                  <Phone className="mr-2 h-4 w-4" /> 1300 165 360
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── States coverage ── */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl font-semibold text-[#0f2240] mb-2">Operating across all Australian states &amp; territories</h2>
          <p className="text-sm text-slate-400 mb-8">State-specific deed templates for each jurisdiction</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"].map((s) => (
              <div key={s} className="flex items-center gap-1.5 px-5 py-2 border border-slate-200 rounded-full text-sm font-medium text-[#0f2240] hover:border-[#c9a455] hover:text-[#c9a455] transition-colors">
                <MapPin className="h-3.5 w-3.5" /> {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust signals ── */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-10 text-center">
            {[
              {
                icon: FileText,
                title: "Legally documented",
                desc: "State-specific option and assignment deed templates, executed via Docusign e-signature.",
              },
              {
                icon: CheckCircle,
                title: "Transparent process",
                desc: "Track every step of your property's journey — from submission to settlement — in real time.",
              },
              {
                icon: Shield,
                title: "Expert analysis",
                desc: "Development feasibility assessments across all 8 Australian jurisdictions.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-xl bg-[#0f2240] flex items-center justify-center mb-5">
                  <Icon className="h-7 w-7 text-[#c9a455]" />
                </div>
                <h3 className="font-semibold text-[#0f2240] mb-2">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#0f2240] py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-5 w-5 text-[#c9a455]" />
                <span className="text-white font-bold text-lg">OptionFlow</span>
              </div>
              <p className="text-slate-400 text-sm max-w-xs">
                Australian property call option brokerage. Connecting landowners with developers across all states and territories.
              </p>
            </div>
            <div>
              <div className="text-xs font-semibold tracking-widest text-[#c9a455] uppercase mb-3">Finance Partner</div>
              <a href="https://www.allcreditsolutions.com.au" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-[#c9a455] transition-colors font-medium">
                All Credit Solutions <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a href="tel:1300165360" className="text-slate-400 text-sm mt-1 flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone className="h-3.5 w-3.5" /> 1300 165 360
              </a>
            </div>
            <div className="flex flex-col gap-2 text-sm text-slate-400">
              <Link href="/marketplace" className="hover:text-white transition-colors">Properties</Link>
              <Link href="/legal/disclaimer" className="hover:text-white transition-colors">Legal disclaimer</Link>
              <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} OptionFlow. All rights reserved.</span>
            <span className="max-w-sm text-right">
              This platform does not provide legal or financial advice. Always obtain independent legal advice before signing any deed.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
