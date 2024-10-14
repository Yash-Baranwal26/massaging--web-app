import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Registration() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
    password: "",
  });

  const inputHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const dataSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:1234/userregistration", user)
      .then((res) => {
        alert(res.data.msg);
        navigate("/");
      })
      .catch((err) => {
        alert(err.response.data.err);
      });
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-6 rounded-md w-full max-w-lg">
        <h4 className="text-center mb-6 text-2xl font-semibold text-gray-700">
          User Registration
        </h4>

        <form className="flex flex-col space-y-4" onSubmit={dataSubmit}>
          <div className="w-full">
            <label className="block mb-1 text-sm text-gray-600" htmlFor="name">
              Name
            </label>
            <input
              className="form-input w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              id="name"
              placeholder="Enter Your Name"
              name="name"
              value={user.name || ""}
              onChange={inputHandler}
              required
            />
          </div>
          <div className="w-full">
            <label className="block mb-1 text-sm text-gray-600" htmlFor="email">
              Email
            </label>
            <input
              className="form-input w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="email"
              id="email"
              placeholder="Enter Your Email"
              name="email"
              value={user.email || ""}
              onChange={inputHandler}
              required
            />
          </div>
          <div className="w-full">
            <label
              className="block mb-1 text-sm text-gray-600"
              htmlFor="mobile"
            >
              Mobile No.
            </label>
            <input
              className="form-input w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="number"
              id="mobile"
              placeholder="Mobile No."
              name="mobile"
              value={user.mobile || ""}
              onChange={inputHandler}
              required
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 text-sm text-gray-600" htmlFor="role">
              Select Role
            </label>
            <select
              className="form-select w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              id="role"
              name="role"
              value={user.role}
              onChange={inputHandler}
              required
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
              <option value="Institute">Institute</option>
            </select>
          </div>

          <div className="w-full">
            <label
              className="block mb-1 text-sm text-gray-600"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="form-input w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              id="password"
              placeholder="Enter Your Password"
              name="password"
              value={user.password || ""}
              onChange={inputHandler}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-md text-lg hover:bg-indigo-600 transition duration-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
