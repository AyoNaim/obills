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
  Loader2,
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
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [pricingData, setPricingData] = useState({
    data: [],
    airtime: [
      { network: "MTN", discount: "2% Off", status: "Instant" },
      { network: "Airtel", discount: "2% Off", status: "Instant" },
      { network: "Glo", discount: "3% Off", status: "Instant" },
      { network: "9Mobile", discount: "4% Off", status: "Instant" },
    ],
    cable: [],
    electricity: [
      { disco: "Ikeja Electric", type: "Prepaid", fee: "₦0", min: "₦500" },
      { disco: "Eko Electric", type: "Prepaid", fee: "₦0", min: "₦500" },
      {
        disco: "Abuja Electric",
        type: "Prepaid",
        fee: "₦1,000",
        min: "₦1,000",
      },
    ],
  });

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("app_theme");
    setIsDarkMode(savedTheme !== "light");
    fetchDynamicPricing();
  }, []);

  const getHandshake = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `Token ${y}${m}${d}`;
  };

  // Helper for Data Networks
  const getNetworkName = (id: any) => {
    const val = String(id);
    const maps: any = {
      "1": "Airtel",
      "2": "Glo",
      "3": "9Mobile",
      "6": "MTN",
      mtn: "MTN",
      glo: "Glo",
      airtel: "Airtel",
    };
    return maps[val] || maps[val.toLowerCase()] || "Network";
  };

  // Helper for Cable Providers based on your sample data (cableprovider: "2")
  const getCableProvider = (id: any) => {
    const val = String(id);
    const maps: any = {
      "1": "GOtv",
      "2": "DStv",
      "3": "Startimes",
      "4": "Showmax",
    };
    return maps[val] || "Cable";
  };

  const fetchDynamicPricing = async () => {
    try {
      setIsLoading(true);
      const token = getHandshake();

      const [dataRes, cableRes] = await Promise.all([
        fetch("https://obills.com.ng/app/api/data/plans/index.php", {
          method: "POST",
          headers: { Authorization: token },
        }),
        fetch("https://obills.com.ng/app/api/cabletv/plans/index.php", {
          method: "POST",
          headers: { Authorization: token },
        }),
      ]);

      const dataResult = await dataRes.json();
      const cableResult = await cableRes.json();

      setPricingData((prev) => ({
        ...prev,
        data: dataResult.status === "success" ? dataResult.data : [],
        cable: cableResult.status === "success" ? cableResult.plans : [],
      }));
    } catch (error) {
      console.error("Failed to fetch pricing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = async () => {
    await Haptics.impact({ style: ImpactStyle.Light });
    router.back();
  };

  const filterData = (list: any[]) => {
    const safeList = list || [];
    return safeList.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  if (!mounted) return null;

  return (
    <div
      className={`w-full min-h-screen pt-safe pb-10 font-sans transition-colors duration-500 overflow-x-hidden ${
        isDarkMode ? "bg-[#0f0a14] text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
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

      <div className="px-6 mb-8">
        <h1 className="text-4xl font-black tracking-tighter mb-2">
          Affordable <br />
          <span className="text-emerald-500">Connections.</span>
        </h1>
        <p className="text-sm font-medium opacity-60">
          Last Updated: Today,{" "}
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="px-5 mb-8">
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"
            size={18}
          />
          <Input
            placeholder="Search network, plan or provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`h-14 pl-12 rounded-[1.5rem] border-none transition-all ${
              isDarkMode ? "bg-white/5 focus:bg-white/10" : "bg-white shadow-xl"
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
              className="rounded-[1.5rem] data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              <Wifi size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="airtime"
              className="rounded-[1.5rem] data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              <Phone size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="cable"
              className="rounded-[1.5rem] data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              <Tv size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="utility"
              className="rounded-[1.5rem] data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              <Zap size={18} />
            </TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : (
            [
              {
                id: "data",
                data: pricingData.data,
                headers: ["Network", "Plan", "Price"],
              },
              {
                id: "airtime",
                data: pricingData.airtime,
                headers: ["Network", "Discount", "Status"],
              },
              {
                id: "cable",
                data: pricingData.cable,
                headers: ["cableprovider", "name", "userprice"],
              },
              {
                id: "utility",
                data: pricingData.electricity,
                headers: ["Disco", "Type", "Min"],
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
                      <TableRow className="border-none">
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
                            isDarkMode ? "border-white/5" : "border-slate-50"
                          }`}
                        >
                          <TableCell className="px-6 py-4">
                            <span
                              className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase ${
                                isDarkMode ? "bg-white/5" : "bg-slate-100"
                              }`}
                            >
                              {tab.id === "data"
                                ? getNetworkName(item.datanetwork)
                                : tab.id === "cable"
                                ? getCableProvider(item.cableprovider)
                                : item.network || item.provider || item.disco}
                            </span>
                          </TableCell>
                          <TableCell className="text-[13px] font-bold tracking-tight">
                            {item.name ||
                              item.plan_name ||
                              item.discount ||
                              item.type}
                          </TableCell>
                          <TableCell className="text-right px-6 py-4 font-black text-emerald-500">
                            {`₦${
                              item.userprice ||
                              item.price ||
                              item.min ||
                              item.status
                            }`}
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
            ))
          )}
        </Tabs>

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
              Resellers enjoy extra discounts. Dashboard settings contain your
              API keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
