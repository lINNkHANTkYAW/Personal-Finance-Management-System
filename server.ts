import dotenv from "dotenv";
import express, { type Request, type Response, type NextFunction } from "express";
import path from "path";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { loadFinanceData, saveFinanceData, updateFinancialKPIs } from "./src/db/store";
import {
  getCachedDatabaseStatus,
  getDatabaseStatus,
  clearDatabaseStatusCache,
  getDatabaseEnvConfig,
  getPool,
} from "./src/db/postgres";
import { runMigrations } from "./src/db/migrate";
import {
  createUser,
  findUserByEmail,
  findUserById,
  verifyPassword,
} from "./src/db/auth";
import { FinanceData, Transaction } from "./src/types";

const app = express();
const PORT = 3000;
const PgSession = connectPgSimple(session);

app.use(express.json({ limit: "50mb" }));

app.use(
  session({
    store: new PgSession({
      pool: getPool() ?? undefined,
      tableName: "session",
      createTableIfMissing: true,
    }),
    name: "pfms.sid",
    secret: process.env.SESSION_SECRET || "pfms-dev-session-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  return next();
}

function getUserId(req: Request): string {
  return req.session.userId as string;
}

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (err) {
      console.error("Failed to initialize Gemini Client:", err);
      return null;
    }
  }
  return aiClient;
}

async function withDatabaseStatus(data: FinanceData): Promise<FinanceData> {
  const status = await getCachedDatabaseStatus();
  const env = getDatabaseEnvConfig();
  data.dbConfig = {
    host: status.host || env.host,
    port: status.port || env.port,
    database: status.database || env.database,
    isConnected: status.connected,
  };
  return data;
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// -------------------- Auth --------------------

app.get("/api/auth/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ user: null });
  }
  const user = await findUserById(req.session.userId);
  if (!user) {
    req.session.destroy(() => undefined);
    return res.status(401).json({ user: null });
  }
  return res.json({ user });
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};
    const user = await createUser({ name, email, password });
    req.session.userId = user.id;
    return res.status(201).json({ user });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signup failed";
    return res.status(400).json({ error: message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const found = await findUserByEmail(email);
    if (!found || !(await verifyPassword(password, found.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    req.session.userId = found.id;
    return res.json({
      user: {
        id: found.id,
        email: found.email,
        name: found.name,
        createdAt: found.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Login failed" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("pfms.sid");
    return res.json({ ok: true });
  });
});

// -------------------- Finance (auth required) --------------------

app.get("/api/finance", requireAuth, async (req, res) => {
  const data = await loadFinanceData(getUserId(req));
  const updatedData = updateFinancialKPIs(data);
  await withDatabaseStatus(updatedData);
  res.json(updatedData);
});

app.post("/api/finance", requireAuth, async (req, res) => {
  const updated = req.body as FinanceData;
  const withKPIs = updateFinancialKPIs(updated);
  await withDatabaseStatus(withKPIs);
  await saveFinanceData(getUserId(req), withKPIs);
  res.json(withKPIs);
});

app.post("/api/finance/reset", requireAuth, async (req, res) => {
  const { getInitialData } = await import("./src/db/initialData");
  const empty = updateFinancialKPIs(getInitialData());
  await withDatabaseStatus(empty);
  await saveFinanceData(getUserId(req), empty);
  res.json(empty);
});

app.post("/api/finance/transaction", requireAuth, async (req, res) => {
  const userId = getUserId(req);
  const data = await loadFinanceData(userId);
  const newTx: Transaction = {
    id: `tx-${Date.now()}`,
    date: req.body.date || new Date().toISOString().split("T")[0],
    merchant: req.body.merchant || "Unknown Merchant",
    category: req.body.category || "Uncategorized",
    paymentMethod: req.body.paymentMethod || "Cash",
    amount: parseFloat(req.body.amount) || 0,
    status: req.body.status || "completed",
    type: req.body.type || "expense",
  };

  data.transactions.unshift(newTx);

  const matchingAccount = data.accounts.find((acc) => acc.type === "checking");
  if (matchingAccount) {
    if (newTx.type === "income") {
      matchingAccount.balance += newTx.amount;
    } else {
      matchingAccount.balance -= newTx.amount;
    }
    matchingAccount.lastUpdated = new Date().toISOString();
  }

  const updated = updateFinancialKPIs(data);
  await saveFinanceData(userId, updated);
  res.json(updated);
});

app.post("/api/finance/budget", requireAuth, async (req, res) => {
  const userId = getUserId(req);
  const data = await loadFinanceData(userId);
  const { category, limit } = req.body;

  const existing = data.budgets.find(
    (b) => b.category.toLowerCase() === category.toLowerCase()
  );
  if (existing) {
    existing.limit = parseFloat(limit) || 0;
  } else {
    data.budgets.push({
      id: `b-${Date.now()}`,
      category,
      limit: parseFloat(limit) || 0,
      spent: 0,
      period: "Monthly",
    });
  }

  const updated = updateFinancialKPIs(data);
  await saveFinanceData(userId, updated);
  res.json(updated);
});

app.post("/api/finance/goal", requireAuth, async (req, res) => {
  const userId = getUserId(req);
  const data = await loadFinanceData(userId);
  const { name, target, saved, targetDate } = req.body;

  const existing = data.savingsGoals.find(
    (g) => g.name.toLowerCase() === name.toLowerCase()
  );
  if (existing) {
    existing.target = parseFloat(target) || existing.target;
    existing.saved =
      parseFloat(saved) !== undefined ? parseFloat(saved) : existing.saved;
    existing.targetDate = targetDate || existing.targetDate;
  } else {
    data.savingsGoals.push({
      id: `sg-${Date.now()}`,
      name,
      target: parseFloat(target) || 0,
      saved: parseFloat(saved) || 0,
      targetDate: targetDate || new Date().toISOString().split("T")[0],
    });
  }

  const updated = updateFinancialKPIs(data);
  await saveFinanceData(userId, updated);
  res.json(updated);
});

app.post("/api/finance/bill", requireAuth, async (req, res) => {
  const userId = getUserId(req);
  const data = await loadFinanceData(userId);
  const { name, amount, dueDate, category, urgency } = req.body;

  data.bills.push({
    id: `bill-${Date.now()}`,
    name,
    amount: parseFloat(amount) || 0,
    dueDate,
    category: category || "Utilities",
    status: "unpaid",
    urgency: urgency || "medium",
  });

  const updated = updateFinancialKPIs(data);
  await saveFinanceData(userId, updated);
  res.json(updated);
});

app.post("/api/db/connect", requireAuth, async (req, res) => {
  clearDatabaseStatusCache();
  const status = await getDatabaseStatus();

  if (!status.configured) {
    return res.status(400).json({
      connected: false,
      configured: false,
      message:
        "PostgreSQL credentials are not configured. Add POSTGRES_* values to .env.local and start Docker with `docker compose up -d`.",
    });
  }

  const data = await loadFinanceData(getUserId(req));
  await withDatabaseStatus(data);

  if (status.connected) {
    await saveFinanceData(getUserId(req), data);
  }

  return res.json({
    connected: status.connected,
    configured: status.configured,
    host: status.host,
    port: status.port,
    database: status.database,
    message: status.connected
      ? "Connected to Docker PostgreSQL."
      : "Credentials are set but PostgreSQL could not be reached. Run `docker compose up -d` and check POSTGRES_* settings.",
  });
});

app.post("/api/ai-insights", requireAuth, async (req, res) => {
  const { language } = req.body;
  const data = await loadFinanceData(getUserId(req));
  const isJa = language === "ja";

  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `Analyze the following user financial dashboard data and generate exactly 4 intelligent financial advisor recommendations.
Each recommendation must have a text message (in ${isJa ? "Japanese" : "English"}) and a type (one of: 'warning', 'savings', 'milestone', 'info').

User Financial Data:
- Current balances: Checking: ${data.accounts.find((a) => a.type === "checking")?.balance || 0}, Savings: ${data.accounts.find((a) => a.type === "savings")?.balance || 0}
- Monthly Income: ${data.transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)}
- Monthly Expenses: ${data.transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)}
- Budgets: ${JSON.stringify(data.budgets)}
- Savings Goals: ${JSON.stringify(data.savingsGoals)}
- Upcoming Bills: ${JSON.stringify(data.bills)}

Respond strictly in JSON format as an array of recommendations conforming to this schema:
[{ "text": "Recommendation text", "type": "warning" | "savings" | "milestone" | "info" }]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                type: {
                  type: Type.STRING,
                  description: "Must be exactly one of: warning, savings, milestone, info",
                },
              },
              required: ["text", "type"],
            },
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json(parsed);
      }
    } catch (err) {
      console.error("Error generating Gemini AI insights:", err);
    }
  }

  const fallbackInsights = isJa
    ? [
        {
          id: "rec-1",
          text: "口座や取引を追加すると、ここにパーソナライズされたアドバイスが表示されます。",
          type: "info",
        },
      ]
    : [
        {
          id: "rec-1",
          text: "Add accounts and transactions to receive personalized financial insights.",
          type: "info",
        },
      ];

  return res.json(fallbackInsights);
});

app.post("/api/ocr-receipt", requireAuth, async (req, res) => {
  const { image } = req.body;

  const ai = getGeminiClient();
  if (ai && image) {
    try {
      const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const base64Data = match[2];

        const prompt = `Perform OCR on this receipt image. Extract:
1. Merchant name
2. Total amount (as number)
3. Tax amount (as number, or 0 if not found)
4. Date (in YYYY-MM-DD format)
5. Suggested Expense Category (e.g. Food, Shopping, Transportation, Entertainment, Utilities, Healthcare, Travel)

Respond strictly in JSON format conforming to this schema:
{
  "merchant": "string",
  "amount": number,
  "tax": number,
  "date": "string",
  "category": "string"
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
              { text: prompt },
            ],
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                merchant: { type: Type.STRING },
                amount: { type: Type.NUMBER },
                tax: { type: Type.NUMBER },
                date: { type: Type.STRING },
                category: { type: Type.STRING },
              },
              required: ["merchant", "amount", "tax", "date", "category"],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          return res.json(parsed);
        }
      }
    } catch (err) {
      console.error("Gemini OCR Scan failed:", err);
    }
  }

  return res.status(422).json({
    error:
      "Receipt OCR is not available. Upload a receipt image or configure Gemini API access.",
  });
});

async function startServer() {
  await runMigrations();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
