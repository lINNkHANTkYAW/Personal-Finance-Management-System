export interface TranslationDict {
  // Nav
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

  // Common actions
  searchPlaceholder: string;
  notifications: string;
  cancel: string;
  save: string;
  close: string;
  add: string;
  logout: string;
  login: string;
  signup: string;
  pleaseWait: string;
  connecting: string;
  export: string;
  exporting: string;
  downloaded: string;
  ofAmount: string;
  duePrefix: string;

  // Auth
  brandName: string;
  authLoginSubtitle: string;
  authSignupSubtitle: string;
  fullName: string;
  email: string;
  password: string;
  passwordHint: string;
  createAccount: string;
  authFailed: string;
  serverUnreachable: string;
  checkingSession: string;
  loadingWorkspace: string;

  // Header / sidebar
  markAllRead: string;
  noNotifications: string;
  guest: string;
  notSignedIn: string;
  dbConnection: string;
  dockerPostgres: string;
  dbOffline: string;

  // Dashboard KPIs
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
  noAccountsYet: string;
  accountsCount: string;
  thisMonth: string;
  ofIncome: string;
  noIncomeRecorded: string;
  healthStartHint: string;
  quickExpenseEntry: string;
  quickIncomeEntry: string;
  merchantPlaceholder: string;
  amountPlaceholder: string;
  incomeSource: string;
  balanceHistoryTitle: string;
  balanceHistorySubtitle: string;
  assetClimb: string;
  healthStanding: string;
  incomeVsExpenses: string;
  cashFlowComparison: string;
  spendingByCategory: string;
  spendingByCategorySubtitle: string;
  noSpendingCategories: string;
  advisorChat: string;
  noActivityYet: string;
  upcomingBillsTitle: string;
  calendarView: string;
  noUpcomingBills: string;
  activeBudgets: string;
  setLimit: string;
  noBudgetsYet: string;
  savingsTargets: string;
  fundTargets: string;
  noSavingsGoalsYet: string;
  fullLedgerView: string;
  noTransactionsYet: string;
  insightsSuffix: string;
  earnedSpentInsight: string;
  savingsRateInsight: string;

  // Table / tx
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

  // Goals / investments / bills labels
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

  // DB panel
  dbConfig: string;
  dbHost: string;
  dbName: string;
  connectDatabase: string;
  connected: string;
  disconnected: string;
  dbHelpOnline: string;
  dbHelpOffline: string;
  dbVerifyOk: string;
  dbVerifyFail: string;
  dbPanelHelp: string;

  // Accounts
  totalAssets: string;
  totalLiabilities: string;
  netWorth: string;
  creditOutstanding: string;
  liquidityOptimal: string;
  connectedInstitutions: string;
  manageBanks: string;
  account: string;
  addNewAccount: string;
  accountNamePlaceholder: string;
  checking: string;
  savings: string;
  creditCard: string;
  investmentAccount: string;
  balanceLabel: string;
  syncedRecently: string;

  // Transactions
  transactionsSubtitle: string;
  addTransaction: string;
  recordLedgerEntry: string;
  searchMerchants: string;
  allCategories: string;
  noMatchingTransactions: string;

  // Budgets
  budgetsSubtitle: string;
  configureBudget: string;
  limitAmount: string;
  updateBudget: string;
  budgetSuffix: string;
  monthlyPeriod: string;
  spent: string;
  overBudget: string;
  remainingPercent: string;
  left: string;
  budgetsInfo: string;

  // Savings
  savingsSubtitle: string;
  newGoal: string;
  establishGoal: string;
  goalName: string;
  targetAmount: string;
  alreadySaved: string;
  establishGoalBtn: string;
  contributeFunds: string;
  contributeTitle: string;
  contributePlaceholder: string;
  confirmContribution: string;
  targetDate: string;
  percentComplete: string;
  fullyFunded: string;

  // Investments
  investmentsSubtitle: string;
  fluctuateMarkets: string;
  portfolioValuation: string;
  overallReturns: string;
  assetClass: string;
  stocksCrypto: string;
  securityLevel: string;
  highStability: string;
  tradeAsset: string;
  transactionType: string;
  buy: string;
  sell: string;
  shareQuantity: string;
  executeTrade: string;
  price: string;
  buySell: string;
  insufficientFunds: string;

  // Bills
  billsSubtitle: string;
  addBill: string;
  registerInvoice: string;
  billName: string;
  billNamePlaceholder: string;
  dueDate: string;
  urgency: string;
  low: string;
  medium: string;
  high: string;
  addUpcomingBill: string;
  billsListTitle: string;
  billsOverview: string;
  totalUpcomingBills: string;
  billsCount: string;
  totalUnpaid: string;
  totalPaidBills: string;
  billsInfo: string;
  insufficientBillFunds: string;
  urgencyLabel: string;

  // Analytics
  analyticsTitle: string;
  analyticsSubtitle: string;
  sixMonths: string;
  oneYear: string;
  growthCurve: string;
  categoryBurn: string;
  exportMetrics: string;
  noAnalyticsData: string;

  // AI
  recommendations: string;
  aiSubtitle: string;
  calculatingVectors: string;
  advisorGreeting: string;
  advisorCopilot: string;
  activeCopilot: string;
  askPlaceholder: string;
  sampleQ1: string;
  sampleQ2: string;
  sampleQ3: string;
  aiAnswerSavings: string;
  aiAnswerBudget: string;
  aiAnswerGeneral: string;

  // Reports
  reportsSubtitle: string;
  exportStatement: string;
  incomeStatement: string;
  incomeStatementDesc: string;
  balanceSheet: string;
  balanceSheetDesc: string;
  reportBrand: string;
  periodLabel: string;
  runDate: string;
  sourceLive: string;
  sectionIncome: string;
  sectionExpenses: string;
  totalOperatingIncome: string;
  totalExpensesLabel: string;
  netSurplus: string;
  sectionAssets: string;
  sectionLiabilities: string;
  totalAssetsLabel: string;
  totalLiabilitiesLabel: string;
  netPosition: string;
  noIncomeMonth: string;
  noExpensesMonth: string;
  noAssetAccounts: string;
  noLiabilities: string;
  reportFooter: string;
  investmentPortfolio: string;
  unpaidBillsLiability: string;

  // Settings
  settingsTitle: string;
  settingsSubtitle: string;
  personalIdentity: string;
  emailAddress: string;
  phoneNumber: string;
  profileSaved: string;
  saveIdentity: string;
  notifLimits: string;
  enableAlerts: string;
  enableAlertsDesc: string;
  autoDeduction: string;
  autoDeductionDesc: string;
  weeklyReports: string;
  weeklyReportsDesc: string;
  accountSession: string;
  accountSessionDesc: string;
  dangerZone: string;
  resetDesc: string;
  resetDatabase: string;
  resetConfirm: string;
  resetDone: string;

  // Receipt
  poweredByOcr: string;
  loadDemoReceipt: string;
  parsingReceipt: string;
  noReceiptYet: string;
  receiptDemoHint: string;
  receiptError: string;

  // Misc chrome
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
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    add: "Add",
    logout: "Log out",
    login: "Log in",
    signup: "Sign up",
    pleaseWait: "Please wait...",
    connecting: "Connecting...",
    export: "Export",
    exporting: "Exporting...",
    downloaded: "Downloaded",
    ofAmount: "of",
    duePrefix: "Due",
    brandName: "Elysian Wealth",
    authLoginSubtitle: "Sign in to your personal finance workspace",
    authSignupSubtitle: "Create an account to start tracking your money",
    fullName: "Full name",
    email: "Email",
    password: "Password",
    passwordHint: "At least 6 characters",
    createAccount: "Create account",
    authFailed: "Authentication failed",
    serverUnreachable: "Unable to reach the server. Is it running?",
    checkingSession: "CHECKING SESSION...",
    loadingWorkspace: "LOADING YOUR WORKSPACE...",
    markAllRead: "Mark all read",
    noNotifications: "No active notifications.",
    guest: "Guest",
    notSignedIn: "Not signed in",
    dbConnection: "DB Connection",
    dockerPostgres: "Docker Postgres",
    dbOffline: "DB Offline",
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
    noAccountsYet: "No accounts yet",
    accountsCount: "accounts",
    thisMonth: "This month",
    ofIncome: "Of this month's income",
    noIncomeRecorded: "No income recorded",
    healthStartHint: "Add accounts and transactions to build your financial health score.",
    quickExpenseEntry: "Quick Expense Entry",
    quickIncomeEntry: "Quick Income Entry",
    merchantPlaceholder: "Merchant",
    amountPlaceholder: "Amount ($)",
    incomeSource: "Income Source",
    balanceHistoryTitle: "12-Month Historical Assets Progression",
    balanceHistorySubtitle: "Consolidated balance trajectory",
    assetClimb: "Asset Climb",
    healthStanding: "Consolidated standing",
    incomeVsExpenses: "Monthly Income vs Expenses",
    cashFlowComparison: "Cash flow comparison over past 6 months",
    spendingByCategory: "Spending by Category",
    spendingByCategorySubtitle: "Categorical expense distributions this period",
    noSpendingCategories: "No spending categories this month.",
    advisorChat: "Advisor Chat",
    noActivityYet: "No activity yet. Add accounts and transactions to unlock personalized insights here.",
    upcomingBillsTitle: "Upcoming Bills",
    calendarView: "Calendar View",
    noUpcomingBills: "No upcoming bills.",
    activeBudgets: "Active Category Budgets",
    setLimit: "Set Limit",
    noBudgetsYet: "No budgets set yet.",
    savingsTargets: "Savings Targets Pacing",
    fundTargets: "Fund Targets",
    noSavingsGoalsYet: "No savings goals yet.",
    fullLedgerView: "Full Ledger View",
    noTransactionsYet: "No transactions yet.",
    insightsSuffix: "insights",
    earnedSpentInsight: "This month you earned {income} and spent {expenses}.",
    savingsRateInsight: "Your savings rate is {rate}%. Open AI Insights for deeper analysis.",
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
    disconnected: "Disconnected",
    dbHelpOnline: "All tables are synced to your Docker PostgreSQL schema.",
    dbHelpOffline: "PostgreSQL is offline. Run docker compose up -d and check .env.local.",
    dbVerifyOk: "Database Connection Verified Successfully!",
    dbVerifyFail: "Connection Failed. Start Docker Postgres and try again.",
    dbPanelHelp: "All finance data is stored in PostgreSQL running in Docker. Start the database with docker compose up -d, then verify the connection below.",
    totalAssets: "Total Assets",
    totalLiabilities: "Total Liabilities",
    netWorth: "Calculated Net Worth",
    creditOutstanding: "Credit card outstanding balances",
    liquidityOptimal: "Financial Liquidity",
    connectedInstitutions: "Connected Institutions",
    manageBanks: "Manage bank accounts and balances",
    account: "Account",
    addNewAccount: "Add New Institution Account",
    accountNamePlaceholder: "Account Name (e.g. Checking)",
    checking: "Checking",
    savings: "Savings",
    creditCard: "Credit Card",
    investmentAccount: "Investment",
    balanceLabel: "Balance ($)",
    syncedRecently: "Synced recently",
    transactionsSubtitle: "Audit and filter your ledger entries",
    addTransaction: "Add Transaction",
    recordLedgerEntry: "Record New Ledger Entry",
    searchMerchants: "Search merchants, categories...",
    allCategories: "All Categories",
    noMatchingTransactions: "No transactions found matching active filters.",
    budgetsSubtitle: "Compare active limits against categorical expenses for the month",
    configureBudget: "Configure Budget Boundary",
    limitAmount: "Limit Amount ($)",
    updateBudget: "Update Budget",
    budgetSuffix: "Budget",
    monthlyPeriod: "Monthly Period",
    spent: "Spent",
    overBudget: "Over Budget",
    remainingPercent: "% Remaining",
    left: "left",
    budgetsInfo: "Budgets update automatically from your expense transactions.",
    savingsSubtitle: "Track progress toward your financial objectives",
    newGoal: "New Goal",
    establishGoal: "Establish Financial Objective",
    goalName: "Goal Name",
    targetAmount: "Target Amount ($)",
    alreadySaved: "Already Saved ($)",
    establishGoalBtn: "Establish Goal",
    contributeFunds: "Contribute Funds",
    contributeTitle: "Contribute Savings Funds",
    contributePlaceholder: "Contribution amount ($)",
    confirmContribution: "Confirm Contribution Transfer",
    targetDate: "Target Date:",
    percentComplete: "% Complete",
    fullyFunded: "Fully Funded!",
    investmentsSubtitle: "Monitor holdings and simulated trades",
    fluctuateMarkets: "Fluctuate Markets",
    portfolioValuation: "Portfolio Net Valuation",
    overallReturns: "Overall portfolio returns",
    assetClass: "Asset Class",
    stocksCrypto: "Stocks & Crypto",
    securityLevel: "Security Level",
    highStability: "High Stability",
    tradeAsset: "Trade Asset:",
    transactionType: "Transaction Type",
    buy: "BUY",
    sell: "SELL",
    shareQuantity: "Share Quantity",
    executeTrade: "Execute Trade",
    price: "Price",
    buySell: "Buy / Sell",
    insufficientFunds: "Insufficient funds in checking account!",
    billsSubtitle: "Track upcoming invoices and payment urgency",
    addBill: "Add Bill",
    registerInvoice: "Register Upcoming Invoice",
    billName: "Bill Name",
    billNamePlaceholder: "e.g. Electricity, Wireless",
    dueDate: "Due Date",
    urgency: "Urgency",
    low: "Low",
    medium: "Medium",
    high: "High",
    addUpcomingBill: "Add Upcoming Bill",
    billsListTitle: "Upcoming Payables List",
    billsOverview: "Monthly Bill Liabilities Overview",
    totalUpcomingBills: "Total Upcoming Bills",
    billsCount: "Bills",
    totalUnpaid: "Total Unpaid Amount",
    totalPaidBills: "Total Paid Bills",
    billsInfo: "Mark bills paid to update your checking balance.",
    insufficientBillFunds: "Insufficient funds in checking account to pay this bill!",
    urgencyLabel: "Urgency",
    analyticsTitle: "Analytics Intelligence",
    analyticsSubtitle: "Evaluate asset growth, liquidity metrics, and cash velocity",
    sixMonths: "6 Months",
    oneYear: "1 Year",
    growthCurve: "Cumulative Assets & Savings Growth Curve",
    categoryBurn: "Liquidity Category Burn",
    exportMetrics: "Export Metric Models",
    noAnalyticsData: "Add transactions to populate analytics charts.",
    recommendations: "Recommendations",
    aiSubtitle: "Personalized guidance from your financial activity",
    calculatingVectors: "Calculating savings vectors...",
    advisorGreeting: "Hello! Ask me anything about your budgets, savings, or spending.",
    advisorCopilot: "Elysian Advisor Copilot",
    activeCopilot: "Active Copilot",
    askPlaceholder: "Type your financial question...",
    sampleQ1: "How can I improve my savings rate?",
    sampleQ2: "What subscriptions can I reduce?",
    sampleQ3: "When will I hit my emergency fund goal?",
    aiAnswerSavings: "To boost savings, review shopping and dining expenses, then redirect a fixed amount to your savings goal each month.",
    aiAnswerBudget: "Check your category budgets and cut one recurring expense if you are near the limit.",
    aiAnswerGeneral: "Your profile strengthens as you add accounts, budgets, and consistent savings contributions.",
    reportsSubtitle: "Built from your live data for {period}",
    exportStatement: "Export Statement",
    incomeStatement: "Income Statement",
    incomeStatementDesc: "Income vs expenses this month",
    balanceSheet: "Balance Sheet",
    balanceSheetDesc: "Assets vs liabilities from your accounts",
    reportBrand: "ELYSIAN WEALTH REPORTING",
    periodLabel: "PERIOD",
    runDate: "RUN DATE",
    sourceLive: "SOURCE: LIVE DATABASE",
    sectionIncome: "1. Income",
    sectionExpenses: "2. Expenses",
    totalOperatingIncome: "TOTAL OPERATING INCOME",
    totalExpensesLabel: "TOTAL EXPENSES",
    netSurplus: "NET SURPLUS / DEFICIT",
    sectionAssets: "1. Assets",
    sectionLiabilities: "2. Liabilities",
    totalAssetsLabel: "TOTAL ASSETS",
    totalLiabilitiesLabel: "TOTAL LIABILITIES",
    netPosition: "NET POSITION",
    noIncomeMonth: "No income recorded this month.",
    noExpensesMonth: "No expenses recorded this month.",
    noAssetAccounts: "No asset accounts yet.",
    noLiabilities: "No liabilities recorded.",
    reportFooter: "Generated from your authenticated PostgreSQL data — not sample figures.",
    investmentPortfolio: "Investment Portfolio Valuation",
    unpaidBillsLiability: "Upcoming Unpaid Bills",
    settingsTitle: "Profile & Application Settings",
    settingsSubtitle: "Manage identity, alerts, and account session",
    personalIdentity: "Personal Account Identity",
    emailAddress: "Email Address",
    phoneNumber: "Phone Number",
    profileSaved: "Profile details saved securely!",
    saveIdentity: "Save Identity Details",
    notifLimits: "Notifications & Limits",
    enableAlerts: "Budget alerts",
    enableAlertsDesc: "Notify when spending approaches category limits",
    autoDeduction: "Auto bill-pay reminders",
    autoDeductionDesc: "Remind before upcoming bill due dates",
    weeklyReports: "Weekly digests",
    weeklyReportsDesc: "Email consolidated statements every Friday",
    accountSession: "Account session",
    accountSessionDesc: "Sign out of this device. Your finance data stays saved for when you log back in.",
    dangerZone: "Danger Zone",
    resetDesc: "Reset your finance data to empty. Custom transactions and targets will be wiped.",
    resetDatabase: "Reset Database",
    resetConfirm: "Are you sure you want to reset your finance data? This cannot be undone.",
    resetDone: "Database reset to empty defaults.",
    poweredByOcr: "Powered by server-side Gemini OCR",
    loadDemoReceipt: "Load Interactive Demo Receipt Scan",
    parsingReceipt: "Parsing items, tax values & totals...",
    noReceiptYet: "No receipt scanned yet",
    receiptDemoHint: "Drop a receipt image or use the demo scanner.",
    receiptError: "Failed to analyze receipt. Try another image or check Gemini API access.",
    currencySelector: "Currency Selector",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    advisorQuote1: "You spent 18% more on restaurants this month.",
    advisorQuote2: "You could save by reducing subscription expenses.",
    advisorQuote3: "Your savings rate has improved compared to last month.",
    advisorQuote4: "Your emergency fund is on track.",
    uploadAreaTitle: "Drag and drop your receipt here",
    uploadAreaSubtitle: "Supports PNG, JPG up to 10MB • Uses Gemini OCR",
    processing: "Processing receipt with Gemini OCR...",
    extractedDetails: "Automatically Extracted Details",
    addTxButton: "Save to Transactions Log",
    tax: "Tax Included",
    receiptPreview: "Receipt Scan Live Preview",
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
    cancel: "キャンセル",
    save: "保存",
    close: "閉じる",
    add: "追加",
    logout: "ログアウト",
    login: "ログイン",
    signup: "新規登録",
    pleaseWait: "しばらくお待ちください...",
    connecting: "接続中...",
    export: "エクスポート",
    exporting: "エクスポート中...",
    downloaded: "ダウンロード完了",
    ofAmount: "/",
    duePrefix: "期限",
    brandName: "Elysian Wealth",
    authLoginSubtitle: "個人の家計管理ワークスペースにサインイン",
    authSignupSubtitle: "アカウントを作成してお金の管理を始めましょう",
    fullName: "氏名",
    email: "メールアドレス",
    password: "パスワード",
    passwordHint: "6文字以上",
    createAccount: "アカウント作成",
    authFailed: "認証に失敗しました",
    serverUnreachable: "サーバーに接続できません。起動中か確認してください。",
    checkingSession: "セッションを確認中...",
    loadingWorkspace: "ワークスペースを読み込み中...",
    markAllRead: "すべて既読にする",
    noNotifications: "通知はありません。",
    guest: "ゲスト",
    notSignedIn: "未ログイン",
    dbConnection: "DB接続",
    dockerPostgres: "Docker Postgres",
    dbOffline: "DBオフライン",
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
    noAccountsYet: "口座が未登録です",
    accountsCount: "口座",
    thisMonth: "今月",
    ofIncome: "収入に対する貯蓄割合",
    noIncomeRecorded: "収入データなし",
    healthStartHint: "口座や取引を追加すると健全性が更新されます。",
    quickExpenseEntry: "かんたん支出入力",
    quickIncomeEntry: "かんたん収入入力",
    merchantPlaceholder: "加盟店名",
    amountPlaceholder: "金額",
    incomeSource: "収入元",
    balanceHistoryTitle: "過去12ヶ月の資産推移",
    balanceHistorySubtitle: "統合残高の軌跡",
    assetClimb: "資産成長",
    healthStanding: "総合評価",
    incomeVsExpenses: "月次 収入 vs 支出",
    cashFlowComparison: "過去6ヶ月のキャッシュフロー比較",
    spendingByCategory: "カテゴリ別支出",
    spendingByCategorySubtitle: "今期のカテゴリ別支出分布",
    noSpendingCategories: "今月の支出データがありません。",
    advisorChat: "アドバイザーチャット",
    noActivityYet: "取引データがありません。口座や取引を追加すると、ここにアドバイスが表示されます。",
    upcomingBillsTitle: "今後の請求",
    calendarView: "カレンダー表示",
    noUpcomingBills: "予定されている請求はありません。",
    activeBudgets: "有効なカテゴリ予算",
    setLimit: "上限を設定",
    noBudgetsYet: "予算が未設定です。",
    savingsTargets: "貯蓄目標の進捗",
    fundTargets: "目標を積立",
    noSavingsGoalsYet: "貯蓄目標が未設定です。",
    fullLedgerView: "全明細を見る",
    noTransactionsYet: "取引がありません。",
    insightsSuffix: "インサイト",
    earnedSpentInsight: "今月の収入は {income}、支出は {expenses} です。",
    savingsRateInsight: "貯蓄率は {rate}% です。詳細は AI Insights で確認できます。",
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
    disconnected: "未接続",
    dbHelpOnline: "すべてのテーブルが Docker PostgreSQL に同期されています。",
    dbHelpOffline: "PostgreSQL がオフラインです。docker compose up -d を実行し .env.local を確認してください。",
    dbVerifyOk: "データベース接続の確認に成功しました！",
    dbVerifyFail: "接続に失敗しました。Docker Postgres を起動して再試行してください。",
    dbPanelHelp: "すべての家計データは Docker 上の PostgreSQL に保存されます。docker compose up -d で起動し、下で接続を確認してください。",
    totalAssets: "総資産",
    totalLiabilities: "総負債",
    netWorth: "純資産（計算値）",
    creditOutstanding: "クレジットカード残高",
    liquidityOptimal: "流動性",
    connectedInstitutions: "連携口座",
    manageBanks: "銀行口座と残高を管理",
    account: "口座",
    addNewAccount: "新しい口座を追加",
    accountNamePlaceholder: "口座名（例：普通預金）",
    checking: "普通預金",
    savings: "貯蓄口座",
    creditCard: "クレジットカード",
    investmentAccount: "投資口座",
    balanceLabel: "残高",
    syncedRecently: "最近同期済み",
    transactionsSubtitle: "取引明細の監査とフィルタ",
    addTransaction: "取引を追加",
    recordLedgerEntry: "新しい取引を記録",
    searchMerchants: "加盟店・カテゴリを検索...",
    allCategories: "すべてのカテゴリ",
    noMatchingTransactions: "条件に一致する取引がありません。",
    budgetsSubtitle: "今月のカテゴリ支出と予算上限を比較",
    configureBudget: "予算上限の設定",
    limitAmount: "上限金額",
    updateBudget: "予算を更新",
    budgetSuffix: "予算",
    monthlyPeriod: "月次",
    spent: "使用額",
    overBudget: "予算超過",
    remainingPercent: "% 残",
    left: "残り",
    budgetsInfo: "予算は支出取引から自動更新されます。",
    savingsSubtitle: "金融目標への進捗を追跡",
    newGoal: "新しい目標",
    establishGoal: "貯蓄目標を設定",
    goalName: "目標名",
    targetAmount: "目標金額",
    alreadySaved: "既に貯蓄した額",
    establishGoalBtn: "目標を作成",
    contributeFunds: "積立する",
    contributeTitle: "貯蓄を積立",
    contributePlaceholder: "積立金額",
    confirmContribution: "積立を確定",
    targetDate: "達成予定日:",
    percentComplete: "% 達成",
    fullyFunded: "目標達成！",
    investmentsSubtitle: "保有資産と取引シミュレーション",
    fluctuateMarkets: "市場を更新",
    portfolioValuation: "ポートフォリオ評価額",
    overallReturns: "全体リターン",
    assetClass: "資産クラス",
    stocksCrypto: "株式・暗号資産",
    securityLevel: "安定性",
    highStability: "高安定",
    tradeAsset: "取引対象:",
    transactionType: "取引種別",
    buy: "買い",
    sell: "売り",
    shareQuantity: "株数 / 数量",
    executeTrade: "取引を実行",
    price: "価格",
    buySell: "売買",
    insufficientFunds: "普通預金口座の残高が不足しています！",
    billsSubtitle: "今後の請求と支払優先度を管理",
    addBill: "請求を追加",
    registerInvoice: "今後の請求を登録",
    billName: "請求名",
    billNamePlaceholder: "例: 電気代、携帯料金",
    dueDate: "支払期限",
    urgency: "緊急度",
    low: "低",
    medium: "中",
    high: "高",
    addUpcomingBill: "請求を追加",
    billsListTitle: "今後の支払一覧",
    billsOverview: "月次請求の概要",
    totalUpcomingBills: "今後の請求件数",
    billsCount: "件",
    totalUnpaid: "未払合計",
    totalPaidBills: "支払済合計",
    billsInfo: "支払完了にすると普通預金残高が更新されます。",
    insufficientBillFunds: "この請求を支払う普通預金残高が不足しています！",
    urgencyLabel: "緊急度",
    analyticsTitle: "分析インテリジェンス",
    analyticsSubtitle: "資産成長・流動性・現金回転を評価",
    sixMonths: "6ヶ月",
    oneYear: "1年",
    growthCurve: "累積資産・貯蓄の成長曲線",
    categoryBurn: "カテゴリ別流動性消費",
    exportMetrics: "指標をエクスポート",
    noAnalyticsData: "分析チャートを表示するには取引を追加してください。",
    recommendations: "おすすめ",
    aiSubtitle: "あなたの家計活動に基づくパーソナルな助言",
    calculatingVectors: "貯蓄ベクトルを計算中...",
    advisorGreeting: "こんにちは！予算・貯蓄・支出について何でも質問してください。",
    advisorCopilot: "Elysian アドバイザー",
    activeCopilot: "稼働中",
    askPlaceholder: "家計についての質問を入力...",
    sampleQ1: "貯蓄率を改善するには？",
    sampleQ2: "削減できるサブスクは？",
    sampleQ3: "緊急資金の目標はいつ達成？",
    aiAnswerSavings: "貯蓄を増やすには、買い物や外食を見直し、毎月定額を貯蓄目標へ振り分けることをおすすめします。",
    aiAnswerBudget: "カテゴリ予算を確認し、上限に近い場合は定期支出を1つ削減しましょう。",
    aiAnswerGeneral: "口座・予算・継続的な積立を追加するほど、財務プロフィールは強くなります。",
    reportsSubtitle: "{period} の実データに基づくレポート",
    exportStatement: "明細書をエクスポート",
    incomeStatement: "損益計算書",
    incomeStatementDesc: "今月の収入と支出",
    balanceSheet: "貸借対照表",
    balanceSheetDesc: "口座に基づく資産と負債",
    reportBrand: "ELYSIAN WEALTH レポート",
    periodLabel: "対象期間",
    runDate: "作成日",
    sourceLive: "ソース: ライブデータベース",
    sectionIncome: "1. 収入",
    sectionExpenses: "2. 支出",
    totalOperatingIncome: "営業収入合計",
    totalExpensesLabel: "支出合計",
    netSurplus: "純余剰 / 不足",
    sectionAssets: "1. 資産",
    sectionLiabilities: "2. 負債",
    totalAssetsLabel: "資産合計",
    totalLiabilitiesLabel: "負債合計",
    netPosition: "純資産ポジション",
    noIncomeMonth: "今月の収入データがありません。",
    noExpensesMonth: "今月の支出データがありません。",
    noAssetAccounts: "資産口座がありません。",
    noLiabilities: "負債はありません。",
    reportFooter: "認証済み PostgreSQL の実データから生成 — サンプル数値ではありません。",
    investmentPortfolio: "投資ポートフォリオ評価額",
    unpaidBillsLiability: "未払い請求（予定）",
    settingsTitle: "プロフィールとアプリ設定",
    settingsSubtitle: "本人情報・通知・セッションを管理",
    personalIdentity: "個人アカウント情報",
    emailAddress: "メールアドレス",
    phoneNumber: "電話番号",
    profileSaved: "プロフィールを安全に保存しました！",
    saveIdentity: "本人情報を保存",
    notifLimits: "通知と上限",
    enableAlerts: "予算アラート",
    enableAlertsDesc: "カテゴリ上限に近づくと通知",
    autoDeduction: "請求支払リマインダー",
    autoDeductionDesc: "支払期限前にリマインド",
    weeklyReports: "週次ダイジェスト",
    weeklyReportsDesc: "毎週金曜に集計ステートメントを送信",
    accountSession: "アカウントセッション",
    accountSessionDesc: "この端末からログアウトします。家計データは再ログイン時にそのまま利用できます。",
    dangerZone: "危険ゾーン",
    resetDesc: "家計データを空にリセットします。カスタム取引や目標は消去されます。",
    resetDatabase: "データベースをリセット",
    resetConfirm: "家計データをリセットしてもよろしいですか？この操作は取り消せません。",
    resetDone: "データベースを空の初期状態にリセットしました。",
    poweredByOcr: "サーバー側 Gemini OCR 搭載",
    loadDemoReceipt: "デモ用レシートスキャンを読み込む",
    parsingReceipt: "明細・税・合計を解析中...",
    noReceiptYet: "レシートはまだスキャンされていません",
    receiptDemoHint: "レシート画像をドロップするか、デモスキャナーを使用してください。",
    receiptError: "レシート解析に失敗しました。別の画像を試すか Gemini API を確認してください。",
    currencySelector: "通貨切り替え",
    lightMode: "ライトモード",
    darkMode: "ダークモード",
    advisorQuote1: "今月はレストランやカフェでの支出が増えています。",
    advisorQuote2: "サブスクリプションを見直すことで節約が可能です。",
    advisorQuote3: "貯蓄率が先月より改善しました。",
    advisorQuote4: "緊急資金の目標達成は順調です。",
    uploadAreaTitle: "ここにレシート画像をドラッグ＆ドロップ",
    uploadAreaSubtitle: "PNG, JPG 最大10MBまで対応 • Gemini OCR搭載",
    processing: "Gemini OCRでレシート解析中...",
    extractedDetails: "自動抽出された情報",
    addTxButton: "取引履歴に保存する",
    tax: "内消費税",
    receiptPreview: "レシートスキャン プレビュー画面",
  },
};

export const USD_TO_JPY = 162;
export const JPY_TO_USD = 0.0062;

/** Stored ledger amounts are treated as USD and converted for display. */
export function convertCurrency(
  amountUsd: number,
  toCurrency: string
): number {
  if (toCurrency === "JPY") {
    return Math.round(amountUsd * USD_TO_JPY);
  }
  if (toCurrency === "USD") {
    return amountUsd;
  }
  return amountUsd;
}

export function convertToUsd(amount: number, fromCurrency: string): number {
  if (fromCurrency === "JPY") {
    return Math.round(amount * JPY_TO_USD * 100) / 100;
  }
  return amount;
}

export function formatCurrency(
  value: number,
  currency: string = "USD",
  language: "en" | "ja" = "en"
): string {
  const locale = language === "ja" ? "ja-JP" : "en-US";
  const displayCurrency = currency === "JPY" ? "JPY" : "USD";
  const amount = convertCurrency(value, displayCurrency);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: displayCurrency,
    maximumFractionDigits: displayCurrency === "JPY" ? 0 : 2,
  }).format(amount);
}

export function translateCategory(category: string, lang: "en" | "ja"): string {
  const normalized = category.toLowerCase().trim();
  if (lang === "ja") {
    switch (normalized) {
      case "food":
        return "食費";
      case "shopping":
        return "買い物";
      case "transportation":
      case "transport":
        return "交通費";
      case "entertainment":
        return "エンタメ";
      case "utilities":
        return "光熱費";
      case "healthcare":
        return "医療費";
      case "housing":
        return "住宅費";
      case "travel":
        return "旅行";
      case "salary":
        return "給与";
      case "insurance":
        return "保険";
      default:
        return category;
    }
  }
  return category;
}

export function fillTemplate(
  template: string,
  vars: Record<string, string | number>
): string {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template
  );
}
