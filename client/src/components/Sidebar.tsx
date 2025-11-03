import { Link } from "react-router";
import { Plus, Upload, List, PieChart } from "lucide-react";
import logo from "../assets/expensia-high-resolution-logo-transparent.png";

export default function Sidebar() {
  return (
    <div className="h-screen w-[20vw] pt-10 pl-12 pr-12 bg-white font-medium font-primary">
      <div className="w-40 mb-18">
        {" "}
        <img className="w-85" src={logo} alt="" />
      </div>

      <ul className="flex flex-col gap-3">
        <li className="mb-6">
          <Link
            to="new"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary p-3.5 text-white"
          >
            Add Expense
            <Plus size={20} />
          </Link>
        </li>

        <li className="text-gray-500">
          <Link
            to="overview"
            className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
          >
            <PieChart size={20} />
            Overview
          </Link>
        </li>

        <li className="text-gray-500">
          <Link
            to=""
            className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
          >
            <List size={20} />
            Expense List
          </Link>
        </li>

        <li className="text-gray-500">
          <Link
            to="import"
            className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
          >
            <Upload size={20} />
            Import CSV
          </Link>
        </li>
      </ul>
    </div>
  );
}
