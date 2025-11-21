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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f97316",
  "#ec4899",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#14b8a6",
  "#6366f1",
  "#d946ef",
  "#6b7280",
  "#a855f7",
  "#22c55e",
  "#0ea5e9",
  "#f43f5e",
  "#b91c1c",
  "#1d4ed8",
  "#047857",
  "#c2410c",
  "#be185d",
];

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
  const [highestSpendingCategory, setHighestSpendingCategory] = useState<{
    name: string;
    total: number;
  } | null>(null);
  const [expensesThisMonth, setExpensesThisMonth] = useState<Expense[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const params = new URLSearchParams({
        from: startDate.toISOString(),
        to: now.toISOString(),
      });
      const endpoints = [
        "/api/expense/getTotalExpenses",
        "/api/expense/getTotalSpentThisMonth",
        "/api/expense/getAverageDailySpending",
        "/api/expense/getHighestSpendingCategory",
        `/api/expense?${params.toString()}`,
      ];

      const results = await Promise.allSettled(
        endpoints.map((endpoint) => api.get(endpoint))
      );

      if (results[0].status === "fulfilled") {
        setTotalExpenses(results[0].value.data.data.totalEpxenses);
      }
      if (results[1].status === "fulfilled") {
        const total = results[1].value.data.data.total;
        setTotalSpentThisMonth(Number(total.toFixed(2)));
      }
      if (results[2].status === "fulfilled") {
        const total = results[2].value.data.data.totalAverageSpending;
        setDailySpending(Number(total.toFixed(2)));
      }
      if (results[3].status === "fulfilled") {
        setHighestSpendingCategory(
          results[3].value.data.data.highestSpendingCategory
        );
      }
      if (results[4].status === "fulfilled") {
        setExpensesThisMonth(results[4].value.data.data.expenses);
      }

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(`Error fetching ${endpoints[index]}:`, result.reason);
        }
      });
    };
    fetchData();
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

    return result;
  })();

  const categorySpending = (() => {
    const categoryMap: Record<string, number> = {};
    expensesThisMonth.forEach((exp) => {
      const key = exp.category?.name?.toLowerCase() || "uncategorized";
      categoryMap[key] = (categoryMap[key] || 0) + exp.amount;
    });

    const result: { category: string; amount: number }[] = [];
    for (const cat in categoryMap) {
      const str = cat;
      const modStr = str[0].toUpperCase() + str.slice(1);
      result.push({ category: modStr, amount: categoryMap[cat] });
    }
    return result;
  })();

  return (
    <div>
      <div className="flex justify-evenly flex-wrap gap-6 ">
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
        <div className="flex p-8 rounded-xl bg-white shadow items-center gap-7 w-80">
          <div className="bg-[#fde2e4] rounded-full h-17 w-17 flex items-center justify-center">
            <Building2 size={36} color="#b91c1c" />
          </div>
          <div className="text-gray-600">
            <div className="text-xl text-black font-bold">
              {highestSpendingCategory?.name ?? "—"}
            </div>
            Highest Spending Category
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 mt-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3 bg-white p-4 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 ml-4">
              Monthly Spending Trend
            </h3>
            <div>
              <ResponsiveContainer width="100%" aspect={2.5}>
                <LineChart
                  data={dailyExpenses}
                  margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
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
                    tickFormatter={(value) => `$${value}`}
                  />
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
                  <Line
                    type="monotone"
                    dataKey="amount"
                    name="Spending"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      strokeWidth: 2,
                      fill: "#fff",
                      stroke: "#10b981",
                    }}
                    activeDot={{ r: 7 }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ fontSize: 14, fontWeight: "bold" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="lg:w-1/3 bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Spending by Category
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categorySpending}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  labelLine={false}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                  }) => {
                    if (
                      cx == null ||
                      cy == null ||
                      midAngle == null ||
                      innerRadius == null ||
                      outerRadius == null ||
                      percent == null
                    ) {
                      return null;
                    }
                    const RADIAN = Math.PI / 180;
                    const radius =
                      innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    if (percent < 0.05) return null;
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={12}
                        fontWeight="bold"
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {categorySpending.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                />
                <Legend
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                  wrapperStyle={{
                    paddingTop: "10px",
                    textTransform: "capitalize",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="w-full bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Spending by Category
          </h3>
          <ResponsiveContainer width="100%" aspect={3.5}>
            <BarChart
              data={categorySpending}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 12, fill: "#4b5563" }}
                axisLine={{ stroke: "#9ca3af" }}
                tickLine={false}
                className="capitalize"
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#4b5563" }}
                axisLine={{ stroke: "#9ca3af" }}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
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
              <Bar dataKey="amount" name="Spending">
                {categorySpending.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="capitalize"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
