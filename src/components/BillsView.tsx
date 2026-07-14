import React, { useState } from "react";
import { FinanceData, UpcomingBill, Language } from "../types";
import { translations, formatCurrency } from "../lib/translations";
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Info,
  CreditCard,
  UserCheck
} from "lucide-react";

interface BillsViewProps {
  data: FinanceData;
  language: Language;
  currency?: string;
  onUpdateData: (data: FinanceData) => void;
}

export default function BillsView({
  data,
  language,
  currency = "USD",
  onUpdateData
}: BillsViewProps) {
  const t = translations[language];
  const [showAddBill, setShowAddBill] = useState(false);
  const [billName, setBillName] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [billDueDate, setBillDueDate] = useState("");
  const [billCategory, setBillCategory] = useState("Utilities");
  const [billUrgency, setBillUrgency] = useState<"low" | "medium" | "high">("medium");

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!billName || !billAmount || !billDueDate) return;

    try {
      const response = await fetch("/api/finance/bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: billName,
          amount: parseFloat(billAmount),
          dueDate: billDueDate,
          category: billCategory,
          urgency: billUrgency
        })
      });

      if (response.ok) {
        const fresh = await response.json();
        onUpdateData(fresh);
        setBillName("");
        setBillAmount("");
        setBillDueDate("");
        setShowAddBill(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayBill = async (billId: string) => {
    const bill = data.bills.find(b => b.id === billId);
    if (!bill) return;

    // Deduct amount from checking balance
    const checking = data.accounts.find(a => a.type === "checking");
    if (checking && checking.balance < bill.amount) {
      alert(t.insufficientBillFunds);
      return;
    }

    const updatedBills = data.bills.map(b => {
      if (b.id === billId) {
        return { ...b, status: "paid" as const };
      }
      return b;
    });

    const updatedAccounts = data.accounts.map(acc => {
      if (acc.type === "checking") {
        return { ...acc, balance: acc.balance - bill.amount };
      }
      return acc;
    });

    // Create record transaction
    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      merchant: `Bill Pay: ${bill.name}`,
      category: bill.category,
      paymentMethod: "Checking Auto-Draft",
      amount: bill.amount,
      status: "completed" as const,
      type: "expense" as const
    };

    const updatedData: FinanceData = {
      ...data,
      bills: updatedBills,
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
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-sans font-bold text-base text-slate-800 dark:text-slate-100">
            {t.bills}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {t.billsSubtitle}
          </p>
        </div>

        <button
          onClick={() => setShowAddBill(!showAddBill)}
          className="flex items-center gap-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs py-1.5 px-3 rounded-xl transition-colors shadow-sm"
        >
          <Plus size={14} /> {t.addBill}
        </button>
      </div>

      {showAddBill && (
        <form 
          onSubmit={handleCreateBill}
          className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-4 max-w-md"
        >
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {t.registerInvoice}
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                {t.billName}
              </label>
              <input
                type="text"
                value={billName}
                onChange={(e) => setBillName(e.target.value)}
                placeholder={t.billNamePlaceholder}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                  {t.amount}
                </label>
                <input
                  type="number"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                  {t.dueDate}
                </label>
                <input
                  type="date"
                  value={billDueDate}
                  onChange={(e) => setBillDueDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                  {t.category}
                </label>
                <select
                  value={billCategory}
                  onChange={(e) => setBillCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 focus:outline-none"
                >
                  <option value="Utilities">{t.utilities}</option>
                  <option value="Entertainment">{t.entertainment}</option>
                  <option value="Housing">{t.housing}</option>
                  <option value="Transportation">{t.transport}</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                  {t.urgency}
                </label>
                <select
                  value={billUrgency}
                  onChange={(e: any) => setBillUrgency(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 focus:outline-none"
                >
                  <option value="low">{t.low}</option>
                  <option value="medium">{t.medium}</option>
                  <option value="high">{t.high}</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowAddBill(false)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="text-xs px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
            >
              {t.addUpcomingBill}
            </button>
          </div>
        </form>
      )}

      {/* Bills Ledger List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main List */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-6 space-y-4">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            {t.billsListTitle}
          </h4>
          <div className="space-y-3">
            {data.bills.map((bill) => {
              const isPaid = bill.status === "paid";
              const isOverdue = bill.status === "overdue" || (new Date(bill.dueDate) < new Date() && !isPaid);
              const urgencyText =
                bill.urgency === "high" ? t.high : bill.urgency === "medium" ? t.medium : t.low;

              return (
                <div 
                  key={bill.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isPaid 
                      ? "border-emerald-100 bg-emerald-50/[0.03] dark:border-emerald-950/20" 
                      : isOverdue
                      ? "border-red-150 bg-red-50/[0.02] dark:border-red-950/20"
                      : "border-slate-150 dark:border-slate-800 bg-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`p-2.5 rounded-xl ${
                      isPaid 
                        ? "bg-emerald-500/10 text-emerald-500" 
                        : isOverdue 
                        ? "bg-red-500/10 text-red-500" 
                        : "bg-amber-500/10 text-amber-500"
                    }`}>
                      <Calendar size={16} />
                    </div>
                    <div className="min-w-0">
                      <span className={`font-sans font-bold text-sm block truncate ${isPaid ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200"}`}>
                        {bill.name}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase mt-0.5 block">
                        {t.duePrefix}: {bill.dueDate} • {bill.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className={`font-sans font-extrabold text-sm block ${isPaid ? "text-slate-400" : "text-slate-800 dark:text-slate-100"}`}>
                        {formatCurrency(bill.amount, currency, language)}
                      </span>
                      <span className={`text-[10px] uppercase font-extrabold block ${
                        isPaid 
                          ? "text-emerald-500" 
                          : bill.urgency === "high" 
                          ? "text-red-500" 
                          : "text-amber-500"
                      }`}>
                        {isPaid ? t.paid : `${urgencyText} ${t.urgencyLabel}`}
                      </span>
                    </div>

                    {!isPaid && (
                      <button
                        onClick={() => handlePayBill(bill.id)}
                        className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors"
                      >
                        {t.markAsPaid}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side: Summary stats */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
              {t.billsOverview}
            </h4>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">{t.totalUpcomingBills}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {data.bills.filter(b=>b.status!=='paid').length} {t.billsCount}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">{t.totalUnpaid}</span>
                <span className="font-extrabold text-red-500">
                  {formatCurrency(data.bills.filter(b=>b.status!=='paid').reduce((sum, b) => sum + b.amount, 0), currency, language)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">{t.totalPaidBills}</span>
                <span className="font-extrabold text-emerald-500">
                  {formatCurrency(data.bills.filter(b=>b.status==='paid').reduce((sum, b) => sum + b.amount, 0), currency, language)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed flex gap-2">
            <Info size={14} className="text-emerald-500 shrink-0 mt-0.5" />
            <p>
              {t.billsInfo}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
