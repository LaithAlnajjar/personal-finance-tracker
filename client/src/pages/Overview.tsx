import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Banknote, ClipboardCheck, Sun, Building2 } from "lucide-react";

export default function Overview() {
  const [totalExpenses, setTotalExpenses] = useState<number | undefined>(
    undefined
  );
  const [totalSpentThisMonth, setTotalSpentThisMonth] = useState<
    number | undefined
  >(undefined);
  const [dailySpending, setDailySpending] = useState<number | undefined>(
    undefined
  );
  const [highestSpendingCategory, setHighestSpendingCategory] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    const getTotalExpenses = async () => {
      try {
        const res = await api.get("/api/expense/getTotalExpenses");
        setTotalExpenses(res.data.data.totalEpxenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    const getTotalSpentThisMonth = async () => {
      try {
        const res = await api.get("/api/expense/getTotalSpentThisMonth");
        const total = res.data.data.total;
        const roundedTotal = total.toFixed(2);
        setTotalSpentThisMonth(roundedTotal);
      } catch (error) {
        console.error("Error fectching total spent this month", error);
      }
    };
    const getAverageDailySpending = async () => {
      try {
        const res = await api.get("/api/expense/getAvergeDailySpending");
        const total = res.data.data.totalAverageSpending;
        const roundedTotal = total.toFixed(2);
        setDailySpending(roundedTotal);
      } catch (error) {
        console.error("Error fectching average daily spending", error);
      }
    };
    const getHighestSpendingCategory = async () => {
      try {
        const res = await api.get("/api/expense/getHighestSpendingCategory");
        const highestSpending = res.data.data.highestSpendingCategory;
        setHighestSpendingCategory(highestSpending);
      } catch (error) {
        console.error("Error highestSpendingCategory", error);
      }
    };
    getTotalExpenses();
    getTotalSpentThisMonth();
    getAverageDailySpending();
    getHighestSpendingCategory();
  }, []);

  return (
    <div>
      <div className="flex justify-evenly flex-wrap gap-6 ">
        {/* Total Spending This Month */}
        <div className="flex p-8 rounded-xl bg-white shadow items-center gap-7 w-80">
          <div className="bg-[#d8f3dc] rounded-full h-17 w-17 flex items-center justify-center">
            <Banknote size={36} color="#2d6a4f" />
          </div>
          <div className="text-gray-600">
            <div className="text-xl text-black font-bold">
              {totalSpentThisMonth ?? 0}
            </div>
            Total Spending This Month
          </div>
        </div>
        {/* Total Expenses Tracked */}
        <div className="flex p-8 rounded-xl bg-white shadow items-center gap-7 w-80">
          <div className="bg-[#e0e7ff] rounded-full h-17 w-17 flex items-center justify-center">
            <ClipboardCheck size={36} color="#3730a3" />
          </div>
          <div className="text-gray-600">
            <div className="text-xl text-black font-bold">
              {totalExpenses ?? 0}
            </div>
            Total Expenses Tracked
          </div>
        </div>
        {/* Average Daily Spending */}
        <div className="flex p-8 rounded-xl bg-white shadow items-center gap-7 w-80">
          <div className="bg-[#fff3bf] rounded-full h-17 w-17 flex items-center justify-center">
            <Sun size={36} color="#b45309" />
          </div>
          <div className="text-gray-600">
            <div className="text-xl text-black font-bold">
              {dailySpending ?? 0}
            </div>
            Average Daily Spending
          </div>
        </div>
        {/* Highest Spending Category */}
        <div className="flex p-8 rounded-xl bg-white shadow items-center gap-7 w-80">
          <div className="bg-[#fde2e4] rounded-full h-17 w-17 flex items-center justify-center">
            <Building2 size={36} color="#b91c1c" />
          </div>
          <div className="text-gray-600">
            <div className="text-xl text-black font-bold">
              {highestSpendingCategory ?? "—"}
            </div>
            Highest Spending Category
          </div>
        </div>
      </div>
    </div>
  );
}
