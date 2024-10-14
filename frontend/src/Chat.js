import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Chat({ selectedUser, currentUser }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, [selectedUser]);

  const fetchMessages = () => {
    axios.get(`http://localhost:1234/fetchMessages?sender_id=${currentUser.id}&receiver_id=${selectedUser.id}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.log(err));
  };

  const sendMessage = () => {
    axios.post('http://localhost:1234/sendMessage', {
      sender_id: currentUser.id,
      receiver_id: selectedUser.id,
      message: message
    })
    .then(() => {
      fetchMessages(); 
      setMessage(''); 
    })
    .catch((err) => console.log(err));
  };

  return (
    <div className="flex flex-col h-full border rounded-lg shadow-lg">
      <div className="flex-grow p-4 overflow-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-2 ${msg.sender_id === currentUser.id ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block px-4 py-2 rounded-lg ${msg.sender_id === currentUser.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <p>{msg.message}</p>
              <span className="block text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
