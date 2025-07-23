import { useState } from 'react'
import './App.css'
import Axios from 'axios'

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('professional');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const toneOptions = [
    { value: 'professional', label: 'Professional', icon: '💼' },
    { value: 'friendly', label: 'Friendly', icon: '😊' },
    { value: 'casual', label: 'Casual', icon: '😎' },
    { value: 'formal', label: 'Formal', icon: '🎩' },
    { value: 'apologetic', label: 'Apologetic', icon: '🙏' },
    { value: 'enthusiastic', label: 'Enthusiastic', icon: '🎉' },
    { value: 'concise', label: 'Concise', icon: '⚡' },
    { value: 'polite', label: 'Polite', icon: '🤝' }
  ];

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    showToast(`Switched to ${!darkMode ? 'dark' : 'light'} mode`, 'info');
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await Axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone 
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
      showToast('Email generated successfully!', 'success');
    } catch (error) {
      setError('Failed to generate email reply. Please try again');
      showToast('Failed to generate email reply', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setEmailContent('');
    setGeneratedReply('');
    setError('');
    setTone('professional');
    showToast('All fields cleared', 'info');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedReply);
      showToast('Email copied to clipboard!', 'success');
    } catch (err) {
      showToast('Failed to copy to clipboard', 'error');
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode 
      ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
      : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'}`}>
      <div className="container">
        {/* Header */}
        <header className="text-center mb-12 relative">
          {/* Theme Toggle Switch */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            <span className="theme-label">
              {darkMode ? 'Dark' : 'Light'}
            </span>
            <div className={`switch ${darkMode ? 'active' : ''}`}>
              <div className="switch-handle">
                {darkMode ? '🌙' : '☀️'}
              </div>
            </div>
          </button>
          
          <div className="header-icon">📧</div>
          <h1 className="header-title">
            AI Email Generator
          </h1>
          <p className="header-subtitle">
            Transform your thoughts into professional emails with the perfect tone
          </p>
        </header>

        <div className="main-grid">
          {/* Input Section */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <span className="card-icon">✍️</span>
                Email Content
              </h2>
            </div>
            <div className="card-content">
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Enter the email content you'd like to respond to, or describe what you want to communicate..."
                className={`textarea ${darkMode ? 'textarea-dark' : 'textarea-light'}`}
                rows={8}
              />
              <div className="character-count">
                {emailContent.length} characters
              </div>
            </div>
          </div>

          {/* Tone Selection */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <span className="card-icon">🎯</span>
                Select Tone
              </h2>
            </div>
            <div className="card-content">
              <div className="tone-grid">
                {toneOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTone(option.value)}
                    className={`tone-button ${tone === option.value ? 'tone-button-active' : ''} ${
                      darkMode ? 'tone-button-dark' : 'tone-button-light'
                    }`}
                  >
                    <span className="tone-icon">{option.icon}</span>
                    <span className="tone-label">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button Section - Centered */}
          <div className="generate-button-section" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <button
              onClick={handleGenerate}
              disabled={loading || !emailContent.trim()}
              className="btn btn-primary"
              style={{ minWidth: '200px' }}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Generating...
                </>
              ) : (
                <>
                  ✨ Generate Email
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="card output-card">
            <div className="card-header">
              <h2 className="card-title">
                <span className="card-icon">✨</span>
                Generated Email
              </h2>
              {generatedReply && (
                <button
                  onClick={handleCopy}
                  className="copy-button"
                  title="Copy to clipboard"
                >
                  📋 Copy
                </button>
              )}
            </div>
            <div className="card-content">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Generating your perfect email...</p>
                </div>
              ) : generatedReply ? (
                <div className="output-content">
                  <pre className="output-text">{generatedReply}</pre>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">💭</div>
                  <p>Your generated email will appear here</p>
                  <span>Enter content and select a tone to get started</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <div className={`toast toast-${toast.type}`} style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: 1000,
            animation: 'slideIn 0.3s ease-out',
            backgroundColor: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#3b82f6'
          }}>
            <span style={{ marginRight: '8px' }}>
              {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            {toast.message}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Action Buttons - Centered */}
        <div className="button-group" style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handleClear}
            className="btn btn-secondary"
            disabled={loading}
          >
            🗑️ Clear All
          </button>
        </div>
      </div>
    </div>
  )
}

export default App