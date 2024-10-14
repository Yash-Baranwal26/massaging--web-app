import axios from 'axios';
import './App.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [user, setUser] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const inputHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const dataSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:1234/userLogin', user)
      .then(res => {
        const loggedInUser = res.data.user;
        localStorage.setItem('user', JSON.stringify(loggedInUser));

        navigate('/home')
      })
      .catch(err => {
        alert(err.response.data.err);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-6 rounded-md w-full max-w-lg">
        <h4 className="text-center mb-6 text-2xl font-semibold text-gray-700">User Login</h4>
        <form className="flex flex-col space-y-4" onSubmit={dataSubmit}>
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

          <button type="submit" className="w-full bg-indigo-500 text-white py-2 rounded-md text-lg hover:bg-indigo-600 transition duration-300">
            Login
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm text-gray-600">
          <p className="hover:underline cursor-pointer"><Link to='/registration'>Register</Link></p>
        </div>
      </div>
    </div>
  );
}

export default App;
