import { useState, useEffect } from "react";
import { type Expense } from "../types/expense";
import { api } from "../lib/api";
import CategoryExpense from "../components/CategoryExpense";
import CategoryManager from "../components/CategoryManager";

interface Category {
  id: string;
  name: string;
}

export default function Categories() {
  const [expenses, setExpensesList] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const getExpenses = async () => {
    try {
      const expensesRes = await api.get("/api/expense");
      setExpensesList(expensesRes.data.data.expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/categories");
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    getExpenses();
    fetchCategories();
  }, []);

  return (
    <div className="w-full bg-secondary min-h-screen p-8">
      <CategoryManager
        categories={categories}
        refetchCategories={fetchCategories}
      />

      <div className="bg-white rounded-3xl shadow-md p-8 mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Update Expense Categories
        </h2>

        {expenses.length === 0 ? (
          <div className="text-gray-500 text-center py-10">
            No expenses recorded yet.
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {expenses.map((expense) => (
              <CategoryExpense
                key={expense.id}
                expense={expense}
                refetchExpenses={getExpenses}
                categories={categories}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
