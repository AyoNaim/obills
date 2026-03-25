"use client";
import React, { useRef } from "react";
import {
  CheckCircle2,
  Download,
  Smartphone,
  Wifi,
  Tv,
  Zap,
  Copy,
  Share2,
} from "lucide-react";
import { usePDF } from "react-to-pdf";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ReceiptProps {
  data: {
    id: string;
    amount: string;
    status: "success" | "pending" | "failed";
    type: "airtime" | "data" | "cable" | "electricity";
    recipient: string;
    date: string;
    ref: string;
    provider?: string;
    cashback?: string;
  };
  isDark?: boolean;
}

export default function TransactionReceipt({
  data,
  isDark = true,
}: ReceiptProps) {
  const { toPDF, targetRef } = usePDF({ filename: `Receipt_${data.ref}.pdf` });

  const getIcon = () => {
    switch (data.type) {
      case "airtime":
        return <Smartphone size={24} />;
      case "data":
        return <Wifi size={24} />;
      case "cable":
        return <Tv size={24} />;
      default:
        return <Zap size={24} />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Target for PDF Generation */}
      <div
        ref={targetRef}
        className={`p-6 rounded-[2rem] transition-all ${
          isDark ? "bg-[#0f0a14] text-white" : "bg-white text-slate-900"
        }`}
      >
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-4">
            {getIcon()}
          </div>
          <h2
            className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${
              isDark ? "text-zinc-500" : "text-slate-400"
            }`}
          >
            {data.provider || "Transaction Receipt"}
          </h2>
          <div className="text-4xl font-black tracking-tight mb-2">
            ₦{parseFloat(data.amount).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-[11px] font-bold">
            <CheckCircle2 size={14} />
            {data.status.toUpperCase()}
          </div>
        </div>

        {/* Details Card */}
        <div
          className={`rounded-3xl p-6 border ${
            isDark
              ? "bg-[#1c1425] border-white/5"
              : "bg-slate-50 border-slate-100"
          }`}
        >
          <div className="space-y-4">
            <DetailRow
              label="Recipient"
              value={data.recipient}
              isDark={isDark}
            />
            <DetailRow
              label="Type"
              value={data.type.charAt(0).toUpperCase() + data.type.slice(1)}
              isDark={isDark}
            />
            <DetailRow label="Date & Time" value={data.date} isDark={isDark} />

            <Separator className={isDark ? "bg-white/5" : "bg-slate-200"} />

            <div className="flex justify-between items-start pt-2">
              <div className="flex flex-col">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                    isDark ? "text-zinc-500" : "text-slate-400"
                  }`}
                >
                  Transaction No.
                </span>
                <span className="text-[12px] font-mono break-all max-w-[180px]">
                  {data.ref}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <Copy size={14} />
              </Button>
            </div>
          </div>
        </div>

        {data.cashback && (
          <div className="mt-4 flex justify-between items-center px-4 py-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              Bonus Earned
            </span>
            <span className="text-sm font-black text-emerald-500">
              +₦{data.cashback}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons (Non-PDF) */}
      <div className="grid grid-cols-2 gap-3 px-2">
        <Button
          onClick={() => toPDF()}
          variant="outline"
          className={`h-14 rounded-2xl font-bold border-2 ${
            isDark
              ? "border-white/5 bg-zinc-900"
              : "border-slate-100 bg-white text-slate-600"
          }`}
        >
          <Download className="mr-2" size={18} /> Download
        </Button>
        <Button className="h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-500/20">
          <Share2 className="mr-2" size={18} /> Share
        </Button>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  isDark,
}: {
  label: string;
  value: string;
  isDark: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span
        className={`text-[10px] font-bold uppercase tracking-wider ${
          isDark ? "text-zinc-500" : "text-slate-400"
        }`}
      >
        {label}
      </span>
      <span className="text-sm font-black tracking-tight">{value}</span>
    </div>
  );
}
