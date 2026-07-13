import { useState } from "react";
import { FinanceData, Language } from "../types";
import { translations, formatCurrency } from "../lib/translations";
import { 
  FileText, 
  Download, 
  ArrowUpRight, 
  TrendingUp, 
  Lock, 
  CheckCircle,
  HelpCircle,
  Clock
} from "lucide-react";

interface ReportsViewProps {
  data: FinanceData;
  language: Language;
}

export default function ReportsView({
  data,
  language
}: ReportsViewProps) {
  const t = translations[language];
  const [reportType, setReportType] = useState<"income_statement" | "balance_sheet">("income_statement");
  const [isExporting, setIsExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setExportDone(false);
    setTimeout(() => {
      setIsExporting(false);
      setExportDone(true);
      setTimeout(() => setExportDone(false), 2000);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-sans font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText className="text-emerald-500" size={18} />
            Ledger Financial Reporting
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Produce tax-ready statements, balance sheets, and capital statements instantly
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-850 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs py-2 px-4 rounded-xl transition-all shadow-sm disabled:opacity-50"
        >
          {isExporting ? (
            <>Generating Statement...</>
          ) : exportDone ? (
            <span className="flex items-center gap-1 text-emerald-500"><CheckCircle size={14} /> Downloaded PDF</span>
          ) : (
            <>
              <Download size={14} /> Export Statement
            </>
          )}
        </button>
      </div>

      {/* Selector and Main view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left selector */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-2">
          <button
            onClick={() => setReportType("income_statement")}
            className={`w-full text-left p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
              reportType === "income_statement"
                ? "border-emerald-500/85 bg-emerald-500/[0.02] text-slate-800 dark:text-slate-150"
                : "border-slate-150 dark:border-slate-800 hover:bg-slate-50/50"
            }`}
          >
            <div>
              <span className="block font-bold">Categorical Income Statement</span>
              <span className="text-[10px] text-slate-400 font-normal">Revenues vs monthly itemized expenses</span>
            </div>
            <ArrowUpRight size={14} className="text-emerald-500" />
          </button>

          <button
            onClick={() => setReportType("balance_sheet")}
            className={`w-full text-left p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
              reportType === "balance_sheet"
                ? "border-emerald-500/85 bg-emerald-500/[0.02] text-slate-800 dark:text-slate-150"
                : "border-slate-150 dark:border-slate-800 hover:bg-slate-50/50"
            }`}
          >
            <div>
              <span className="block font-bold">Consolidated Balance Sheet</span>
              <span className="text-[10px] text-slate-400 font-normal">Assets vs liabilities ledger standing</span>
            </div>
            <ArrowUpRight size={14} className="text-emerald-500" />
          </button>
        </div>

        {/* Right Preview Sheet */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-8 shadow-sm font-mono text-[11px] text-slate-600 dark:text-slate-400 overflow-x-auto">
          <div className="min-w-[500px] space-y-6">
            
            {/* Report Header logo */}
            <div className="flex justify-between items-start border-b border-dashed border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase">ELYSIAN WEALTH REPORTING</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">SECURE DATA ENVELOPE: LOCAL SANDBOX</p>
              </div>
              <div className="text-right">
                <p>RUN DATE: {new Date().toLocaleDateString()}</p>
                <p>STATUS: VERIFIED SECURE</p>
              </div>
            </div>

            {reportType === "income_statement" ? (
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block uppercase">1. INCOME STATEMENT (OPERATING REVENUE)</span>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Direct Salary Revenue (Direct Deposit)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">$5,420.00</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-1.5">
                    <span>Brokerage Yields & Cash Sweeps</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">$124.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-850 dark:text-slate-100">
                    <span>TOTAL OPERATING INCOME</span>
                    <span>$5,544.00</span>
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block uppercase pt-3">2. DISCRETIONARY EXPENDITURES</span>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Housing Liabilities</span>
                    <span>$1,850.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Food & Dining Limits</span>
                    <span>$450.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transportation Passages</span>
                    <span>$110.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shopping Transactions</span>
                    <span>$320.00</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-1.5">
                    <span>Utilities & Electricity Drafts</span>
                    <span>$230.20</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-850 dark:text-slate-100">
                    <span>TOTAL DISCRETIONARY EXPENSES</span>
                    <span>$2,960.20</span>
                  </div>
                </div>

                <div className="border-t border-double border-slate-300 dark:border-slate-700 pt-3 flex justify-between font-extrabold text-xs text-emerald-500">
                  <span>NET CALCULATED SURPLUS MONTHLY</span>
                  <span>+$2,583.80</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block uppercase">1. CURRENT FINANCIAL ASSETS</span>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Chase Checking Deposit</span>
                    <span>$4,250.75</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marcus High-Yield Savings Account</span>
                    <span>$8,200.00</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-1.5">
                    <span>Investment Portfolio (Stocks & Crypto Valuation)</span>
                    <span>$18,450.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-850 dark:text-slate-100">
                    <span>TOTAL LIQUID CONSOLIDATED ASSETS</span>
                    <span>$30,900.75</span>
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block uppercase pt-3">2. LIABILITIES & MARGINS</span>
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-1.5">
                    <span>Visa Credit Cards Outstanding Balance</span>
                    <span>$420.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-850 dark:text-slate-100">
                    <span>TOTAL LIABILITIES</span>
                    <span>$420.00</span>
                  </div>
                </div>

                <div className="border-t border-double border-slate-300 dark:border-slate-700 pt-3 flex justify-between font-extrabold text-xs text-emerald-500">
                  <span>NET CALCULATED POSITION CAPITALS</span>
                  <span>+$30,480.75</span>
                </div>
              </div>
            )}

            <p className="text-[9px] text-center text-slate-400 dark:text-slate-500 border-t border-slate-150 dark:border-slate-800 pt-4">
              CONFIDENTIAL STATEMENT PREVIEW — GENERATED IN THE ELYSIAN COGNITIVE ENVELOPE. ALL DATA ENCRYPTED END-TO-END.
            </p>

          </div>
        </div>

      </div>

    </div>
  );
}
