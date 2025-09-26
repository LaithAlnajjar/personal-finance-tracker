import React, { useState, type SyntheticEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";
import loginImage from "../assets/login.jpg";
import logo from "../assets/expensia-high-resolution-logo-transparent.png";

export default function Login() {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const auth = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await auth?.login(input);
    if (response) {
      console.log(response);
      navigate("/dashboard");
    }
  };

  return (
    <div className=" h-screen flex justify-center ">
      <div
        className="p-8 h-screen w-[50vw] flex flex-col justify-center items-center gap-5
      "
      >
        <div className="w-max">
          <img className="w-85" src={logo} alt="" />
        </div>
        <div>
          <div className="flex flex-col pt-8">
            <div className="font-medium text-xl">Welcome Back</div>
            <div className="text-gray-500">Let's track your expenses</div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="w-100 flex flex-col pt-8 gap-8"
          >
            <label className="flex flex-col text-gray-500 font-medium text-lg  gap-1">
              Email
              <input
                className="text-base p-4 h-10 w-full lg border border-gray-300 rounded-3xl focus:border-primary"
                placeholder="example@gmail.com"
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
              />
            </label>
            <label className="flex flex-col text-gray-500 text-lg font-medium gap-1">
              Password
              <input
                className="text-base p-4 h-10 w-full border border-gray-300 rounded-3xl focus:border-primary"
                placeholder="XXXXXXXX"
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
              />
            </label>
            <button
              className="bg-primary text-white h-11 rounded-3xl hover:bg-teal-600 hover:cursor-pointer"
              type="submit"
            >
              Login
            </button>
            <div className="text-center">
              Don't have an account?{" "}
              <Link
                to={"/register"}
                className="text-primary font-bold hover:text-teal-600 hover:cursor-pointer"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
      <div className="h-screen w-[50vw]">
        <img src={loginImage} alt="" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
