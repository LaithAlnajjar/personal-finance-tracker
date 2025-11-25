import React, { useState, type SyntheticEvent } from "react";
import { useNavigate, Link } from "react-router";
import { api } from "../lib/api";
import logo from "../assets/expensia-high-resolution-logo-transparent.png";
import loginImage from "../assets/login.jpg";

export default function Register() {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/api/register", input);
      navigate("/");
    } catch (err: any) {
      const errorMessage =
        err.response.data.message ||
        "Failed to create account. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center">
      <div className="p-8 h-screen w-[50vw] flex flex-col justify-center items-center gap-5">
        <div className="flex self-ce">
          <img className="w-85" src={logo} alt="logo" />
        </div>

        <div className=" max-w-md">
          <div className="flex flex-col pt-8">
            <div className="font-medium text-xl">Create an account</div>
            <div className="text-gray-500">
              Join and start tracking your expenses
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mt-4 border border-red-200">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="w-100 flex flex-col pt-8 gap-6"
          >
            <label className="flex flex-col text-gray-500 font-medium text-lg gap-1">
              Username
              <input
                className="text-base p-4 h-10 w-full border border-gray-300 rounded-3xl focus:border-primary"
                placeholder="Example123"
                type="text"
                name="name"
                id="name"
                value={input.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="flex flex-col text-gray-500 font-medium text-lg gap-1">
              Email
              <input
                className="text-base p-4 h-10 w-full border border-gray-300 rounded-3xl focus:border-primary"
                placeholder="example@gmail.com"
                type="email"
                name="email"
                id="email"
                value={input.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="flex flex-col text-gray-500 font-medium text-lg gap-1">
              Password
              <input
                className="text-base p-4 h-10 w-full border border-gray-300 rounded-3xl focus:border-primary"
                placeholder="XXXXXXXX"
                type="password"
                name="password"
                id="password"
                value={input.password}
                onChange={handleChange}
                required
              />
            </label>

            <label className="flex flex-col text-gray-500 font-medium text-lg gap-1">
              Confirm password
              <input
                className="text-base p-4 h-10 w-full border border-gray-300 rounded-3xl focus:border-primary"
                placeholder="Repeat your password"
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={input.confirmPassword}
                onChange={handleChange}
                required
              />
            </label>

            <button
              className="bg-primary text-white h-11 rounded-3xl hover:bg-teal-600 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Log"}
            </button>

            <div className="text-center">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-primary font-bold hover:text-teal-600 hover:cursor-pointer"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="h-screen w-[50vw]">
        <img
          src={loginImage}
          alt="register"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
