import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Banknote, ClipboardCheck, Sun, Building2 } from "lucide-react";
import { type Expense } from "../types/expense";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Legend,
  Tooltip,
} from "recharts";

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
  const [expensesThisMonth, setExpensesThisMonth] = useState<Expense[]>([]);

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
    const getExpensesThisMonth = async () => {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const params = new URLSearchParams({
        from: startDate.toISOString(),
        to: now.toISOString(),
      });

      const res = await api.get(`/api/expense?${params.toString()}`);
      setExpensesThisMonth(res.data.data.expenses);
    };
    getTotalExpenses();
    getTotalSpentThisMonth();
    getAverageDailySpending();
    getHighestSpendingCategory();
    getExpensesThisMonth();
  }, []);

  const dailyExpenses = (() => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0);

    const dailyMap: Record<string, number> = {};
    expensesThisMonth.forEach((exp) => {
      const key = new Date(exp.date).toISOString().split("T")[0];
      dailyMap[key] = (dailyMap[key] || 0) + exp.amount;
    });

    const result: { date: string; amount: number }[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const key = current.toISOString().split("T")[0];

      result.push({
        date: current.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        amount: dailyMap[key] || 0,
      });

      current.setDate(current.getDate() + 1);
    }
    console.log(result);

    return result;
  })();

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
      <div>
        <ResponsiveContainer width="100%" aspect={3}>
          <LineChart
            data={dailyExpenses}
            margin={{ top: 20, right: 50, left: 20, bottom: 20 }}
          >
            {/* X and Y axes */}
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#4b5563" }}
              axisLine={{ stroke: "#9ca3af" }}
              tickLine={false}
            />
            <YAxis
              dataKey="amount"
              tick={{ fontSize: 12, fill: "#4b5563" }}
              axisLine={{ stroke: "#9ca3af" }}
              tickLine={false}
              domain={["auto", "auto"]}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#f9fafb",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                padding: 10,
              }}
              labelStyle={{ fontWeight: "bold" }}
              formatter={(value: number) => `$${value.toFixed(2)}`}
            />

            {/* Line */}
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "#10b981" }}
              activeDot={{ r: 7 }}
            />

            {/* Optional legend */}
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ fontSize: 14, fontWeight: "bold" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
