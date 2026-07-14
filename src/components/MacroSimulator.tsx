import { useState, useMemo } from 'react';
import { NGX_MACRO, MACRO_FORECAST } from '../constants';
import {
  Calculator, Percent, ChartBar, CurrencyCircleDollar,
  ArrowLeft, ArrowRight, TrendUp, TrendDown, Lightning, Clock
} from '@phosphor-icons/react';

type Scenario = 'current' | 'optimistic' | 'hawkish';

const SCENARIO_MAP: Record<Scenario, { mpr: number; inflation: number; label: string; desc: string }> = {
  current: { mpr: NGX_MACRO.MPR, inflation: NGX_MACRO.INFLATION, label: 'Current', desc: 'Base case — July 2026 rates' },
  optimistic: { mpr: 24.00, inflation: 12.10, label: 'Q1 2027', desc: 'MPR easing, inflation moderating' },
  hawkish: { mpr: 28.00, inflation: 17.50, label: 'Hawkish', desc: 'MPR hike, persistent inflation' },
};

export default function MacroSimulator() {
  const [investment, setInvestment] = useState(5_000_000);
  const [tenure, setTenure] = useState(12);
  const [scenario, setScenario] = useState<Scenario>('current');
  const [showBreakdown, setShowBreakdown] = useState(false);

  const projection = useMemo(() => {
    const s = SCENARIO_MAP[scenario];
    const monthlyRate = s.mpr / 12 / 100;
    const futureValue = investment * Math.pow(1 + monthlyRate, tenure);
    const totalReturn = futureValue - investment;
    const realReturn = totalReturn * (1 - s.inflation / 100);
    const effectiveYield = (futureValue / investment - 1) * 100;
    return { futureValue, totalReturn, realReturn, effectiveYield, mpr: s.mpr, inflation: s.inflation };
  }, [investment, tenure, scenario]);

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvestment(Number(e.target.value));
  };

  const formatNaira = (n: number) =>
    `₦${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <section className="space-y-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Macro Simulator</h2>
          <p className="text-xs text-muted-foreground/70 mt-0.5">
            Model investment returns under different monetary policy scenarios
          </p>
        </div>
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/40 bg-muted/30 text-xs text-muted-foreground hover:bg-muted/50 transition-colors"
        >
          <ChartBar size={14} />
          {showBreakdown ? 'Simple' : 'Breakdown'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Controls — left 2 cols */}
        <div className="lg:col-span-2 space-y-4 p-4 rounded-xl border border-border/40 bg-card/40">
          {/* Investment Amount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground/80 flex items-center gap-1.5">
                <CurrencyCircleDollar size={14} className="text-emerald-400" />
                Investment Amount
              </label>
              <span className="text-sm font-mono font-semibold tabular-nums text-foreground">
                {formatNaira(investment)}
              </span>
            </div>
            <input
              type="range"
              min={100000}
              max={50000000}
              step={100000}
              value={investment}
              onChange={handleSlider}
              className="w-full h-1.5 rounded-full appearance-none bg-muted/50 outline-none accent-emerald-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground/50 mt-1">
              <span>₦100K</span>
              <span>₦50M</span>
            </div>
          </div>

          {/* Tenure */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground/80 flex items-center gap-1.5">
                <Clock size={14} className="text-emerald-400" />
                Tenure
              </label>
              <span className="text-sm font-mono font-semibold tabular-nums text-foreground">
                {tenure} months
              </span>
            </div>
            <div className="flex gap-1.5">
              {[3, 6, 12, 24, 36].map((m) => (
                <button
                  key={m}
                  onClick={() => setTenure(m)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    tenure === m
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-muted/30 text-muted-foreground border border-border/40 hover:bg-muted/50'
                  }`}
                >
                  {m < 12 ? `${m}mo` : `${m / 12}y`}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario selector */}
          <div>
            <label className="text-xs font-medium text-muted-foreground/80 flex items-center gap-1.5 mb-2">
              <Lightning size={14} className="text-emerald-400" />
              Policy Scenario
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.entries(SCENARIO_MAP) as [Scenario, typeof SCENARIO_MAP['current']][]).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setScenario(key)}
                  className={`p-2 rounded-lg text-left transition-all ${
                    scenario === key
                      ? 'bg-emerald-500/10 border border-emerald-500/30'
                      : 'bg-muted/20 border border-border/40 hover:bg-muted/40'
                  }`}
                >
                  <div className="text-xs font-semibold text-foreground/80">{val.label}</div>
                  <div className="text-[10px] text-muted-foreground/60 mt-0.5">MPR {val.mpr}%</div>
                  <div className="text-[10px] text-muted-foreground/60">Inf {val.inflation}%</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results — right 3 cols */}
        <div className="lg:col-span-3 space-y-3">
          {/* Main result card */}
          <div className="p-5 rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10">
            <div className="flex items-center gap-2 text-xs text-emerald-400/70 mb-1">
              <Calculator size={14} />
              Projected Return
            </div>
            <div className="text-2xl font-bold tabular-nums text-foreground">
              {formatNaira(projection.futureValue)}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className={`flex items-center gap-1 text-xs font-mono tabular-nums ${
                projection.totalReturn >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {projection.totalReturn >= 0 ? <TrendUp size={12} /> : <TrendDown size={12} />}
                {projection.totalReturn >= 0 ? '+' : ''}{formatNaira(projection.totalReturn)}
              </span>
              <span className="text-xs text-muted-foreground/60">
                Effective yield: <span className="font-mono tabular-nums text-emerald-400">{projection.effectiveYield.toFixed(2)}%</span>
              </span>
            </div>
          </div>

          {/* Breakdown cards */}
          {showBreakdown && (
            <div className="grid grid-cols-3 gap-3 animate-slide-up">
              <div className="p-3 rounded-xl border border-border/40 bg-card/40">
                <div className="text-[10px] text-muted-foreground/60 mb-1">Nominal Return</div>
                <div className="text-sm font-semibold font-mono tabular-nums text-foreground/90">
                  {formatNaira(projection.totalReturn)}
                </div>
              </div>
              <div className="p-3 rounded-xl border border-border/40 bg-card/40">
                <div className="text-[10px] text-muted-foreground/60 mb-1">Real Return (inflation-adj)</div>
                <div className="text-sm font-semibold font-mono tabular-nums text-foreground/90">
                  {formatNaira(projection.realReturn)}
                </div>
              </div>
              <div className="p-3 rounded-xl border border-border/40 bg-card/40">
                <div className="text-[10px] text-muted-foreground/60 mb-1">Effective Yield</div>
                <div className="text-sm font-semibold font-mono tabular-nums text-emerald-400">
                  {projection.effectiveYield.toFixed(2)}%
                </div>
              </div>
            </div>
          )}

          {/* Macro forecast reference */}
          <div className="p-3 rounded-xl border border-border/40 bg-card/40">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 mb-2">
              <Percent size={12} />
              Policy Rate Outlook
            </div>
            <div className="flex gap-2">
              {Object.entries(MACRO_FORECAST).map(([q, data]) => (
                <div key={q} className="flex-1 px-2 py-1.5 rounded-lg bg-muted/20">
                  <div className="text-[10px] font-medium text-muted-foreground/80">{q.replace('_', ' ')}</div>
                  <div className="text-xs font-mono tabular-nums text-foreground/80 mt-0.5">MPR {data.mpr}%</div>
                  <div className="text-[10px] font-mono tabular-nums text-muted-foreground/60">Inf {data.inflation}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}