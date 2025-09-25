import React, { useState, type SyntheticEvent } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
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
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        email
        <input type="email" name="email" id="email" onChange={handleChange} />
      </label>
      <label>
        password
        <input
          type="password"
          name="password"
          id="password"
          onChange={handleChange}
        />
      </label>
      <button type="submit"></button>
    </form>
  );
}
