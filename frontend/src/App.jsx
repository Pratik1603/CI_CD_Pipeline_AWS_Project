import { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = async () => {
    const res = await fetch(`${API_URL}/messages`);
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => { fetchMessages(); }, []);

  const addMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newMessage }),
    });
    setNewMessage('');
    fetchMessages();
  };

  const deleteMessage = async (id) => {
    await fetch(`${API_URL}/messages/${id}`, { method: 'DELETE' });
    fetchMessages();
  };

  return (
    <div className="app">
      <h1>Two-Tier Web App</h1>
      <form onSubmit={addMessage}>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter a message..."
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            {msg.content}
            <button onClick={() => deleteMessage(msg.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
