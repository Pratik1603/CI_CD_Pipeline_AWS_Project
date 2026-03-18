import { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/messages`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const addMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      });
      setNewMessage('');
      await fetchMessages();
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await fetch(`${API_URL}/messages/${id}`, { method: 'DELETE' });
      fetchMessages();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-top">
          <h1>Nexus Messages</h1>
          <div className="status-badge">
            <span className="status-dot"></span>
            Online
          </div>
        </div>
        <p className="subtitle">Secure Two-Tier Synchronization</p>
      </header>
      
      <form className="message-form" onSubmit={addMessage}>
        <input
          className="message-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write something..."
          disabled={isLoading}
        />
        <button className="add-btn" type="submit" disabled={isLoading}>
          {isLoading ? <div className="loading-spinner"></div> : 'Add'}
        </button>
      </form>

      <div className="message-list">
        {messages.length === 0 ? (
          <div className="empty-state">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => (
            <div className="message-item" key={msg.id}>
              <span className="message-content">{msg.content}</span>
              <button className="delete-btn" onClick={() => deleteMessage(msg.id)}>✕</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
