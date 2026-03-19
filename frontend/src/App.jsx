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
          <div className="build-badge">
            <span className="build-label">Build</span>
            <span className="build-status">Passing</span>
          </div>
        </div>
        <p className="subtitle">Full-Stack Automated Messaging</p>
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

      <div className="system-info-section">
        <div className="info-header">
          <h2>Project Overview</h2>
          <p>Full-Stack CI/CD Deployment</p>
        </div>

        <div className="tech-stack-grid">
          <div className="tech-card">
            <div className="tech-icon">🚀</div>
            <h3>Frontend</h3>
            <p>React + Vite</p>
          </div>
          <div className="tech-card">
            <div className="tech-icon">⚙️</div>
            <h3>Backend</h3>
            <p>Go (Golang)</p>
          </div>
          <div className="tech-card">
            <div className="tech-icon">💾</div>
            <h3>Database</h3>
            <p>PostgreSQL</p>
          </div>
          <div className="tech-card">
            <div className="tech-icon">☁️</div>
            <h3>Cloud</h3>
            <p>AWS EC2</p>
          </div>
        </div>

        <div className="infrastructure-details">
          <div className="infra-card">
            <h3>CI/CD Pipeline</h3>
            <ul>
              <li>Jenkins Automated Builds</li>
              <li>Docker Containerization</li>
              <li>EBS Volume Optimization (30GB)</li>
              <li>Zero-Downtime Deployment</li>
            </ul>
          </div>
          <div className="infra-illustration">
            <img src="/tech-stack.png" alt="Architecture Illustration" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
