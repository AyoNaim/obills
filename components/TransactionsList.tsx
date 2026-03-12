import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Smartphone,
  Gift,
  Percent,
  Download,
  ChevronDown,
  Inbox,
} from "lucide-react";

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

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await fetch(
          "https://pancity.com.ng/app/api/transactions/index.php",
          {
            method: "GET",
            credentials: "include",
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

  // Calculate Summary (Simplified for this example)
  const totalIn = transactions.reduce(
    (acc, curr) =>
      parseFloat(curr.amount) > 0 && curr.status === "0"
        ? acc + parseFloat(curr.amount)
        : acc,
    0
  );

  const totalOut = transactions.reduce(
    (acc, curr) =>
      parseFloat(curr.amount) < 0
        ? acc + Math.abs(parseFloat(curr.amount))
        : acc,
    0
  );

  // Helper to determine icons based on service name
  const getIcon = (service: string) => {
    const s = service.toLowerCase();
    if (s.includes("airtime") || s.includes("data"))
      return <Smartphone className="text-blue-500" size={20} />;
    if (s.includes("bonus"))
      return <Gift className="text-emerald-500" size={20} />;
    if (s.includes("interest"))
      return <Percent className="text-purple-500" size={20} />;
    return <ArrowUpRight className="text-emerald-500" size={20} />;
  };

  if (loading)
    return <div className="p-10 text-center">Loading Transactions...</div>;

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white">
        <h1 className="text-lg font-semibold text-gray-700">Transactions</h1>
        <button className="text-emerald-600 font-medium flex items-center gap-1">
          <Download size={18} /> Download
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 p-4">
        <button className="flex-1 flex justify-between items-center bg-white border border-gray-100 rounded-lg px-4 py-2 text-sm text-gray-500">
          All Categories <ChevronDown size={16} />
        </button>
        <button className="flex-1 flex justify-between items-center bg-white border border-gray-100 rounded-lg px-4 py-2 text-sm text-gray-500">
          All Status <ChevronDown size={16} />
        </button>
      </div>

      {/* Summary Card */}
      <div className="mx-4 p-4 bg-white rounded-2xl shadow-sm mb-6">
        <div className="flex justify-between items-center mb-2">
          <button className="flex items-center gap-1 font-bold text-gray-800">
            Mar 2026 <ChevronDown size={18} />
          </button>
          <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full">
            Analysis
          </span>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-500">
            In: <b className="text-gray-800">₦{totalIn.toLocaleString()}</b>
          </span>
          <span className="text-gray-500">
            Out: <b className="text-gray-800">₦{totalOut.toLocaleString()}</b>
          </span>
        </div>
      </div>

      {/* List */}
      <div className="space-y-1">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Inbox size={48} strokeWidth={1} />
            <p className="mt-2">No transactions found</p>
          </div>
        ) : (
          transactions.map((tx, idx) => {
            const isNegative = parseFloat(tx.amount) < 0;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 bg-white p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                  {isNegative ? (
                    <ArrowDownLeft className="text-gray-400" size={20} />
                  ) : (
                    getIcon(tx.servicename)
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-800 truncate w-40">
                    {tx.servicedesc}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold ${
                      isNegative ? "text-gray-900" : "text-emerald-500"
                    }`}
                  >
                    {isNegative ? "-" : "+"}₦
                    {Math.abs(parseFloat(tx.amount)).toFixed(2)}
                  </p>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded uppercase font-bold">
                    {tx.status === "0" ? "Successful" : "Failed"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransactionPage;
