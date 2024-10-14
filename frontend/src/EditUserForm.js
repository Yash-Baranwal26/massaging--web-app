import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function EditUserForm({ userId, onClose, onSave }) {
    const navigate = useNavigate()
  const [user, setUser] = useState({
    name: '',
    email: '',
    mobile: '',
    role: '',
    password: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:1234/getUser/${userId}`);
        setUser(response.data);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    fetchUserData();
  }, [userId]);

  const inputHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const dataSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:1234/updateUser', { ...user, id: userId });
      onSave(user); 
      onClose();
    } catch (err) {
      console.error('Failed to update user data:', err);
    }
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`http://localhost:1234/deleteUser/${userId}`);
    navigate('/')
      alert('User deleted successfully');
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-96">

        <button 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={onClose}
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">Edit User Details</h2>
        <form className="flex flex-col space-y-4" onSubmit={dataSubmit}>
          <div className="w-full">
            <label className="block mb-1 text-sm text-gray-600" htmlFor="name">Name</label>
            <input
              className="form-input w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              id="name"
              placeholder="Enter Your Name"
              name="name"
              value={user.name || ''}
              onChange={inputHandler}
              required
            />
          </div>
          <div className="w-full">
            <label className="block mb-1 text-sm text-gray-600" htmlFor="email">Email</label>
            <input
              className="form-input w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="email"
              id="email"
              placeholder="Enter Your Email"
              name="email"
              value={user.email || ''}
              onChange={inputHandler}
              required
            />
          </div>
          <div className="w-full">
            <label className="block mb-1 text-sm text-gray-600" htmlFor="mobile">Mobile No.</label>
            <input
              className="form-input w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="number"
              id="mobile"
              placeholder="Mobile No."
              name="mobile"
              value={user.mobile || ''}
              onChange={inputHandler}
              required
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 text-sm text-gray-600" htmlFor="role">Select Role</label>
            <select
              className="form-select w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              id="role"
              name="role"
              value={user.role || ''}
              onChange={inputHandler}
              required
            >
              <option value="" disabled>Select Role</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
              <option value="Institute">Institute</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block mb-1 text-sm text-gray-600" htmlFor="password">Password</label>
            <input
              className="form-input w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              id="password"
              placeholder="Enter Your Password"
              name="password"
              value={user.password || ''}
              onChange={inputHandler}
              required
            />
          </div>


          <div className="flex justify-between items-center mt-4">

            <button
              type="button"
              className="bg-red-500 text-white py-2 px-4 rounded-md text-lg hover:bg-red-600 transition duration-300"
              onClick={deleteUser}
            >
              Delete
            </button>

            <button
              type="submit"
              className="bg-indigo-500 text-white py-2 px-4 rounded-md text-lg hover:bg-indigo-600 transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
