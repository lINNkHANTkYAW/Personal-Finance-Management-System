import React, { useState, useEffect } from "react";
import { FinanceData, AIRecommendation, Language } from "../types";
import { translations } from "../lib/translations";
import { 
  Bot, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  Lightbulb, 
  Loader2,
  HelpCircle,
} from "lucide-react";

interface AIInsightsViewProps {
  data: FinanceData;
  language: Language;
  onUpdateData: (data: FinanceData) => void;
}

export default function AIInsightsView({
  data,
  language,
  onUpdateData
}: AIInsightsViewProps) {
  const t = translations[language];
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Interactive Chat elements
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      sender: "bot",
      text: t.advisorGreeting,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language })
      });

      if (response.ok) {
        const result = await response.json();
        setRecommendations(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    setChatMessages([
      {
        sender: "bot",
        text: translations[language].advisorGreeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [language]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, {
      sender: "user",
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setChatInput("");
    setIsTyping(true);

    try {
      setTimeout(() => {
        const lower = userText.toLowerCase();
        let answer = t.aiAnswerGeneral;
        if (
          lower.includes("save") ||
          lower.includes("saving") ||
          userText.includes("貯金") ||
          userText.includes("貯蓄")
        ) {
          answer = t.aiAnswerSavings;
        } else if (
          lower.includes("budget") ||
          lower.includes("subscription") ||
          lower.includes("eat") ||
          lower.includes("food") ||
          userText.includes("予算") ||
          userText.includes("外食") ||
          userText.includes("レストラン")
        ) {
          answer = t.aiAnswerBudget;
        }

        setChatMessages(prev => [...prev, {
          sender: "bot",
          text: answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsTyping(false);
      }, 1000);

    } catch (err) {
      console.error(err);
      setIsTyping(false);
    }
  };

  const sampleQuestions = [t.sampleQ1, t.sampleQ2, t.sampleQ3];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in select-none">
      
      {/* Left side: Intelligent Advisor Cards Recommendations */}
      <div className="lg:col-span-6 space-y-6">
        <div>
          <h3 className="font-sans font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="text-emerald-500" size={18} />
            {t.aiFinancialAdvisor} {t.recommendations}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {t.aiSubtitle}
          </p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <Loader2 className="text-emerald-500 animate-spin mx-auto mb-2" size={28} />
            <span className="text-xs text-slate-400 font-semibold block">{t.calculatingVectors}</span>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div 
                key={rec.id || idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex gap-4 transition-all hover:scale-[1.01]"
              >
                <div className={`p-2.5 rounded-xl self-start ${
                  rec.type === "warning" ? "bg-red-500/10 text-red-500" :
                  rec.type === "savings" ? "bg-emerald-500/10 text-emerald-500" :
                  rec.type === "milestone" ? "bg-blue-500/10 text-blue-500" :
                  "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}>
                  {rec.type === "warning" && <AlertTriangle size={18} />}
                  {rec.type === "savings" && <Lightbulb size={18} />}
                  {rec.type === "milestone" && <TrendingUp size={18} />}
                  {rec.type === "info" && <HelpCircle size={18} />}
                </div>

                <div className="flex-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                    rec.type === "warning" ? "text-red-500" :
                    rec.type === "savings" ? "text-emerald-500" :
                    rec.type === "milestone" ? "text-blue-500" :
                    "text-slate-400"
                  }`}>
                    {rec.type}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-1">
                    {rec.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right side: Interactive Chat Advisor */}
      <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col h-[520px] justify-between">
        
        {/* Chat Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <Bot size={18} />
          </div>
          <div>
            <span className="font-sans font-bold text-sm text-slate-800 dark:text-slate-200 block">
              {t.advisorCopilot}
            </span>
            <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {t.activeCopilot}
            </span>
          </div>
        </div>

        {/* Message logs */}
        <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1 scrollbar-none">
          {chatMessages.map((msg, idx) => {
            const isBot = msg.sender === "bot";
            return (
              <div 
                key={idx}
                className={`flex gap-3 max-w-[85%] ${isBot ? "self-start" : "ml-auto flex-row-reverse"}`}
              >
                {isBot && (
                  <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg h-fit self-end shrink-0">
                    <Bot size={12} />
                  </div>
                )}
                <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  isBot 
                    ? "bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-350 rounded-bl-none" 
                    : "bg-emerald-500 text-white rounded-br-none ml-auto font-medium"
                }`}>
                  <p>{msg.text}</p>
                  <span className={`text-[9px] mt-1.5 block text-right ${isBot ? "text-slate-400" : "text-emerald-100"}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}
          {isTyping && (
            <div className="flex gap-3 max-w-[85%] self-start items-center">
              <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg shrink-0">
                <Bot size={12} />
              </div>
              <div className="bg-slate-100 dark:bg-slate-850 p-2.5 rounded-2xl rounded-bl-none flex gap-1 items-center justify-center">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        {/* Action Suggestion Chips */}
        <div className="pb-3 flex flex-wrap gap-1.5">
          {sampleQuestions.map((q) => (
            <button
              key={q}
              onClick={() => setChatInput(q)}
              className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-500 bg-slate-100/50 dark:bg-slate-850 px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-slate-800 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Controls */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={t.askPlaceholder}
            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/25 text-xs focus:outline-none"
          />
          <button
            type="submit"
            className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md transition-colors shrink-0"
          >
            <Send size={16} />
          </button>
        </form>

      </div>

    </div>
  );
}
