import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-secondary">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-20">
        <Outlet />
      </main>
    </div>
  );
}
