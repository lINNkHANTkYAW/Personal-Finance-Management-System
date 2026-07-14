export interface TranslationDict {
  dashboard: string;
  accounts: string;
  transactions: string;
  budgets: string;
  savingsGoals: string;
  investments: string;
  bills: string;
  analytics: string;
  aiInsights: string;
  reports: string;
  settings: string;
  searchPlaceholder: string;
  notifications: string;
  currentBalance: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  savingsRate: string;
  aiFinancialAdvisor: string;
  financialHealthScore: string;
  quickActions: string;
  addExpense: string;
  addIncome: string;
  transferMoney: string;
  createBudget: string;
  scanReceipt: string;
  recentTransactions: string;
  date: string;
  merchant: string;
  category: string;
  paymentMethod: string;
  amount: string;
  status: string;
  action: string;
  type: string;
  completed: string;
  pending: string;
  failed: string;
  income: string;
  expense: string;
  all: string;
  filter: string;
  food: string;
  shopping: string;
  transport: string;
  entertainment: string;
  utilities: string;
  healthcare: string;
  housing: string;
  travel: string;
  salary: string;
  insurance: string;
  emergencyFund: string;
  vacation: string;
  newLaptop: string;
  target: string;
  saved: string;
  completedPercent: string;
  appleStock: string;
  bitcoin: string;
  sp500: string;
  gold: string;
  value: string;
  change: string;
  profitLoss: string;
  dueSoon: string;
  overdue: string;
  paid: string;
  unpaid: string;
  markAsPaid: string;
  healthLabel: string;
  dbConfig: string;
  dbHost: string;
  dbName: string;
  connectDatabase: string;
  connected: string;
  disconnected: string;
  currencySelector: string;
  lightMode: string;
  darkMode: string;
  advisorQuote1: string;
  advisorQuote2: string;
  advisorQuote3: string;
  advisorQuote4: string;
  uploadAreaTitle: string;
  uploadAreaSubtitle: string;
  processing: string;
  extractedDetails: string;
  addTxButton: string;
  tax: string;
  receiptPreview: string;
}

export const translations: Record<"en" | "ja", TranslationDict> = {
  en: {
    dashboard: "Dashboard",
    accounts: "Accounts",
    transactions: "Transactions",
    budgets: "Budgets",
    savingsGoals: "Savings Goals",
    investments: "Investments",
    bills: "Bills",
    analytics: "Analytics",
    aiInsights: "AI Insights",
    reports: "Reports",
    settings: "Settings",
    searchPlaceholder: "Search transactions, reports, insights...",
    notifications: "Notifications",
    currentBalance: "Current Balance",
    monthlyIncome: "Monthly Income",
    monthlyExpenses: "Monthly Expenses",
    savingsRate: "Savings Rate",
    aiFinancialAdvisor: "AI Financial Advisor",
    financialHealthScore: "Financial Health Score",
    quickActions: "Quick Actions",
    addExpense: "Add Expense",
    addIncome: "Add Income",
    transferMoney: "Transfer Money",
    createBudget: "Create Budget",
    scanReceipt: "Scan Receipt",
    recentTransactions: "Recent Transactions",
    date: "Date",
    merchant: "Merchant",
    category: "Category",
    paymentMethod: "Payment Method",
    amount: "Amount",
    status: "Status",
    action: "Action",
    type: "Type",
    completed: "Completed",
    pending: "Pending",
    failed: "Failed",
    income: "Income",
    expense: "Expense",
    all: "All",
    filter: "Filter",
    food: "Food",
    shopping: "Shopping",
    transport: "Transportation",
    entertainment: "Entertainment",
    utilities: "Utilities",
    healthcare: "Healthcare",
    housing: "Housing",
    travel: "Travel",
    salary: "Salary",
    insurance: "Insurance",
    emergencyFund: "Emergency Fund",
    vacation: "Vacation",
    newLaptop: "New Laptop",
    target: "Target",
    saved: "Saved",
    completedPercent: "completed",
    appleStock: "Apple Stock",
    bitcoin: "Bitcoin",
    sp500: "S&P 500 ETF",
    gold: "Gold ETF",
    value: "Value",
    change: "Change",
    profitLoss: "P&L",
    dueSoon: "Due Soon",
    overdue: "Overdue",
    paid: "Paid",
    unpaid: "Unpaid",
    markAsPaid: "Mark as Paid",
    healthLabel: "Excellent",
    dbConfig: "Docker PostgreSQL Settings",
    dbHost: "Database Host",
    dbName: "Database Name",
    connectDatabase: "Test Docker DB Connection",
    connected: "Docker PostgreSQL Connected",
    disconnected: "Local Sandbox DB (Offline fallback active)",
    currencySelector: "Currency Selector",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    advisorQuote1: "You spent 18% more on restaurants this month.",
    advisorQuote2: "You could save approximately $240/month by reducing subscription expenses.",
    advisorQuote3: "Your savings rate has improved by 9% compared to last month.",
    advisorQuote4: "Your emergency fund is on track to reach its goal in 3 months.",
    uploadAreaTitle: "Drag and drop your receipt here",
    uploadAreaSubtitle: "Supports PDF, PNG, JPG up to 10MB • Uses Gemini 3.5 OCR",
    processing: "Processing receipt with Gemini OCR...",
    extractedDetails: "Automatically Extracted Details",
    addTxButton: "Save to Transactions Log",
    tax: "Tax Included",
    receiptPreview: "Receipt Scan Live Preview"
  },
  ja: {
    dashboard: "ダッシュボード",
    accounts: "口座一覧",
    transactions: "取引明細",
    budgets: "予算管理",
    savingsGoals: "貯蓄目標",
    investments: "投資ポートフォリオ",
    bills: "請求書・支払",
    analytics: "分析チャート",
    aiInsights: "AIインサイト",
    reports: "月次レポート",
    settings: "システム設定",
    searchPlaceholder: "取引、レポート、インサイトを検索...",
    notifications: "通知履歴",
    currentBalance: "総資産残高",
    monthlyIncome: "今月の収入",
    monthlyExpenses: "今月の支出",
    savingsRate: "貯蓄率",
    aiFinancialAdvisor: "AIファイナンシャルアドバイザー",
    financialHealthScore: "財務健全性スコア",
    quickActions: "クイックアクション",
    addExpense: "支出を追加",
    addIncome: "収入を追加",
    transferMoney: "資金移動",
    createBudget: "予算を設定",
    scanReceipt: "レシートスキャン",
    recentTransactions: "最近の取引明細",
    date: "日付",
    merchant: "加盟店",
    category: "カテゴリー",
    paymentMethod: "支払方法",
    amount: "金額",
    status: "ステータス",
    action: "アクション",
    type: "種別",
    completed: "完了",
    pending: "保留中",
    failed: "失敗",
    income: "収入",
    expense: "支出",
    all: "すべて",
    filter: "フィルター",
    food: "食費",
    shopping: "買い物",
    transport: "交通費",
    entertainment: "エンタメ",
    utilities: "光熱費",
    healthcare: "医療費",
    housing: "住宅費",
    travel: "旅行",
    salary: "給与",
    insurance: "保険",
    emergencyFund: "生活防衛資金",
    vacation: "旅行資金",
    newLaptop: "新型PC購入",
    target: "目標額",
    saved: "積立額",
    completedPercent: "達成率",
    appleStock: "アップル株",
    bitcoin: "ビットコイン",
    sp500: "S&P 500 ETF",
    gold: "金価格連動ETF",
    value: "評価額",
    change: "前日比",
    profitLoss: "評価損益",
    dueSoon: "支払期日近し",
    overdue: "期限超過",
    paid: "支払済",
    unpaid: "未払",
    markAsPaid: "支払完了にする",
    healthLabel: "極めて優秀",
    dbConfig: "Docker PostgreSQL 設定",
    dbHost: "データベースホスト",
    dbName: "データベース名",
    connectDatabase: "Docker DB接続をテスト",
    connected: "Docker PostgreSQLに接続完了",
    disconnected: "ローカルサンドボックスDB（オフライン起動中）",
    currencySelector: "通貨切り替え",
    lightMode: "ライトモード",
    darkMode: "ダークモード",
    advisorQuote1: "今月はレストランやカフェでの支出が前月比で18%増加しています。",
    advisorQuote2: "不要なサブスクリプションを解約、またはプランを見直すことで、月々約240ドルの節約が可能です。",
    advisorQuote3: "貯蓄率が先月と比較して9%向上しました！このペースを維持しましょう。",
    advisorQuote4: "緊急資金の目標額まであと少しです。現在の貯蓄ペースでは、あと3ヶ月で達成予定です。",
    uploadAreaTitle: "ここにレシート画像をドラッグ＆ドロップ",
    uploadAreaSubtitle: "PDF, PNG, JPG 最大10MBまで対応 • Gemini 3.5 OCR搭載",
    processing: "Gemini OCRでレシート解析中...",
    extractedDetails: "自動抽出された情報",
    addTxButton: "取引履歴に保存する",
    tax: "内消費税",
    receiptPreview: "レシートスキャン プレビュー画面"
  }
};

export function formatCurrency(value: number, currency: string = "USD", language: "en" | "ja" = "en"): string {
  if (language === "ja") {
    // Elegant conversion for Japanese locale - keeping numbers standard or multiplying by 150 for approximate Yen representation
    const yenVal = currency === "USD" ? Math.round(value * 150) : value;
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY"
    }).format(yenVal);
  } else {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency
    }).format(value);
  }
}

export function translateCategory(category: string, lang: "en" | "ja"): string {
  const normalized = category.toLowerCase().trim();
  if (lang === "ja") {
    switch (normalized) {
      case "food": return "食費";
      case "shopping": return "買い物";
      case "transportation":
      case "transport": return "交通費";
      case "entertainment": return "エンタメ";
      case "utilities": return "光熱費";
      case "healthcare": return "医療費";
      case "housing": return "住宅費";
      case "travel": return "旅行";
      case "salary": return "給与";
      case "insurance": return "保険";
      default: return category;
    }
  }
  return category;
}
