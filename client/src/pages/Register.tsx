import React, { useState, type SyntheticEvent } from "react";
import { api } from "../lib/api";

export default function Register() {
  const [input, setInput] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const reponse = await api.post("/api/register", input);
    console.log(reponse);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        email
        <input type="email" name="email" id="email" onChange={handleChange} />
      </label>
      <label htmlFor="username">
        <input
          type="text"
          name="username"
          id="username"
          onChange={handleChange}
        />
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
