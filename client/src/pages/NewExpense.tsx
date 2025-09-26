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
    console.log(response);
  };

  return (
    <form className="w-full flex flex-col p-10 gap-5" onSubmit={handleSubmit}>
      <label className="border" htmlFor="title">
        {" "}
        Title
        <input type="text" name="title" onChange={handleChange} />
      </label>
      <label className="border" htmlFor="amount">
        {" "}
        Amount
        <input type="number" name="amount" onChange={handleChange} />
      </label>
      <label className="border" htmlFor="merchant">
        {" "}
        Merchant
        <input type="text" name="merchant" onChange={handleChange} />
      </label>
      <label className="border" htmlFor="category">
        {" "}
        Category
        <input type="text" name="category" onChange={handleChange} />
      </label>
      <label className="border" htmlFor="date">
        {" "}
        Date
        <input type="date" name="date" onChange={handleChange} />
      </label>
      <label className="border" htmlFor="notes">
        {" "}
        Notes
        <input type="text" name="notes" onChange={handleChange} />
      </label>
      <button className="border" type="submit">
        Submit
      </button>
    </form>
  );
}
