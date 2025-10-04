import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/"); // redirect to protected page
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen w-full relative flex flex-row items-center justify-start gap-4 ">
      {/* Square Pattern Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          
            backgroundImage: `
              linear-gradient(45deg, transparent 75%, rgba(236,72,153,0.15) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(59,130,246,0.15) 75%)
            `,
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
          }}
     
      />
<h1  className="floating-text text-black font-bold text-center uppercase 
             text-[80px] sm:text-[60px] md:text-[80px] lg:text-[100px] 
             leading-tight tracking-tight 
             [text-shadow:_2px_2px_2px_black,_0_0_10px_rgba(0,0,0,0.2)] max-w-5xl">WELCOME LOGIN TO START</h1>
      {/* Form */}
      <form
        className="p-8 rounded-2xl  shadow-xl  shadow-black  w-100 h-100 bg-black backdrop-blur-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">Login</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="border p-2 w-full mb-2 rounded bg-white"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded bg-white"
        />
        <button
          type="submit"
          className="bg-purple-500 text-white p-2 w-full rounded hover:bg-purple-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
