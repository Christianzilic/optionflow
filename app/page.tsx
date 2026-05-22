import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Logo bar */}
      <header className="absolute top-0 left-0 right-0 z-20 px-8 py-6 flex items-center justify-between">
        <span className="text-2xl font-bold text-white tracking-tight">Devbud.</span>
        <Link
          href="/login"
          className="text-sm text-white/70 hover:text-white transition-colors"
        >
          Sign in
        </Link>
      </header>

      {/* Split hero */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Seller side */}
        <Link
          href="/sell"
          className="group relative flex-1 flex flex-col items-center justify-center px-10 py-32 bg-[#0f2240] overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f2240] to-[#1a3a5c] transition-opacity" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#1a3a5c] to-[#0f2240]" />
          <div className="relative z-10 text-center max-w-sm">
            <div className="inline-block px-3 py-1 bg-[#c9a455]/20 text-[#c9a455] text-xs font-semibold tracking-widest uppercase rounded-full mb-6">
              Property owners
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
              Sell your<br />property with<br />
              <span className="text-[#c9a455]">confidence.</span>
            </h2>
            <p className="text-slate-300 text-base mb-8 leading-relaxed">
              We purchase properties directly, handle all the paperwork, and move fast — no agents, no stress.
            </p>
            <div className="inline-flex items-center gap-2 bg-[#c9a455] text-[#0f2240] font-semibold px-6 py-3 rounded-full group-hover:gap-3 transition-all">
              Get an offer <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>

        {/* Divider */}
        <div className="hidden md:flex items-center justify-center w-px bg-white/10 relative">
          <div className="absolute bg-white/10 rounded-full w-10 h-10 flex items-center justify-center text-white/40 text-xs font-medium">
            or
          </div>
        </div>
        <div className="flex md:hidden items-center justify-center h-px bg-white/10 relative mx-0">
          <div className="absolute bg-[#0f2240] px-3 text-white/40 text-xs font-medium">or</div>
        </div>

        {/* Developer side */}
        <Link
          href="/develop"
          className="group relative flex-1 flex flex-col items-center justify-center px-10 py-32 bg-white overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 transition-opacity" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-slate-50 to-white" />
          <div className="relative z-10 text-center max-w-sm">
            <div className="inline-block px-3 py-1 bg-[#0f2240]/10 text-[#0f2240] text-xs font-semibold tracking-widest uppercase rounded-full mb-6">
              Developers
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0f2240] leading-tight mb-5">
              Find your next<br />development<br />
              <span className="text-[#c9a455]">opportunity.</span>
            </h2>
            <p className="text-slate-500 text-base mb-8 leading-relaxed">
              Browse our curated marketplace of pre-assessed development sites across every Australian state.
            </p>
            <div className="inline-flex items-center gap-2 bg-[#0f2240] text-white font-semibold px-6 py-3 rounded-full group-hover:gap-3 transition-all">
              Browse listings <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      </div>

      {/* Footer strip */}
      <div className="bg-[#0a1828] py-4 px-8 flex items-center justify-between text-xs text-slate-500">
        <span>© {new Date().getFullYear()} Devbud. All rights reserved.</span>
        <div className="flex gap-5">
          <Link href="/legal/disclaimer" className="hover:text-slate-300 transition-colors">Legal</Link>
          <Link href="/legal/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
        </div>
      </div>
    </div>
  );
}
