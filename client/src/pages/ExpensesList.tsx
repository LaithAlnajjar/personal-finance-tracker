import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { type Expense } from "../types/expense";
import { Pencil, Save, XCircle } from "lucide-react";

export default function ExpensesList() {
  const [expenses, setExpensesList] = useState<Expense[]>([]);
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Expense>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const expensesRes = await api.get(
          `/api/expense?page=${currentPage}&limit=10`
        );
        setExpensesList(expensesRes.data.data.expenses);
        setTotalPages(expensesRes.data.data.totalPages);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    getExpenses();
  }, [currentPage]);

  const handleEditClick = (expense: Expense) => {
    setEditingExpenseId(expense.id);
    setEditFormData({
      title: expense.title,
      amount: expense.amount,
      merchant: expense.merchant,
      date: new Date(expense.date).toISOString().split("T")[0], // Format for input type="date"
    });
  };

  const handleCancelClick = () => {
    setEditingExpenseId(null);
    setEditFormData({});
  };

  const handleSaveClick = async (expenseId: number) => {
    try {
      const res = await api.put(`/api/expense/${expenseId}`, editFormData);
      const updatedExpense = res.data.data.expense;
      setExpensesList(
        expenses.map((exp) => (exp.id === expenseId ? updatedExpense : exp))
      );
      setEditingExpenseId(null);
      setEditFormData({});
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === "amount" ? parseFloat(value) : value,
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full bg-secondary min-h-screen">
      <div className="bg-white rounded-3xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Your Expenses
        </h2>

        {expenses.length === 0 && currentPage === 1 ? (
          <div className="text-gray-500 text-center py-10">
            No expenses recorded yet.
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-4">
              {expenses.map((expense) =>
                editingExpenseId === expense.id ? (
                  // Edit Mode
                  <li
                    key={expense.id}
                    className="flex flex-col gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4"
                  >
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title || ""}
                      onChange={handleFormChange}
                      className="font-semibold text-gray-800 text-lg border-b"
                    />
                    <input
                      type="text"
                      name="merchant"
                      value={editFormData.merchant || ""}
                      onChange={handleFormChange}
                      className="text-sm text-gray-500 border-b"
                    />
                    <input
                      type="number"
                      name="amount"
                      value={editFormData.amount || ""}
                      onChange={handleFormChange}
                      className="text-xl font-bold text-primary border-b text-right"
                    />
                    <input
                      type="date"
                      name="date"
                      value={editFormData.date?.toString() || ""}
                      onChange={handleFormChange}
                      className="text-sm text-gray-500 border-b text-right"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => handleSaveClick(expense.id)}>
                        <Save className="h-5 w-5 text-green-500" />
                      </button>
                      <button onClick={handleCancelClick}>
                        <XCircle className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  </li>
                ) : (
                  // Display Mode
                  <li
                    key={expense.id}
                    className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800 text-lg">
                        {expense.title || "Untitled"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {expense.category?.name ?? "Uncategorized"} •{" "}
                        {expense.merchant || "No merchant"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
                          ${expense.amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(expense.date).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => handleEditClick(expense)}
                        className="text-gray-400 hover:text-primary"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                )
              )}
            </ul>
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
          </>
        )}
      </div>
    </div>
  );
}
