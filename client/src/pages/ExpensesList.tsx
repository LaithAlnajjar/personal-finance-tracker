import { useState, useEffect } from "react";
import { api } from "../lib/api";

type Expense = {
  id: number;
  title: string;
  amount: number;
  category?: string;
  merchant: string;
  date: Date;
  notes?: string;
};

export default function ExpensesList() {
  const [expenses, setExpensesList] = useState([]);
  useEffect(() => {
    const getExpenses = async () => {
      const expensesRes = await api.get("/api/expense");
      setExpensesList(expensesRes.data.data.expenses);
      console.log(expensesRes);
    };
    getExpenses();
  }, []);
  return (
    <div className="p-10">
      <ul>
        {expenses.map((expense: Expense) => {
          return (
            <li className="flex gap-15  border p-1 pl-4 pr-4 " key={expense.id}>
              {" "}
              <div> {expense.title}</div>
              <div> {expense.amount} </div>
              <div> {expense.merchant} </div>
              <div> {expense.category} </div>
              <div> {expense.date.toString()} </div>
              <div> {expense.notes} </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
