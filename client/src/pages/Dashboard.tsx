import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router";

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar></Sidebar>
      <Outlet></Outlet>
    </div>
  );
}
