import { useState, type ChangeEvent } from "react";
import { type Expense } from "../types/expense";
import { api } from "../lib/api";

interface Category {
  id: string;
  name: string;
}

interface CategoryExpenseProps {
  expense: Expense;
  categories: Category[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

export default function CategoryExpense({
  expense,
  categories,
  setExpenses,
}: CategoryExpenseProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<string>(
    expense.category?.id ?? ""
  );

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(e.target.value);
    setEditing(true);
  };

  const handleCancel = () => {
    setCategoryId(expense.category?.id ?? "");
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      const res = await api.put(`/api/expense/${expense.id}`, {
        categoryId: categoryId || null,
      });
      const updatedExpense = res.data.data.expense;
      setExpenses((prevExpenses) =>
        prevExpenses.map((exp) =>
          exp.id === updatedExpense.id ? updatedExpense : exp
        )
      );
      setEditing(false);
    } catch (error) {
      console.error("Failed to save category", error);
      alert("Failed to save. Please try again.");
    }
  };

  return (
    <li
      key={expense.id}
      className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 hover:shadow-md transition-all duration-200"
    >
      <div className="flex w-full justify-between items-center">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 text-lg truncate">
            {expense.title || "Untitled"}
          </div>
          <span className="text-sm text-gray-500 truncate">
            {expense.merchant || "No merchant"}
          </span>
        </div>

        <div className="w-32 flex-shrink-0 text-right mx-4">
          <div className="text-xl font-bold text-primary">
            ${expense.amount.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            {new Date(expense.date).toLocaleDateString()}
          </div>
        </div>

        <div className="w-48 flex-shrink-0">
          <select
            name="category"
            id="category"
            className="text-base p-2 h-10 w-full lg border border-gray-300 rounded-lg focus:border-primary bg-white"
            value={categoryId}
            onChange={handleCategoryChange}
          >
            <option value="">Uncategorized</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {editing && (
        <div className="w-full sm:w-auto flex-shrink-0 sm:ml-4 mt-4 sm:mt-0">
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="bg-primary text-white text-sm font-medium h-10 px-4 rounded-lg hover:bg-teal-600 hover:cursor-pointer transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-200 text-gray-700 text-sm font-medium h-10 px-4 rounded-lg hover:bg-gray-300 hover:cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
