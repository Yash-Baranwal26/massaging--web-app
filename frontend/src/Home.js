import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FiLogOut, FiEdit } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Chat from './Chat';
import EditUserForm from './EditUserForm'; 

export default function Home() {
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false); 

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
      updateUserOnlineStatus(loggedInUser.id, true); 
    }

    fetchData();

    const handleOnline = () => {
      if (loggedInUser) {
        updateUserOnlineStatus(loggedInUser.id, true);
      }
    };

    const handleOffline = () => {
      if (loggedInUser) {
        updateUserOnlineStatus(loggedInUser.id, false);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:1234/fetchDetail");
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateUserOnlineStatus = async (userId, status) => {
    if (userId) {
      try {
        await axios.post("http://localhost:1234/updateOnlineStatus", { userId, isOnline: status });
        console.log(`User ${userId} is now ${status ? 'online' : 'offline'}`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    updateUserOnlineStatus(user.id, false); 
    navigate('/');
  };

  const handleChatOpen = (userToChat) => {
    setSelectedUser(userToChat);
  };

  const handleEditClick = () => {
    setIsEditFormVisible(true); 
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      await axios.post("http://localhost:1234/updateUser", updatedUser); 
      setUser(updatedUser); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {user && (
        <nav className="flex items-center justify-between bg-blue-600 p-4 shadow-md">
          <h2 className="text-white text-2xl md:text-3xl font-semibold tracking-wide">
            {`${user.name} (${user.role})`}
          </h2>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleEditClick} 
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-300 focus:outline-none"
            >
              <FiEdit className="text-blue-600" size={24} />
            </button>
            <button onClick={handleLogout} className="flex items-center bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-full transition duration-300 shadow-sm focus:outline-none">
              <FiLogOut className="mr-2 text-white" size={20} />
              Logout
            </button>
          </div>
        </nav>
      )}

      <div className="flex">
        <div className="w-1/3 border-r-2">
          {product
            .filter((data) => data.id !== user.id)
            .map((data) => (
              <div key={data.id} className="pt-5 cursor-pointer" onClick={() => handleChatOpen(data)}>
                <div className={`border-2 border-black-500 p-3 flex justify-between items-center transition duration-300 ${selectedUser?.id === data.id ? 'bg-gray-200' : ''}`}>
                  <h2 className="text-lg font-bold">
                    {data.name} ({data.role})
                  </h2>
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${data.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                    <h4 className={`text-sm font-medium ${data.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                      {data.isOnline ? 'Online' : 'Offline'}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {selectedUser && (
          <div className="w-2/3 p-5">
            <Chat selectedUser={selectedUser} currentUser={user} />
          </div>
        )}
      </div>

     
      {isEditFormVisible && (
        <EditUserForm
        userId={user.id} 
        onClose={() => setIsEditFormVisible(false)}
        onSave={handleSaveUser}
        />
      )}
    </div>
  );
}
