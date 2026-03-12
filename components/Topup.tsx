"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import {
  ChevronLeft,
  CreditCard,
  Banknote,
  Landmark,
  History,
  RefreshCw,
  Copy,
  CheckCircle2,
  ShieldCheck,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// API Config
const API_BASE_URL = "https://obills.com.ng/app/api/fund-wallet/index.php";

interface VirtualAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export default function FundAccountPage() {
  const router = useRouter();
  const [balance, setBalance] = useState("0.00");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Modal States
  const [showBankModal, setShowBankModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // Data States
  const [virtualAccounts, setVirtualAccounts] = useState<VirtualAccount[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [manualData, setManualData] = useState({
    accountNumber: "",
    accountName: "",
    bank: "",
  });

  // 1. Fetch Balance and Accounts
  const fetchData = useCallback(async () => {
    const raw = localStorage.getItem("user_session");
    if (!raw) return;
    const session = JSON.parse(raw);
    const token = session.user_data?.sApiKey;

    setBalance(parseFloat(session.user_data?.balance || "0").toFixed(2));

    try {
      const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: { Authorization: `Token ${token}` },
      });
      const result = await response.json();
      if (result.status === "success") {
        setVirtualAccounts(result.accounts || []);
      }
    } catch (error) {
      console.error("Failed to load accounts:", error);
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("app_theme");
    setIsDarkMode(savedTheme !== "light");
    fetchData();
  }, [fetchData]);

  const refreshBalance = async () => {
    setIsRefreshing(true);
    await fetchData();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    await Haptics.notification({ type: NotificationType.Success });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleMethodClick = async (method: string) => {
    await Haptics.impact({ style: ImpactStyle.Medium });
    if (method === "bank") setShowBankModal(true);
    if (method === "manual") setShowManualModal(true);
    if (method === "card") toast.info("Card payment coming soon");
  };

  // 2. Action: Generate Virtual Account
  const handleGenerateAccount = async () => {
    const raw = localStorage.getItem("user_session");
    const token = JSON.parse(raw || "{}").user_data?.sApiKey;

    setIsGenerating(true);
    await Haptics.impact({ style: ImpactStyle.Heavy });

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ action: "generate" }),
      });
      const result = await response.json();

      if (result.status === "success") {
        toast.success(result.msg);
        fetchData(); // Reload account list
      } else {
        toast.error(result.msg || "Generation failed");
      }
    } catch (error) {
      toast.error("Network error. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // 3. Action: Submit Manual Funding
  const submitManualVerification = async () => {
    if (!manualData.accountNumber || !manualData.accountName) {
      toast.error("Please fill all fields");
      return;
    }

    const raw = localStorage.getItem("user_session");
    const token = JSON.parse(raw || "{}").user_data?.sApiKey;

    setIsSubmittingManual(true);
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ action: "manual_fund", ...manualData }),
      });
      const result = await response.json();

      if (result.status === "success") {
        await Haptics.notification({ type: NotificationType.Success });
        toast.success(result.msg);
        setShowVerifyModal(false);
        setShowManualModal(false);
      } else {
        toast.error(result.msg || "Submission failed");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setIsSubmittingManual(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 w-full px-5 pt-safe pb-10 font-sans overflow-x-hidden ${
        isDarkMode ? "bg-[#0f0a14] text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Header */}
      <header className="flex justify-between items-center py-6">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon"
          className={`rounded-full h-9 w-9 ${
            isDarkMode
              ? "bg-zinc-900 text-white"
              : "bg-white shadow-sm text-slate-600"
          }`}
        >
          <ChevronLeft size={20} />
        </Button>
        <h1 className="text-base font-bold tracking-tight">Fund Wallet</h1>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full h-9 w-9 ${
            isDarkMode
              ? "bg-zinc-900 text-white"
              : "bg-white shadow-sm text-slate-600"
          }`}
        >
          <History size={18} />
        </Button>
      </header>

      {/* Balance Card */}
      <Card
        className={`border-none rounded-[2rem] overflow-hidden mb-8 shadow-2xl transition-all duration-500 ${
          isDarkMode ? "bg-[#1c1425]" : "bg-white border border-slate-100"
        }`}
      >
        <CardContent className="p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full" />
          <div className="flex items-center gap-2 mb-1 z-10">
            <p
              className={`text-[10px] font-bold uppercase tracking-widest ${
                isDarkMode ? "text-zinc-500" : "text-slate-400"
              }`}
            >
              Available Balance
            </p>
            <RefreshCw
              size={12}
              className={`cursor-pointer ${
                isRefreshing ? "animate-spin" : ""
              } ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`}
              onClick={refreshBalance}
            />
          </div>
          <h2
            className={`text-4xl font-black tracking-tight z-10 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            <span className="text-xl font-medium text-emerald-500 mr-1">₦</span>
            {parseFloat(balance).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </h2>
        </CardContent>
      </Card>

      {/* Methods */}
      <div className="space-y-3">
        <p
          className={`text-[10px] font-bold uppercase tracking-widest ml-1 mb-1 ${
            isDarkMode ? "text-zinc-500" : "text-slate-400"
          }`}
        >
          Select Method
        </p>
        <FundingMethod
          isDark={isDarkMode}
          title="Virtual Account"
          desc="Instant automated funding"
          icon={<Landmark className="text-blue-500" />}
          onClick={() => handleMethodClick("bank")}
        />
        <FundingMethod
          isDark={isDarkMode}
          title="Manual Funding"
          desc="Verify transfer with admin"
          icon={<Banknote className="text-emerald-500" />}
          onClick={() => handleMethodClick("manual")}
        />
        <FundingMethod
          isDark={isDarkMode}
          title="Debit Card"
          desc="Instant top-up via Paystack"
          icon={<CreditCard className="text-orange-500" />}
          onClick={() => handleMethodClick("card")}
        />
      </div>

      {/* VIRTUAL ACCOUNT MODAL */}
      <Dialog open={showBankModal} onOpenChange={setShowBankModal}>
        <DialogContent
          className={`border-none p-0 overflow-hidden fixed bottom-0 top-auto translate-y-0 translate-x-[-50%] rounded-t-[2.5rem] w-full max-w-full sm:max-w-[420px] ${
            isDarkMode ? "bg-zinc-950 text-white" : "bg-white text-slate-900"
          }`}
        >
          <div
            className={`w-12 h-1.5 rounded-full mx-auto mt-4 mb-2 ${
              isDarkMode ? "bg-zinc-800" : "bg-slate-200"
            }`}
          />
          <DialogHeader className="px-6 py-4">
            <DialogTitle className="text-left text-xl font-black">
              Automated Funding
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-10 space-y-5">
            {virtualAccounts.length === 0 ? (
              <div
                className={`p-8 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center text-center space-y-4 ${
                  isDarkMode
                    ? "border-zinc-800 bg-zinc-900/30"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Plus className="text-blue-500" size={32} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg">No Account Found</h4>
                  <p className="text-xs text-zinc-500 px-4">
                    Generate your unique virtual accounts to start funding
                    instantly.
                  </p>
                </div>
                <Button
                  onClick={handleGenerateAccount}
                  disabled={isGenerating}
                  className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  {isGenerating ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : (
                    "Generate Accounts"
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {virtualAccounts.map((acc, i) => (
                  <div
                    key={i}
                    className={`p-5 rounded-[2rem] border relative overflow-hidden ${
                      isDarkMode
                        ? "bg-zinc-900/50 border-zinc-800"
                        : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">
                          {acc.bankName}
                        </span>
                        <h3 className="text-xl font-black tracking-tighter">
                          {acc.accountNumber}
                        </h3>
                      </div>
                      <Button
                        onClick={() =>
                          copyToClipboard(acc.accountNumber, acc.bankName)
                        }
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-blue-500/10 text-blue-500"
                      >
                        {copiedField === acc.bankName ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                      </Button>
                    </div>
                    <p
                      className={`text-[10px] font-bold ${
                        isDarkMode ? "text-zinc-500" : "text-slate-400"
                      }`}
                    >
                      NAME: {acc.accountName}
                    </p>
                  </div>
                ))}
                <div
                  className={`p-4 rounded-2xl border ${
                    isDarkMode
                      ? "bg-blue-500/5 border-blue-500/10"
                      : "bg-blue-50 border-blue-100"
                  }`}
                >
                  <p className="text-[10px] text-center font-medium text-zinc-500">
                    Automated funding attracts a{" "}
                    <span className="text-blue-500 font-bold">₦50 charge</span>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* MANUAL MODAL */}
      <Dialog open={showManualModal} onOpenChange={setShowManualModal}>
        <DialogContent
          className={`border-none p-0 overflow-hidden fixed bottom-0 top-auto translate-y-0 translate-x-[-50%] rounded-t-[2.5rem] w-full max-w-full sm:max-w-[420px] ${
            isDarkMode ? "bg-zinc-950 text-white" : "bg-white text-slate-900"
          }`}
        >
          <div
            className={`w-12 h-1.5 rounded-full mx-auto mt-4 mb-2 ${
              isDarkMode ? "bg-zinc-800" : "bg-slate-200"
            }`}
          />
          <DialogHeader className="px-6 py-4">
            <DialogTitle className="text-left text-xl font-black">
              Manual Funding
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-10 space-y-6">
            <div
              className={`p-6 rounded-[2rem] border space-y-4 ${
                isDarkMode
                  ? "bg-emerald-500/5 border-emerald-500/10"
                  : "bg-emerald-50 border-emerald-100"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-500 uppercase">
                  Admin Bank
                </span>
                <span className="text-sm font-black text-emerald-500">
                  GTBank
                </span>
              </div>
              <div
                className="flex justify-between items-center"
                onClick={() => copyToClipboard("0123456789", "admin")}
              >
                <span className="text-xs font-bold text-zinc-500 uppercase">
                  Account No
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight">
                    0123456789
                  </span>
                  <Copy size={14} className="text-emerald-500" />
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowVerifyModal(true)}
              className="w-full h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest shadow-lg"
            >
              I Have Made The Transfer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* VERIFICATION FORM */}
      <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
        <DialogContent
          className={`border-none p-0 overflow-hidden fixed bottom-0 top-auto translate-y-0 translate-x-[-50%] rounded-t-[2.5rem] w-full max-w-full sm:max-w-[420px] ${
            isDarkMode ? "bg-zinc-950 text-white" : "bg-white text-slate-900"
          }`}
        >
          <div className="px-6 py-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-black">Verify Transfer</h3>
              <p className="text-xs text-zinc-500">
                Submit your details for admin approval.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase font-bold tracking-widest ml-1 text-zinc-500">
                  Sender Account Number
                </Label>
                <Input
                  placeholder="0000000000"
                  className={`h-12 rounded-2xl border-none ${
                    isDarkMode ? "bg-zinc-900" : "bg-slate-100"
                  }`}
                  onChange={(e) =>
                    setManualData({
                      ...manualData,
                      accountNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase font-bold tracking-widest ml-1 text-zinc-500">
                  Sender Account Name
                </Label>
                <Input
                  placeholder="John Doe"
                  className={`h-12 rounded-2xl border-none ${
                    isDarkMode ? "bg-zinc-900" : "bg-slate-100"
                  }`}
                  onChange={(e) =>
                    setManualData({
                      ...manualData,
                      accountName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase font-bold tracking-widest ml-1 text-zinc-500">
                  Sender Bank Name
                </Label>
                <Input
                  placeholder="Kuda Bank"
                  className={`h-12 rounded-2xl border-none ${
                    isDarkMode ? "bg-zinc-900" : "bg-slate-100"
                  }`}
                  onChange={(e) =>
                    setManualData({ ...manualData, bank: e.target.value })
                  }
                />
              </div>
            </div>
            <Button
              onClick={submitManualVerification}
              disabled={isSubmittingManual}
              className="w-full h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest shadow-xl"
            >
              {isSubmittingManual ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="mr-2" size={18} /> Submit Details
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FundingMethod({ title, desc, icon, onClick, isDark }: any) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-4 border rounded-[1.8rem] cursor-pointer active:scale-[0.96] transition-all group ${
        isDark
          ? "bg-[#1c1425]/40 border-white/5 hover:bg-zinc-900/60"
          : "bg-white border-slate-100 shadow-sm hover:border-slate-200"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${
          isDark ? "bg-zinc-900" : "bg-slate-50"
        }`}
      >
        {React.cloneElement(icon, { size: 22 })}
      </div>
      <div className="flex-1">
        <h3
          className={`font-bold text-[15px] leading-tight ${
            isDark ? "text-zinc-100" : "text-slate-800"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-[11px] mt-0.5 leading-tight font-medium ${
            isDark ? "text-zinc-500" : "text-slate-400"
          }`}
        >
          {desc}
        </p>
      </div>
      <ChevronLeft
        className={`rotate-180 transition-colors ${
          isDark
            ? "text-zinc-800 group-hover:text-zinc-600"
            : "text-slate-200 group-hover:text-slate-400"
        }`}
        size={18}
      />
    </div>
  );
}
