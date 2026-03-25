"use client";
import React, { useEffect, useState } from "react";
import {
  Smartphone,
  Gift,
  Percent,
  Inbox,
  Zap,
  Tv,
  Wifi,
  ChevronRight,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TransactionReceipt from "./Receipt";

interface Transaction {
  transref: string;
  servicename: string;
  servicedesc: string;
  amount: string;
  status: string;
  oldbal: string;
  newbal: string;
  date: string;
}

const TransactionPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Load Theme
    const savedTheme = localStorage.getItem("app_theme");
    setIsDarkMode(savedTheme !== "light");

    const loadTransactions = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await fetch(
          "https://obills.com.ng/app/api/transactions/index.php",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        if (result.status === "success") {
          setTransactions(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, []);

  // Map backend types to Receipt component types
  const mapType = (
    service: string
  ): "airtime" | "data" | "cable" | "electricity" => {
    const s = service.toLowerCase();
    if (s.includes("data")) return "data";
    if (
      s.includes("tv") ||
      s.includes("cable") ||
      s.includes("dstv") ||
      s.includes("gotv")
    )
      return "cable";
    if (s.includes("electric") || s.includes("power")) return "electricity";
    return "airtime";
  };

  const getIcon = (service: string) => {
    const s = service.toLowerCase();
    if (s.includes("data")) return <Wifi className="text-blue-500" size={18} />;
    if (s.includes("tv") || s.includes("cable"))
      return <Tv className="text-orange-500" size={18} />;
    if (s.includes("electric"))
      return <Zap className="text-yellow-500" size={18} />;
    if (s.includes("bonus") || s.includes("interest"))
      return <Gift className="text-emerald-500" size={18} />;
    return <Smartphone className="text-zinc-400" size={18} />;
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-[#0f0a14] text-white" : "bg-slate-50 text-slate-900"
        }`}
      >
        <div className="animate-pulse font-black tracking-widest uppercase text-xs">
          Loading History...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen font-sans pb-20 transition-colors duration-500 ${
        isDarkMode ? "bg-[#0f0a14] text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Fancy Gradient Heading */}
      <header className="px-6 pt-10 pb-6">
        <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-zinc-600 bg-clip-text text-transparent">
          Activity
        </h1>
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.3em] mt-2 ${
            isDarkMode ? "text-zinc-500" : "text-slate-400"
          }`}
        >
          Your Transaction History
        </p>
      </header>

      <div className="px-4 space-y-2">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-20">
            <Inbox size={64} strokeWidth={1} />
            <p className="mt-4 font-bold uppercase tracking-widest text-[10px]">
              Empty Space
            </p>
          </div>
        ) : (
          transactions.map((tx) => (
            <Dialog key={tx.transref}>
              <DialogTrigger asChild>
                <div
                  className={`flex items-center gap-4 p-4 rounded-[1.5rem] cursor-pointer active:scale-[0.98] transition-all border ${
                    isDarkMode
                      ? "bg-[#1c1425] border-white/5 hover:bg-[#251a31]"
                      : "bg-white border-slate-100 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isDarkMode ? "bg-black/20" : "bg-slate-50"
                    }`}
                  >
                    {getIcon(tx.servicename)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black truncate leading-tight">
                      {tx.servicedesc}
                    </h3>
                    <p
                      className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${
                        isDarkMode ? "text-zinc-500" : "text-slate-400"
                      }`}
                    >
                      {tx.date.split(" ")[0]}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-sm font-black ${
                        parseFloat(tx.amount) < 0
                          ? "text-white"
                          : "text-emerald-500"
                      }`}
                    >
                      {parseFloat(tx.amount) < 0 ? "-" : "+"}₦
                      {Math.abs(parseFloat(tx.amount)).toLocaleString()}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span
                        className={`text-[8px] font-black uppercase tracking-tighter ${
                          tx.status === "0"
                            ? "text-emerald-500"
                            : "text-red-500"
                        }`}
                      >
                        {tx.status === "0" ? "Success" : "Failed"}
                      </span>
                      <ChevronRight size={10} className="opacity-30" />
                    </div>
                  </div>
                </div>
              </DialogTrigger>

              {/* Shadcn Modal Content */}
              <DialogContent className="max-w-[90vw] sm:max-w-[400px] p-0 border-none bg-transparent shadow-none">
                <TransactionReceipt
                  isDark={isDarkMode}
                  data={{
                    id: tx.transref,
                    amount: Math.abs(parseFloat(tx.amount)).toString(),
                    status: tx.status === "0" ? "success" : "failed",
                    type: mapType(tx.servicename),
                    provider: tx.servicename,
                    recipient: tx.servicedesc.match(/\d+/)?.[0] || "N/A", // Basic regex to find phone/meter number
                    date: tx.date,
                    ref: tx.transref,
                    cashback: undefined, // Add this if your API provides cashback values
                  }}
                />
              </DialogContent>
            </Dialog>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionPage;
