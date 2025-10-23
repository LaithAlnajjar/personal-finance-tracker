import { Routes, Route, BrowserRouter as Router } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ExpensesList from "./pages/ExpensesList";
import NewExpense from "./pages/NewExpense";
import ImportCSV from "./pages/ImportCSV";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<ExpensesList />} />
          <Route path="new" element={<NewExpense />} />
          <Route path="import" element={<ImportCSV />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
