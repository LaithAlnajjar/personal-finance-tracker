import { Routes, Route, BrowserRouter as Router } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ExpensesList from "./pages/ExpensesList";
import NewExpense from "./pages/NewExpense";
import ImportCSV from "./pages/ImportCSV";
import Overview from "./pages/Overview";
import Categories from "./pages/Categories";
import Anomalies from "./pages/Anomalies";
import Model from "./pages/Model";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path="expensesList" element={<ExpensesList />} />
          <Route path="new" element={<NewExpense />} />
          <Route path="import" element={<ImportCSV />} />
          <Route path="settings/categories" element={<Categories />} />
          <Route path="anomalies" element={<Anomalies />} />
          <Route path="settings/model" element={<Model />} />
          <Route path="settings/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
