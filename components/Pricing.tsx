"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Wifi,
  Phone,
  Tv,
  Zap,
  Search,
  Info,
  CheckCircle2,
  ZapOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { useRouter } from "next/navigation";

export default function PricingsPage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("app_theme");
    setIsDarkMode(savedTheme !== "light");
  }, []);

  const handleBack = async () => {
    await Haptics.impact({ style: ImpactStyle.Light });
    router.back();
  };

  // Final Populated Data Structure
  const pricingData = {
    data: [
      { network: "MTN", plan: "1GB (SME)", price: "₦245", duration: "30 Days" },
      {
        network: "MTN",
        plan: "5GB (SME)",
        price: "₦1,225",
        duration: "30 Days",
      },
      {
        network: "Airtel",
        plan: "1GB (Gift)",
        price: "₦240",
        duration: "30 Days",
      },
      { network: "Glo", plan: "1.35GB", price: "₦435", duration: "30 Days" },
      { network: "9Mobile", plan: "1.5GB", price: "₦880", duration: "30 Days" },
    ],
    airtime: [
      { network: "MTN", discount: "2% Off", type: "VTU", status: "Instant" },
      { network: "Airtel", discount: "2% Off", type: "VTU", status: "Instant" },
      { network: "Glo", discount: "3% Off", type: "VTU", status: "Instant" },
      {
        network: "9Mobile",
        discount: "4% Off",
        type: "VTU",
        status: "Instant",
      },
    ],
    cable: [
      { provider: "DSTV", package: "Padi", price: "₦3,600", fee: "₦0" },
      { provider: "DSTV", package: "Compact", price: "₦15,700", fee: "₦0" },
      { provider: "GOTV", package: "Supa Plus", price: "₦15,700", fee: "₦0" },
      { provider: "GOTV", package: "Jolli", price: "₦4,850", fee: "₦0" },
      { provider: "Startimes", package: "Nova", price: "₦1,500", fee: "₦0" },
      { provider: "Startimes", package: "Smart", price: "₦3,500", fee: "₦0" },
    ],
    electricity: [
      { disco: "Ikeja Electric", type: "Prepaid", fee: "₦0", min: "₦500" },
      { disco: "Eko Electric", type: "Prepaid", fee: "₦0", min: "₦500" },
      { disco: "Abuja Electric", type: "Prepaid", fee: "₦0", min: "₦1,000" },
      { disco: "Kano Electric", type: "Prepaid", fee: "₦0", min: "₦500" },
      { disco: "Port Harcourt", type: "Prepaid", fee: "₦0", min: "₦1,000" },
      { disco: "Enugu Electric", type: "Prepaid", fee: "₦0", min: "₦500" },
    ],
  };

  const filterData = (list: any[]) =>
    list.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  return (
    <div
      className={`w-full min-h-screen pt-safe pb-10 font-sans transition-colors duration-500 overflow-x-hidden ${
        isDarkMode ? "bg-[#0f0a14] text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Header */}
      <header className="px-5 flex justify-between items-center py-6 sticky top-0 z-30 backdrop-blur-xl">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="icon"
          className={`rounded-full h-10 w-10 ${
            isDarkMode
              ? "bg-zinc-900/50 text-white"
              : "bg-white shadow-sm border border-slate-100"
          }`}
        >
          <ChevronLeft size={24} />
        </Button>
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
          Price Index
        </h2>
        <div className="h-10 w-10" />
      </header>

      {/* Hero Section */}
      <div className="px-6 mb-8">
        <h1 className="text-4xl font-black tracking-tighter mb-2">
          Affordable <br />
          <span className="text-emerald-500">Connections.</span>
        </h1>
        <p className="text-sm font-medium opacity-60">
          Last Updated: Today, 08:45 AM
        </p>
      </div>

      {/* Search Container */}
      <div className="px-5 mb-8">
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:text-emerald-500 group-focus-within:opacity-100 transition-all"
            size={18}
          />
          <Input
            placeholder="Search network, plan or provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`h-14 pl-12 rounded-[1.5rem] border-none transition-all ${
              isDarkMode
                ? "bg-white/5 focus:bg-white/10"
                : "bg-white shadow-xl focus:shadow-emerald-500/10"
            }`}
          />
        </div>
      </div>

      <div className="px-5">
        <Tabs defaultValue="data" className="w-full">
          <TabsList
            className={`grid grid-cols-4 h-16 rounded-[2rem] p-1.5 mb-8 ${
              isDarkMode ? "bg-white/5" : "bg-slate-200/50"
            }`}
          >
            <TabsTrigger
              value="data"
              className="rounded-[1.5rem] data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all duration-300"
            >
              <Wifi size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="airtime"
              className="rounded-[1.5rem] data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all duration-300"
            >
              <Phone size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="cable"
              className="rounded-[1.5rem] data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all duration-300"
            >
              <Tv size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="utility"
              className="rounded-[1.5rem] data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all duration-300"
            >
              <Zap size={18} />
            </TabsTrigger>
          </TabsList>

          {/* TABLE CONTAINERS */}
          {[
            {
              id: "data",
              data: pricingData.data,
              headers: ["Network", "Plan", "Price"],
            },
            {
              id: "airtime",
              data: pricingData.airtime,
              headers: ["Network", "Discount", "Method"],
            },
            {
              id: "cable",
              data: pricingData.cable,
              headers: ["Provider", "Package", "Price"],
            },
            {
              id: "utility",
              data: pricingData.electricity,
              headers: ["Disco", "Charge", "Minimum"],
            },
          ].map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="mt-0 outline-none"
            >
              <div
                className={`rounded-[2.5rem] overflow-hidden border ${
                  isDarkMode
                    ? "bg-[#1c1425] border-white/5"
                    : "bg-white border-slate-100 shadow-xl"
                }`}
              >
                <Table>
                  <TableHeader
                    className={isDarkMode ? "bg-white/5" : "bg-slate-50/50"}
                  >
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="font-black text-[9px] uppercase tracking-widest px-6 h-12">
                        {tab.headers[0]}
                      </TableHead>
                      <TableHead className="font-black text-[9px] uppercase tracking-widest h-12">
                        {tab.headers[1]}
                      </TableHead>
                      <TableHead className="font-black text-[9px] uppercase tracking-widest text-right px-6 h-12">
                        {tab.headers[2]}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterData(tab.data).map((item: any, idx) => (
                      <TableRow
                        key={idx}
                        className={`${
                          isDarkMode
                            ? "border-white/5 hover:bg-white/[0.02]"
                            : "border-slate-50 hover:bg-slate-50/50"
                        } transition-colors`}
                      >
                        <TableCell className="px-6 py-4">
                          <span
                            className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase ${
                              isDarkMode ? "bg-white/5" : "bg-slate-100"
                            }`}
                          >
                            {item.network || item.provider || item.disco}
                          </span>
                        </TableCell>
                        <TableCell className="text-[13px] font-bold tracking-tight">
                          {item.plan ||
                            item.package ||
                            item.discount ||
                            item.type}
                        </TableCell>
                        <TableCell className="text-right px-6 py-4 font-black text-emerald-500">
                          {item.price || item.status || item.fee || item.min}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filterData(tab.data).length === 0 && (
                  <div className="py-20 text-center opacity-30 flex flex-col items-center">
                    <ZapOff size={40} className="mb-2" />
                    <p className="text-xs font-black uppercase tracking-widest">
                      No plans found
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Floating Info Footer */}
        <div
          className={`mt-10 p-6 rounded-[2.5rem] border flex items-center gap-5 ${
            isDarkMode
              ? "bg-emerald-500/5 border-emerald-500/10"
              : "bg-emerald-50 border-emerald-100"
          }`}
        >
          <div className="h-14 w-14 shrink-0 rounded-[1.2rem] bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Info size={24} />
          </div>
          <div>
            <h4 className="font-black text-sm mb-0.5">Bulk Purchase?</h4>
            <p className="text-[11px] font-medium opacity-60 leading-relaxed">
              API users and resellers enjoy up to 5% extra discount. Check your
              dashboard settings for API keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
