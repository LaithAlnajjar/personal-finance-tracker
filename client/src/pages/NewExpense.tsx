import {
  useState,
  useEffect,
  type SyntheticEvent,
  type ChangeEvent,
} from "react";
import { api } from "../lib/api";

interface Category {
  id: string;
  name: string;
}

export default function NewExpense() {
  const [input, setInput] = useState({
    title: "",
    amount: 0,
    merchant: "",
    date: "",
    categoryId: "",
    notes: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories");
        setCategories(response.data.data.categories);
        const defaultCat = response.data.find(
          (c: Category) => c.name === "Uncategorized"
        );
        if (defaultCat) {
          setInput((prev) => ({ ...prev, categoryId: defaultCat.id }));
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await api.post("/api/expense", input);
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
            value={input.title}
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
            value={input.amount}
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
            value={input.merchant}
            onChange={handleChange}
          />
        </label>
        <label
          className="flex flex-col text-gray-500 font-medium text-lg gap-1"
          htmlFor="categoryId"
        >
          {" "}
          Category
          <select
            className="text-base p-4 h-12 w-full lg border border-gray-300 rounded-3xl focus:border-primary bg-white"
            name="categoryId"
            value={input.categoryId}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
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
            value={input.date}
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
            value={input.notes}
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
