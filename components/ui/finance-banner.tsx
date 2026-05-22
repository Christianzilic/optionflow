import { Phone, ExternalLink } from "lucide-react";

export function FinanceBanner() {
  return (
    <div className="rounded-xl bg-[#0f2240] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div className="text-xs font-semibold tracking-widest text-[#c9a455] uppercase mb-1">Finance Partner</div>
        <p className="text-white font-semibold text-sm">Need construction or development finance?</p>
        <p className="text-slate-400 text-xs mt-0.5">$500K–$50M · All Credit Solutions · 15+ years experience</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <a
          href="https://www.allcreditsolutions.com.au/#contact"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c9a455] hover:bg-[#b8933f] text-[#0f2240] text-xs font-semibold rounded-lg transition-colors"
        >
          Free assessment <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <a
          href="tel:1300165360"
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/20 text-white text-xs font-medium rounded-lg hover:bg-white/10 transition-colors"
        >
          <Phone className="h-3.5 w-3.5" /> 1300 165 360
        </a>
      </div>
    </div>
  );
}
