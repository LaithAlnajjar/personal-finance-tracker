import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { type Expense } from "../types/expense";

export default function ExpensesList() {
  const [expenses, setExpensesList] = useState<Expense[]>([]);

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const expensesRes = await api.get("/api/expense");
        setExpensesList(expensesRes.data.data.expenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    getExpenses();
  }, []);

  return (
    <div className="w-full bg-secondary min-h-screen">
      <div className="bg-white rounded-3xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Your Expenses
        </h2>

        {expenses.length === 0 ? (
          <div className="text-gray-500 text-center py-10">
            No expenses recorded yet.
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-lg">
                    {expense.title || "Untitled"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {expense.category || "Uncategorized"} •{" "}
                    {expense.merchant || "No merchant"}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold text-primary">
                    ${expense.amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
