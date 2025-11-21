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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getExpenses = async (page = 1) => {
    try {
      const expensesRes = await api.get(`/api/expense?page=${page}&limit=10`);
      setExpensesList(expensesRes.data.data.expenses);
      setTotalPages(expensesRes.data.data.totalPages);
      setCurrentPage(page);
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
    fetchCategories();
  }, []);

  useEffect(() => {
    getExpenses(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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

        {expenses.length === 0 && currentPage === 1 ? (
          <div className="text-gray-500 text-center py-10">
            No expenses recorded yet.
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {expenses.map((expense) => (
              <CategoryExpense
                key={expense.id}
                expense={expense}
                setExpenses={setExpensesList}
                categories={categories}
              />
            ))}
          </ul>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
