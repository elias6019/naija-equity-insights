import { BRAND_NAME, NGX_MACRO, MARQUEE_TICKERS } from '../constants';
import { MagnifyingGlass, Bell, List, TrendUp, TrendDown, Gauge } from '@phosphor-icons/react';

function TickerMarquee() {
  const items = [...MARQUEE_TICKERS, ...MARQUEE_TICKERS];
  return (
    <div className="w-full overflow-hidden border-b border-border/50 bg-card/40">
      <div className="flex animate-marquee gap-8 py-1.5 text-xs font-mono">
        {items.map((t, i) => (
          <span key={`${t.symbol}-${i}`} className="flex items-center gap-2 shrink-0">
            <span className="font-semibold text-foreground/80">{t.symbol}</span>
            <span className="tabular-nums text-foreground/60">₦{t.price.toLocaleString()}</span>
            <span className={`flex items-center gap-0.5 tabular-nums ${t.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {t.change >= 0 ? <TrendUp size={10} weight="bold" /> : <TrendDown size={10} weight="bold" />}
              {t.change >= 0 ? '+' : ''}{t.change}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function MacroBadges() {
  const badges = [
    { label: 'ASI', value: NGX_MACRO.ASI.toLocaleString(), change: `+${NGX_MACRO.ASI_CHANGE}%`, up: true },
    { label: 'MPR', value: `${NGX_MACRO.MPR}%`, sub: 'CBN Rate' },
    { label: 'INFLATION', value: `${NGX_MACRO.INFLATION}%`, sub: 'YoY' },
    { label: 'NIBOR', value: `${NGX_MACRO.NIBOR}%`, sub: 'Overnight' },
    { label: 'FX', value: `₦${NGX_MACRO.FX_RATE}`, sub: 'USD/NGN' },
  ];
  return (
    <div className="hidden md:flex items-center gap-3">
      {badges.map((b) => (
        <div key={b.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 border border-border/40">
          <span className="text-[10px] font-mono font-medium text-muted-foreground tracking-wider">{b.label}</span>
          <span className="text-xs font-mono font-semibold tabular-nums text-foreground/90">{b.value}</span>
          {b.change && (
            <span className={`text-[10px] font-mono tabular-nums ${b.up ? 'text-emerald-400' : 'text-red-400'}`}>{b.change}</span>
          )}
          {b.sub && <span className="text-[9px] text-muted-foreground/60">{b.sub}</span>}
        </div>
      ))}
    </div>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-6 h-14 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors">
            <List size={20} className="text-foreground/80" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center animate-pulse-glow">
              <Gauge size={18} className="text-emerald-400" weight="fill" />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">{BRAND_NAME}</span>
          </div>
          <span className="hidden sm:block text-[10px] font-mono text-muted-foreground/60 px-2 py-0.5 rounded-full border border-border/40">
            {NGX_MACRO.DATE}
          </span>
        </div>

        <div className="flex-1 flex justify-center px-4">
          <MacroBadges />
        </div>

        <div className="flex items-center gap-1.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/40 text-muted-foreground text-xs">
            <MagnifyingGlass size={14} />
            <span className="text-muted-foreground/60">Search tickers...</span>
            <kbd className="hidden lg:inline-flex text-[10px] px-1 py-0.5 rounded bg-muted text-muted-foreground/60 font-mono">⌘K</kbd>
          </div>
          <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors relative">
            <Bell size={18} className="text-foreground/70" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-ticker-blink" />
          </button>
        </div>
      </div>
      <TickerMarquee />
    </header>
  );
}