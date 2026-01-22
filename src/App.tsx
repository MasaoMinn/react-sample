import { VSCodeButton, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { useState, useEffect } from 'react';
import { vscode } from './utils/vscode';

import './App.css';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle incoming messages from VS Code extension
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === 'ai-response') {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: message.data,
          isUser: false,
          timestamp: new Date(),
        }]);
        setIsLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message to the list
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Send message to VS Code extension
    vscode.postMessage({
      type: 'ai-query',
      data: inputValue.trim(),
    });

    // Simulate AI response if extension doesn't respond
    setTimeout(() => {
      if (isLoading) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `This is a simulated response to: "${inputValue.trim()}"`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="chat-container">
      <h1 className="chat-title">AI Assistant</h1>

      <div className="message-container">
        {messages.map(message => (
          <div
            key={message.id}
            className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">{message.content}</div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message ai-message">
            <div className="message-content">Typing...</div>
          </div>
        )}
      </div>

      <div className="input-container">
        <VSCodeTextField
          value={inputValue}
          onInput={e => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          className="message-input"
        />
        <VSCodeButton onClick={sendMessage} className="send-button">
          Send
        </VSCodeButton>
      </div>
    </main>
  );
}

export default App;