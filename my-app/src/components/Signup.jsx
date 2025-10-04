import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", age: "", gender: "", password: "" });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Already have account");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left side: Form */}
      <div className="flex-1 flex justify-center items-center p-6 lg:p-12 relative">
        {/* Background pattern */}
        <div
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 75%, rgba(236,72,153,0.15) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(59,130,246,0.15) 75%)
            `,
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
          }}
        />
        <div className="w-full max-w-md bg-black/80 rounded-xl shadow-lg p-8 lg:p-12 z-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-center text-purple-600 mb-2">Create an Account</h1>
          <p className="text-center text-gray-300 mb-8">Join us and start your journey!</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-100">Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-icons text-gray-400">person</span>
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="John Doe"
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-purple-600 focus:ring-purple-600 sm:text-lg placeholder:text-lg bg-gray-50 text-gray-900"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-100">Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-icons text-gray-400">email</span>
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-purple-600 focus:ring-purple-600 sm:text-lg placeholder:text-lg bg-gray-50 text-gray-900"
                  required
                />
              </div>
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-100">Age</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    name="age"
                    id="age"
                    placeholder="25"
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 focus:border-purple-600 focus:ring-purple-600 sm:text-lg placeholder:text-lg bg-gray-50 text-gray-900"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-100">Gender</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <select
                    name="gender"
                    id="gender"
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 focus:border-purple-600 focus:ring-purple-600 sm:text-lg placeholder:text-lg bg-gray-50 text-gray-900"
                    required
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-100">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-purple-600 focus:ring-purple-600 sm:text-lg placeholder:text-lg bg-gray-50 text-gray-900"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 transition"
              >
                Sign up
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-300">
            Already have an account?{" "}
            <a className="font-medium text-purple-600 hover:text-purple-700" href="/login">
              Sign in
            </a>
          </p>
        </div>
      </div>

      {/* Right side background for larger screens */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative bg-purple-100">
        <div
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(139,92,246,0.15) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(16,185,129,0.15) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(236,72,153,0.15) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(59,130,246,0.15) 75%)
            `,
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
          }}
        />
        <div className="relative z-10 p-12 text-center">
          <h2 className="text-4xl font-bold text-black mb-4">Start your journey with us.</h2>
          <p className="text-lg text-gray-900">Discover a world of possibilities. Our platform is designed to help you succeed and grow.</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
