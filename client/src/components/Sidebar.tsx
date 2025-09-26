import { Link } from "react-router";

export default function Sidebar() {
  return (
    <div className="h-screen w-[20vw] pt-10 pl-10 pr-10">
      <div> </div>
      <ul className="flex flex-col gap-3">
        <li className="border p-1">
          {" "}
          <Link to="new">Add Expense</Link>
        </li>
        <li className="border p-1">
          {" "}
          <Link to="">Expense List</Link>
        </li>
        <li className="border p-1"> import CSV</li>
      </ul>
    </div>
  );
}
