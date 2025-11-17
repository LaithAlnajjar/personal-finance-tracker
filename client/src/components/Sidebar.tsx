import { Link } from "react-router";
import {
  Plus,
  Upload,
  List,
  PieChart,
  Settings,
  LayoutList,
  LogOut,
  AlertTriangle,
  BrainCircuit,
} from "lucide-react";
import logo from "../assets/expensia-high-resolution-logo-transparent.png";

export default function Sidebar() {
  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <div className="h-screen w-[20vw] pt-10 pl-12 pr-12 bg-white font-medium font-primary flex flex-col justify-between">
      <div>
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
              to=""
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
            >
              <PieChart size={20} />
              Overview
            </Link>
          </li>

          <li className="text-gray-500">
            <Link
              to="expensesList"
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
            >
              <List size={20} />
              Expense List
            </Link>
          </li>

          <li className="text-gray-500">
            <Link
              to="anomalies"
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
            >
              <AlertTriangle size={20} />
              Anomalies
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

          <li className="mt-4 mb-2 text-xs font-semibold text-gray-400 uppercase">
            Settings
          </li>

          <li className="text-gray-500">
            <Link
              to="settings/categories"
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
            >
              <LayoutList size={20} />
              Categories
            </Link>
          </li>

          <li className="text-gray-500">
            <Link
              to="settings/model"
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
            >
              <BrainCircuit size={20} />
              Model
            </Link>
          </li>

          <li className="text-gray-500">
            <Link
              to="settings/profile"
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
            >
              <Settings size={20} />
              Profile
            </Link>
          </li>
        </ul>
      </div>

      <div className="pb-10">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg p-2 text-red-500 hover:bg-red-50"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </div>
  );
}
