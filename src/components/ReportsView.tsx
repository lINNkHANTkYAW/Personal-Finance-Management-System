import { useMemo, useState } from "react";
import { FinanceData, Language } from "../types";
import { translations, formatCurrency, translateCategory, fillTemplate } from "../lib/translations";
import {
  FileText,
  Download,
  ArrowUpRight,
  CheckCircle,
} from "lucide-react";

interface ReportsViewProps {
  data: FinanceData;
  language: Language;
  currency?: string;
}

export default function ReportsView({
  data,
  language,
  currency = "USD",
}: ReportsViewProps) {
  const t = translations[language];
  const [reportType, setReportType] = useState<"income_statement" | "balance_sheet">(
    "income_statement"
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthLabel = now.toLocaleString(language === "ja" ? "ja-JP" : "en-US", {
    month: "long",
    year: "numeric",
  });

  const report = useMemo(() => {
    const monthTxs = data.transactions.filter(
      (tx) => tx.status === "completed" && tx.date.startsWith(monthKey)
    );

    const incomeBySource = new Map<string, number>();
    const expenseByCategory = new Map<string, number>();

    for (const tx of monthTxs) {
      if (tx.type === "income") {
        incomeBySource.set(
          tx.merchant || "Income",
          (incomeBySource.get(tx.merchant || "Income") || 0) + tx.amount
        );
      } else if (tx.type === "expense") {
        expenseByCategory.set(
          tx.category || "Uncategorized",
          (expenseByCategory.get(tx.category || "Uncategorized") || 0) + tx.amount
        );
      }
    }

    const incomeLines = Array.from(incomeBySource.entries())
      .map(([label, amount]) => ({ label, amount }))
      .sort((a, b) => b.amount - a.amount);
    const expenseLines = Array.from(expenseByCategory.entries())
      .map(([label, amount]) => ({
        label: translateCategory(label, language),
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);

    const totalIncome = incomeLines.reduce((s, l) => s + l.amount, 0);
    const totalExpenses = expenseLines.reduce((s, l) => s + l.amount, 0);
    const netSurplus = totalIncome - totalExpenses;

    const assetAccounts = data.accounts.filter((a) => a.type !== "credit");
    const liabilityAccounts = data.accounts.filter((a) => a.type === "credit");
    const investmentTotal = data.investments.reduce(
      (s, i) => s + (i.totalValue || 0),
      0
    );

    const assetLines = [
      ...assetAccounts.map((a) => ({
        label: a.name,
        amount: a.balance,
      })),
      ...(investmentTotal > 0
        ? [
            {
              label: t.investmentPortfolio,
              amount: investmentTotal,
            },
          ]
        : []),
    ];

    const liabilityLines = liabilityAccounts.map((a) => ({
      label: a.name,
      amount: Math.abs(a.balance),
    }));

    // Unpaid bills counted as near-term liabilities
    const unpaidBills = data.bills
      .filter((b) => b.status !== "paid")
      .reduce((s, b) => s + b.amount, 0);
    if (unpaidBills > 0) {
      liabilityLines.push({
        label: t.unpaidBillsLiability,
        amount: unpaidBills,
      });
    }

    const totalAssets = assetLines.reduce((s, l) => s + l.amount, 0);
    const totalLiabilities = liabilityLines.reduce((s, l) => s + l.amount, 0);
    const netPosition = totalAssets - totalLiabilities;

    return {
      incomeLines,
      expenseLines,
      totalIncome,
      totalExpenses,
      netSurplus,
      assetLines,
      liabilityLines,
      totalAssets,
      totalLiabilities,
      netPosition,
    };
  }, [data, language, monthKey, t.investmentPortfolio, t.unpaidBillsLiability]);

  const money = (n: number) => formatCurrency(n, currency, language);

  const handleExport = () => {
    setIsExporting(true);
    setExportDone(false);

    try {
      const lines: string[] = [];
      lines.push("ELYSIAN WEALTH REPORTING");
      lines.push(`Period: ${monthLabel}`);
      lines.push(`Generated: ${new Date().toISOString()}`);
      lines.push("");

      if (reportType === "income_statement") {
        lines.push("INCOME STATEMENT");
        lines.push("--- Income ---");
        if (report.incomeLines.length === 0) {
          lines.push("(none)");
        } else {
          report.incomeLines.forEach((l) =>
            lines.push(`${l.label}\t${l.amount.toFixed(2)}`)
          );
        }
        lines.push(`TOTAL INCOME\t${report.totalIncome.toFixed(2)}`);
        lines.push("--- Expenses ---");
        if (report.expenseLines.length === 0) {
          lines.push("(none)");
        } else {
          report.expenseLines.forEach((l) =>
            lines.push(`${l.label}\t${l.amount.toFixed(2)}`)
          );
        }
        lines.push(`TOTAL EXPENSES\t${report.totalExpenses.toFixed(2)}`);
        lines.push(`NET SURPLUS\t${report.netSurplus.toFixed(2)}`);
      } else {
        lines.push("BALANCE SHEET");
        lines.push("--- Assets ---");
        if (report.assetLines.length === 0) {
          lines.push("(none)");
        } else {
          report.assetLines.forEach((l) =>
            lines.push(`${l.label}\t${l.amount.toFixed(2)}`)
          );
        }
        lines.push(`TOTAL ASSETS\t${report.totalAssets.toFixed(2)}`);
        lines.push("--- Liabilities ---");
        if (report.liabilityLines.length === 0) {
          lines.push("(none)");
        } else {
          report.liabilityLines.forEach((l) =>
            lines.push(`${l.label}\t${l.amount.toFixed(2)}`)
          );
        }
        lines.push(`TOTAL LIABILITIES\t${report.totalLiabilities.toFixed(2)}`);
        lines.push(`NET POSITION\t${report.netPosition.toFixed(2)}`);
      }

      const blob = new Blob([lines.join("\n")], {
        type: "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `elysian-${reportType}-${monthKey}.txt`;
      a.click();
      URL.revokeObjectURL(url);

      setExportDone(true);
      setTimeout(() => setExportDone(false), 2000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-sans font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText className="text-emerald-500" size={18} />
            {t.reports}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {fillTemplate(t.reportsSubtitle, { period: monthLabel })}
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-850 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs py-2 px-4 rounded-xl transition-all shadow-sm disabled:opacity-50"
        >
          {isExporting ? (
            <>{t.exporting}</>
          ) : exportDone ? (
            <span className="flex items-center gap-1 text-emerald-500">
              <CheckCircle size={14} /> {t.downloaded}
            </span>
          ) : (
            <>
              <Download size={14} /> {t.exportStatement}
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
              <span className="block font-bold">{t.incomeStatement}</span>
              <span className="text-[10px] text-slate-400 font-normal">
                {t.incomeStatementDesc}
              </span>
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
              <span className="block font-bold">{t.balanceSheet}</span>
              <span className="text-[10px] text-slate-400 font-normal">
                {t.balanceSheetDesc}
              </span>
            </div>
            <ArrowUpRight size={14} className="text-emerald-500" />
          </button>
        </div>

        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-8 shadow-sm font-mono text-[11px] text-slate-600 dark:text-slate-400 overflow-x-auto">
          <div className="min-w-[500px] space-y-6">
            <div className="flex justify-between items-start border-b border-dashed border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase">
                  {t.reportBrand}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {t.periodLabel}: {monthLabel.toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p>{t.runDate}: {new Date().toLocaleDateString()}</p>
                <p>{t.sourceLive}</p>
              </div>
            </div>

            {reportType === "income_statement" ? (
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block uppercase">
                  {t.sectionIncome}
                </span>

                <div className="space-y-2">
                  {report.incomeLines.length === 0 ? (
                    <p className="text-slate-400">
                      {t.noIncomeMonth}
                    </p>
                  ) : (
                    report.incomeLines.map((line) => (
                      <div key={line.label} className="flex justify-between">
                        <span>{line.label}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {money(line.amount)}
                        </span>
                      </div>
                    ))
                  )}
                  <div className="flex justify-between font-bold text-slate-850 dark:text-slate-100 border-t border-dashed border-slate-200 dark:border-slate-800 pt-1.5">
                    <span>{t.totalOperatingIncome}</span>
                    <span>{money(report.totalIncome)}</span>
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block uppercase pt-3">
                  {t.sectionExpenses}
                </span>
                <div className="space-y-2">
                  {report.expenseLines.length === 0 ? (
                    <p className="text-slate-400">
                      {t.noExpensesMonth}
                    </p>
                  ) : (
                    report.expenseLines.map((line) => (
                      <div key={line.label} className="flex justify-between">
                        <span>{line.label}</span>
                        <span>{money(line.amount)}</span>
                      </div>
                    ))
                  )}
                  <div className="flex justify-between font-bold text-slate-850 dark:text-slate-100 border-t border-dashed border-slate-200 dark:border-slate-800 pt-1.5">
                    <span>{t.totalExpensesLabel}</span>
                    <span>{money(report.totalExpenses)}</span>
                  </div>
                </div>

                <div
                  className={`border-t border-double border-slate-300 dark:border-slate-700 pt-3 flex justify-between font-extrabold text-xs ${
                    report.netSurplus >= 0 ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  <span>{t.netSurplus}</span>
                  <span>
                    {report.netSurplus >= 0 ? "+" : ""}
                    {money(report.netSurplus)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block uppercase">
                  {t.sectionAssets}
                </span>

                <div className="space-y-2">
                  {report.assetLines.length === 0 ? (
                    <p className="text-slate-400">
                      {t.noAssetAccounts}
                    </p>
                  ) : (
                    report.assetLines.map((line) => (
                      <div key={line.label} className="flex justify-between">
                        <span>{line.label}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {money(line.amount)}
                        </span>
                      </div>
                    ))
                  )}
                  <div className="flex justify-between font-bold text-slate-850 dark:text-slate-100 border-t border-dashed border-slate-200 dark:border-slate-800 pt-1.5">
                    <span>{t.totalAssetsLabel}</span>
                    <span>{money(report.totalAssets)}</span>
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block uppercase pt-3">
                  {t.sectionLiabilities}
                </span>
                <div className="space-y-2">
                  {report.liabilityLines.length === 0 ? (
                    <p className="text-slate-400">
                      {t.noLiabilities}
                    </p>
                  ) : (
                    report.liabilityLines.map((line) => (
                      <div key={line.label} className="flex justify-between">
                        <span>{line.label}</span>
                        <span>{money(line.amount)}</span>
                      </div>
                    ))
                  )}
                  <div className="flex justify-between font-bold text-slate-850 dark:text-slate-100 border-t border-dashed border-slate-200 dark:border-slate-800 pt-1.5">
                    <span>{t.totalLiabilitiesLabel}</span>
                    <span>{money(report.totalLiabilities)}</span>
                  </div>
                </div>

                <div
                  className={`border-t border-double border-slate-300 dark:border-slate-700 pt-3 flex justify-between font-extrabold text-xs ${
                    report.netPosition >= 0 ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  <span>{t.netPosition}</span>
                  <span>
                    {report.netPosition >= 0 ? "+" : ""}
                    {money(report.netPosition)}
                  </span>
                </div>
              </div>
            )}

            <p className="text-[9px] text-center text-slate-400 dark:text-slate-500 border-t border-slate-150 dark:border-slate-800 pt-4">
              {t.reportFooter}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
