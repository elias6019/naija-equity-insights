import { useState, useMemo } from 'react';
import { SECTORS, STOCK_TICKERS } from '../constants';
import {
  MagnifyingGlass, SlidersHorizontal, ArrowsDownUp,
  Star, Bank, Buildings, Factory, GasPump, DeviceMobile,
  CaretUp, CaretDown, ArrowUp, ArrowDown
} from '@phosphor-icons/react';

const sectorIcons: Record<string, typeof Bank> = {
  banking: Bank, 'oil-gas': GasPump, consumer: Buildings,
  industrial: Factory, telecom: DeviceMobile,
};

const sectorColors: Record<string, string> = {
  banking: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'oil-gas': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  consumer: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  industrial: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  telecom: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

type SortField = 'symbol' | 'price' | 'change' | 'volume' | 'pe' | 'yield';
type SortDir = 'asc' | 'desc';

function formatVolume(v: string) {
  if (v.endsWith('M')) return parseInt(v) * 1_000_000;
  if (v.endsWith('B')) return parseInt(v) * 1_000_000_000;
  return parseInt(v);
}

export default function SectorBoard() {
  const [activeSector, setActiveSector] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('change');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = activeSector
      ? STOCK_TICKERS.filter((t) => t.sector === activeSector)
      : [...STOCK_TICKERS];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'symbol') cmp = a.symbol.localeCompare(b.symbol);
      else if (sortField === 'price') cmp = a.price - b.price;
      else if (sortField === 'change') cmp = a.change - b.change;
      else if (sortField === 'volume') cmp = formatVolume(a.volume) - formatVolume(b.volume);
      else if (sortField === 'pe') cmp = a.pe - b.pe;
      else if (sortField === 'yield') cmp = a.yield - b.yield;
      return sortDir === 'desc' ? -cmp : cmp;
    });
    return list;
  }, [activeSector, search, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  return (
    <section className="space-y-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Sector Board</h2>
          <p className="text-xs text-muted-foreground/70 mt-0.5">
            {filtered.length} securities tracked across {SECTORS.length} sectors
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/40 bg-muted/30 text-xs text-muted-foreground hover:bg-muted/50 transition-colors"
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>
      </div>

      {/* Sector pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveSector(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            !activeSector
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : 'bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/50'
          }`}
        >
          All
        </button>
        {SECTORS.map((s) => {
          const Icon = sectorIcons[s.id];
          return (
            <button
              key={s.id}
              onClick={() => setActiveSector(s.id === activeSector ? null : s.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                s.id === activeSector
                  ? sectorColors[s.id]
                  : 'bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/50'
              }`}
            >
              <Icon size={12} />
              {s.name}
            </button>
          );
        })}
      </div>

      {/* Search bar */}
      {showFilters && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/20 border border-border/40">
          <MagnifyingGlass size={14} className="text-muted-foreground/60" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by symbol or company name..."
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 outline-none"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border/40 bg-card/40">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border/30">
              {[
                { key: 'symbol', label: 'Symbol' },
                { key: 'price', label: 'Price' },
                { key: 'change', label: 'Chg %' },
                { key: 'volume', label: 'Volume' },
                { key: 'pe', label: 'P/E' },
                { key: 'yield', label: 'Div Yield' },
                { key: 'sector', label: 'Sector' },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key as SortField)}
                  className="px-3 py-2.5 text-left font-medium text-muted-foreground/70 cursor-pointer hover:text-foreground/80 transition-colors group"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] uppercase tracking-wider">{col.label}</span>
                    {sortField === col.key && (
                      sortDir === 'desc' ? <CaretDown size={10} weight="fill" className="text-emerald-400" /> : <CaretUp size={10} weight="fill" className="text-emerald-400" />
                    )}
                    {sortField !== col.key && <ArrowsDownUp size={10} className="opacity-0 group-hover:opacity-40 transition-opacity" />}
                  </div>
                </th>
              ))}
              <th className="px-3 py-2.5 w-10" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((ticker) => {
              const isUp = ticker.change >= 0;
              const SectorIcon = sectorIcons[ticker.sector];
              return (
                <tr
                  key={ticker.symbol}
                  className="border-b border-border/20 hover:bg-muted/20 transition-colors group"
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-sm">{ticker.symbol}</span>
                      <span className="text-muted-foreground/50 text-[10px] hidden lg:inline truncate max-w-[140px]">{ticker.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 font-mono tabular-nums text-foreground/90">
                    ₦{ticker.price.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center gap-1 font-mono tabular-nums text-xs font-medium ${
                      isUp ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {isUp ? <ArrowUp size={10} weight="bold" /> : <ArrowDown size={10} weight="bold" />}
                      {isUp ? '+' : ''}{ticker.change}%
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-mono tabular-nums text-muted-foreground/80">{ticker.volume}</td>
                  <td className="px-3 py-2.5 font-mono tabular-nums text-muted-foreground/80">{ticker.pe}x</td>
                  <td className="px-3 py-2.5 font-mono tabular-nums text-emerald-400/80">{ticker.yield}%</td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${sectorColors[ticker.sector]}`}>
                      <SectorIcon size={10} />
                      {SECTORS.find((s) => s.id === ticker.sector)?.name}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <button className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-muted/50 transition-all">
                      <Star size={12} className="text-muted-foreground/50 hover:text-amber-400" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-8 text-center text-xs text-muted-foreground/50">
            No matching securities found
          </div>
        )}
      </div>
    </section>
  );
}