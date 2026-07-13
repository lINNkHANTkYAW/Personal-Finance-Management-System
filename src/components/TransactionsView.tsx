import React, { useState } from "react";
import { FinanceData, Transaction, Language } from "../types";
import { translations, formatCurrency, translateCategory } from "../lib/translations";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Plus, 
  CreditCard, 
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingDown
} from "lucide-react";

interface TransactionsViewProps {
  data: FinanceData;
  language: Language;
  onUpdateData: (data: FinanceData) => void;
}

export default function TransactionsView({
  data,
  language,
  onUpdateData
}: TransactionsViewProps) {
  const t = translations[language];
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [showAddTx, setShowAddTx] = useState(false);
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [paymentMethod, setPaymentMethod] = useState("Visa Credit");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [txType, setTxType] = useState<"expense" | "income">("expense");

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant || !amount) return;

    try {
      const response = await fetch("/api/finance/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant,
          amount: parseFloat(amount),
          category,
          paymentMethod,
          date,
          type: txType,
          status: "completed"
        })
      });

      if (response.ok) {
        const freshData = await response.json();
        onUpdateData(freshData);
        // Reset form
        setMerchant("");
        setAmount("");
        setShowAddTx(false);
      }
    } catch (err) {
      console.error("Failed to save transaction:", err);
    }
  };

  const filteredTransactions = data.transactions.filter((tx) => {
    const matchesSearch = tx.merchant.toLowerCase().includes(search.toLowerCase()) ||
                          tx.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = filter === "all" || tx.type === filter;
    const matchesCategory = categoryFilter === "all" || tx.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const categories = Array.from(new Set(data.transactions.map((t) => t.category)));

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-sans font-bold text-base text-slate-800 dark:text-slate-100">
            {t.recentTransactions}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Audit and filter ledger of transactions and cash flows
          </p>
        </div>

        <button
          onClick={() => setShowAddTx(!showAddTx)}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs py-2 px-4 rounded-xl transition-all duration-250 shadow-md shadow-emerald-500/10"
        >
          <Plus size={14} /> Add Transaction
        </button>
      </div>

      {/* Inline Add Transaction Form */}
      {showAddTx && (
        <form 
          onSubmit={handleAddTransaction}
          className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-4"
        >
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Record New Ledger Entry
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            
            {/* Merchant */}
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                {t.merchant}
              </label>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="Merchant Name"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 focus:outline-none"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                {t.type}
              </label>
              <select
                value={txType}
                onChange={(e: any) => setTxType(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value="expense">{t.expense}</option>
                <option value="income">{t.income}</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                {t.amount}
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 focus:outline-none"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                {t.category}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value="Food">{t.food}</option>
                <option value="Shopping">{t.shopping}</option>
                <option value="Transportation">{t.transport}</option>
                <option value="Entertainment">{t.entertainment}</option>
                <option value="Utilities">{t.utilities}</option>
                <option value="Healthcare">{t.healthcare}</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                {t.date}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowAddTx(false)}
              className="text-xs px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-500 dark:text-slate-400 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center gap-1 shadow-sm shadow-emerald-500/10"
            >
              <Plus size={14} /> Add Transaction
            </button>
          </div>
        </form>
      )}

      {/* Filter Controls Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Segmented Type Filter */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl w-fit">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === "all"
                ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            {t.all}
          </button>
          <button
            onClick={() => setFilter("income")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === "income"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            {t.income}
          </button>
          <button
            onClick={() => setFilter("expense")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === "expense"
                ? "bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            {t.expense}
          </button>
        </div>

        {/* Filters and search input */}
        <div className="flex flex-1 items-center gap-3 justify-end">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search merchants, categories..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none"
            />
          </div>

          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-xl px-3 py-1.5 pr-8 font-semibold text-slate-600 dark:text-slate-400 cursor-pointer focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c.toLowerCase()}>
                  {translateCategory(c, language)}
                </option>
              ))}
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</span>
          </div>
        </div>

      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/10 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <th className="py-3 px-5">{t.date}</th>
                <th className="py-3 px-5">{t.merchant}</th>
                <th className="py-3 px-5">{t.category}</th>
                <th className="py-3 px-5">{t.paymentMethod}</th>
                <th className="py-3 px-5">{t.status}</th>
                <th className="py-3 px-5 text-right">{t.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No transactions found matching active filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr 
                    key={tx.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors"
                  >
                    <td className="py-3.5 px-5 font-semibold text-slate-500">
                      {tx.date}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-800 dark:text-slate-200">
                      {tx.merchant}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {translateCategory(tx.category, language)}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <CreditCard size={12} /> {tx.paymentMethod}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.status === "completed" 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : tx.status === "pending"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}>
                        {tx.status === "completed" && <CheckCircle2 size={10} />}
                        {tx.status === "pending" && <Clock size={10} />}
                        {tx.status === "failed" && <XCircle size={10} />}
                        {tx.status}
                      </span>
                    </td>
                    <td className={`py-3.5 px-5 text-right font-extrabold font-mono ${
                      tx.type === "income" ? "text-emerald-500" : "text-slate-850 dark:text-slate-200"
                    }`}>
                      {tx.type === "income" ? "+" : "-"}
                      {formatCurrency(tx.amount, "USD", language)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
