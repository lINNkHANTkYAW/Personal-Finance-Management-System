import React, { useState } from "react";
import { FinanceData, Investment, Language } from "../types";
import { translations, formatCurrency } from "../lib/translations";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  Plus, 
  Briefcase,
  Layers,
  Percent,
  RefreshCw
} from "lucide-react";

interface InvestmentsViewProps {
  data: FinanceData;
  language: Language;
  onUpdateData: (data: FinanceData) => void;
}

export default function InvestmentsView({
  data,
  language,
  onUpdateData
}: InvestmentsViewProps) {
  const t = translations[language];
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [sharesAmount, setSharesAmount] = useState("");

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !sharesAmount) return;

    const sharesToTrade = parseFloat(sharesAmount);
    if (isNaN(sharesToTrade) || sharesToTrade <= 0) return;

    const asset = data.investments.find(inv => inv.id === selectedAssetId);
    if (!asset) return;

    const cost = asset.currentPrice * sharesToTrade;
    const checking = data.accounts.find(a => a.type === "checking");

    if (tradeType === "buy" && checking && checking.balance < cost) {
      alert("Insufficient funds in Chase Checking!");
      return;
    }

    const updatedInvestments = data.investments.map(inv => {
      if (inv.id === selectedAssetId) {
        const newShares = tradeType === "buy" ? inv.shares + sharesToTrade : Math.max(0, inv.shares - sharesToTrade);
        const newValue = newShares * inv.currentPrice;
        const newProfitLoss = tradeType === "buy" ? inv.totalProfitLoss : inv.totalProfitLoss - (cost * 0.1); // simulated
        return {
          ...inv,
          shares: newShares,
          totalValue: newValue,
          totalProfitLoss: newProfitLoss
        };
      }
      return inv;
    });

    const updatedAccounts = data.accounts.map(acc => {
      if (acc.type === "checking") {
        return {
          ...acc,
          balance: tradeType === "buy" ? acc.balance - cost : acc.balance + cost
        };
      }
      return acc;
    });

    // Create a transaction ledger
    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      merchant: `${tradeType === "buy" ? "Bought" : "Sold"} ${sharesToTrade.toFixed(2)} shares of ${asset.symbol}`,
      category: "Investments",
      paymentMethod: "Robinhood Balance",
      amount: cost,
      status: "completed" as const,
      type: tradeType === "buy" ? ("expense" as const) : ("income" as const)
    };

    const updatedData: FinanceData = {
      ...data,
      investments: updatedInvestments,
      accounts: updatedAccounts,
      transactions: [newTx, ...data.transactions]
    };

    try {
      const response = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const fresh = await response.json();
        onUpdateData(fresh);
        setSharesAmount("");
        setSelectedAssetId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulatePriceFlukes = () => {
    // Modify investment prices randomly to simulate a real-time market tracker fluctuation!
    const updated = data.investments.map(inv => {
      const fluctuation = (Math.random() - 0.48) * 0.05; // -2.4% to +2.6%
      const newPrice = Math.round(inv.currentPrice * (1 + fluctuation) * 100) / 100;
      const newChange = Math.round(fluctuation * 10000) / 100;
      const newSparkline = [...inv.sparkline.slice(1), newPrice];
      return {
        ...inv,
        currentPrice: newPrice,
        todayChangePercent: newChange,
        totalValue: inv.shares * newPrice,
        sparkline: newSparkline
      };
    });

    const updatedData = { ...data, investments: updated };
    onUpdateData(updatedData);
  };

  const totalPortfolioValue = data.investments.reduce((sum, i) => sum + i.totalValue, 0);

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-sans font-bold text-base text-slate-800 dark:text-slate-100">
            {t.investments}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Brokerage portfolio tracking, asset allocation, and simulator trades
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSimulatePriceFlukes}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800 transition-colors shadow-sm"
          >
            <RefreshCw size={12} className="animate-spin-slow" /> Fluctuate Markets
          </button>
        </div>
      </div>

      {/* Investment Value Header Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-850 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Portfolio Net Valuation
          </span>
          <h4 className="font-sans font-extrabold text-3xl mt-1">
            {formatCurrency(totalPortfolioValue, "USD", language)}
          </h4>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
            <ArrowUpRight size={14} /> +12.4% overall returns (+${(totalPortfolioValue * 0.12).toFixed(2)})
          </p>
        </div>
        <div className="p-4 bg-slate-800 rounded-xl flex items-center gap-4 border border-slate-700/50">
          <div className="text-center px-2">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Asset Class</span>
            <span className="text-xs font-extrabold mt-0.5 block">Stocks & Crypto</span>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div className="text-center px-2">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Security Level</span>
            <span className="text-xs font-extrabold text-emerald-400 mt-0.5 block">High Stability</span>
          </div>
        </div>
      </div>

      {/* Trading Modal/Popover Simulator */}
      {selectedAssetId && (
        <form 
          onSubmit={handleTrade}
          className="p-5 border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/[0.05] rounded-2xl max-w-md space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase size={14} className="text-emerald-500" /> Trade Asset: {data.investments.find(i => i.id === selectedAssetId)?.symbol}
            </h4>
            <button 
              type="button" 
              onClick={() => setSelectedAssetId(null)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                Transaction Type
              </label>
              <select
                value={tradeType}
                onChange={(e: any) => setTradeType(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold"
              >
                <option value="buy">BUY</option>
                <option value="sell">SELL</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                Share Quantity
              </label>
              <input
                type="number"
                step="0.001"
                value={sharesAmount}
                onChange={(e) => setSharesAmount(e.target.value)}
                placeholder="0.00"
                className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
          >
            Execute {tradeType.toUpperCase()} Simulation Trade
          </button>
        </form>
      )}

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.investments.map((inv) => {
          const isUp = inv.todayChangePercent >= 0;
          const displaySymbolName = 
            inv.symbol === "AAPL" ? t.appleStock :
            inv.symbol === "BTC" ? t.bitcoin :
            inv.symbol === "SPY" ? t.sp500 :
            t.gold;

          // Compute custom SVG points for sparkline chart
          const sparkMax = Math.max(...inv.sparkline);
          const sparkMin = Math.min(...inv.sparkline);
          const points = inv.sparkline.map((val, idx) => {
            const x = (idx / (inv.sparkline.length - 1)) * 120;
            const y = sparkMax === sparkMin ? 20 : 35 - ((val - sparkMin) / (sparkMax - sparkMin)) * 25;
            return `${x},${y}`;
          }).join(" ");

          return (
            <div 
              key={inv.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 block">
                      {displaySymbolName}
                    </span>
                    <span className="text-[10px] text-emerald-500 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase mt-0.5 inline-block">
                      {inv.symbol}
                    </span>
                  </div>
                  
                  {/* Miniature Sparkline path graph */}
                  <svg className="w-24 h-10 overflow-visible">
                    <polyline
                      fill="none"
                      stroke={isUp ? "#10B981" : "#EF4444"}
                      strokeWidth="2.5"
                      points={points}
                    />
                  </svg>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium uppercase">Price</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">
                      {formatCurrency(inv.currentPrice, "USD", language)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium uppercase">{t.change}</span>
                    <span className={`font-extrabold flex items-center justify-end gap-0.5 ${
                      isUp ? "text-emerald-500" : "text-red-500"
                    }`}>
                      {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {inv.todayChangePercent}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium uppercase">{t.value}</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">
                      {formatCurrency(inv.totalValue, "USD", language)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium uppercase">{t.profitLoss}</span>
                    <span className="font-extrabold text-emerald-500">
                      +{formatCurrency(inv.totalProfitLoss, "USD", language)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedAssetId(inv.id)}
                className="w-full mt-4 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 rounded-xl transition-colors"
              >
                Buy / Sell
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
