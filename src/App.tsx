import Navbar from './components/Navbar';
import SectorBoard from './components/SectorBoard';
import MacroSimulator from './components/MacroSimulator';
import { BRAND_NAME, NGX_MACRO } from './constants';
import { Gauge, ChartLine, CurrencyCircleDollar, Percent } from '@phosphor-icons/react';

function HeroStatCard({ icon: Icon, label, value, sub, color }: {
  icon: typeof Gauge; label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="p-3 rounded-xl border border-border/40 bg-card/40 hover:bg-card/60 transition-colors group">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon size={16} className={color || 'text-emerald-400'} weight="duotone" />
        <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-lg font-bold font-mono tabular-nums text-foreground group-hover:text-emerald-400 transition-colors">
        {value}
      </div>
      {sub && <div className="text-[10px] text-muted-foreground/50 mt-0.5">{sub}</div>}
    </div>
  );
}

function HeroSection() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Nigeria Market Pulse
          </h1>
          <p className="text-xs text-muted-foreground/60 mt-0.5">
            Real-time ASI, monetary policy, and sector-level analytics for the Nigerian Exchange
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <HeroStatCard
          icon={Gauge}
          label="ASI"
          value={NGX_MACRO.ASI.toLocaleString()}
          sub={`+${NGX_MACRO.ASI_CHANGE}% today`}
          color="text-emerald-400"
        />
        <HeroStatCard
          icon={Percent}
          label="MPR"
          value={`${NGX_MACRO.MPR}%`}
          sub="Monetary Policy Rate"
          color="text-amber-400"
        />
        <HeroStatCard
          icon={ChartLine}
          label="Inflation"
          value={`${NGX_MACRO.INFLATION}%`}
          sub="YoY (June 2026)"
          color="text-rose-400"
        />
        <HeroStatCard
          icon={CurrencyCircleDollar}
          label="Market Cap"
          value={`₦${NGX_MACRO.MARKET_CAP}T`}
          sub="NGX Main Board"
          color="text-blue-400"
        />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/30 pt-4 pb-6 mt-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
          <Gauge size={12} className="text-emerald-400" />
          <span>{BRAND_NAME} · Data as of {NGX_MACRO.DATE}</span>
        </div>
        <div className="text-[10px] text-muted-foreground/40">
          For analytical purposes only. Not financial advice.
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8">
        <HeroSection />
        <SectorBoard />
        <MacroSimulator />
        <Footer />
      </main>
    </div>
  );
}