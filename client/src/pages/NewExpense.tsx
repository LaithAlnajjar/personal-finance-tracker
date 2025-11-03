import React, { useState, type SyntheticEvent } from "react";
import { api } from "../lib/api";

export default function NewExpense() {
  const [input, setInput] = useState({
    title: "",
    amount: 0,
    merchant: "",
    category: "",
    date: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const response = await api.post("/api/expense", input);
  };

  return (
    <div className="grid place-content-center w-full bg-secondary ">
      <form
        className="w-200 flex flex-col p-10 gap-5 justify-center bg-white rounded-3xl shadow-md"
        onSubmit={handleSubmit}
      >
        <label
          className="flex flex-col text-gray-500 font-medium text-lg gap-1"
          htmlFor="title"
        >
          {" "}
          Title
          <input
            className="text-base p-4 h-10 w-full lg border border-gray-300 rounded-3xl focus:border-primary"
            type="text"
            name="title"
            onChange={handleChange}
          />
        </label>
        <label
          className="flex flex-col text-gray-500 font-medium text-lg gap-1"
          htmlFor="amount"
        >
          {" "}
          Amount *
          <input
            className="text-base p-4 h-10 w-full lg border border-gray-300 rounded-3xl focus:border-primary"
            type="number"
            name="amount"
            onChange={handleChange}
          />
        </label>
        <label
          className="flex flex-col text-gray-500 font-medium text-lg gap-1"
          htmlFor="merchant"
        >
          {" "}
          Merchant
          <input
            className="text-base p-4 h-10 w-full lg border border-gray-300 rounded-3xl focus:border-primary"
            type="text"
            name="merchant"
            onChange={handleChange}
          />
        </label>
        <label
          className="flex flex-col text-gray-500 font-medium text-lg gap-1"
          htmlFor="category"
        >
          {" "}
          Category
          <input
            className="text-base p-4 h-10 w-full lg border border-gray-300 rounded-3xl focus:border-primary"
            type="text"
            name="category"
            onChange={handleChange}
          />
        </label>
        <label
          className="flex flex-col text-gray-500 font-medium text-lg gap-1"
          htmlFor="date"
        >
          {" "}
          Date
          <input
            className="text-base p-4 h-10 w-full lg border border-gray-300 rounded-3xl focus:border-primary"
            type="date"
            name="date"
            onChange={handleChange}
          />
        </label>
        <label
          className="flex flex-col text-gray-500 font-medium text-lg gap-1"
          htmlFor="notes"
        >
          {" "}
          Notes
          <input
            className="text-base p-4 h-10 w-full lg border border-gray-300 rounded-3xl focus:border-primary"
            type="text"
            name="notes"
            onChange={handleChange}
          />
        </label>
        <button
          className="bg-primary text-white font-medium h-11 rounded-3xl hover:bg-teal-600 hover:cursor-pointer"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
