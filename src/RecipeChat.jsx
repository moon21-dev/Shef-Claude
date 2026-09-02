import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function RecipeChat({ recipe }) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function askQuestion(event) {
    event.preventDefault();

    if (!question.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: question,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setQuestion('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipe: recipe,
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer');
      }

      const assistantMessage = {
        role: 'assistant',
        content: data.answer,
      };

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error(error);

      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I could not answer that question.',
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="recipe-chat">
      <h2>Ask about this recipe</h2>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.role}`}>
            {/* <strong>{message.role === 'user' ? 'You' : 'AI'}</strong> */}
            <strong>{message.role === 'user' ? 'You' : 'Shef-Claude'}</strong>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}

        {loading && (
          <div className="chat-message assistant">
            <strong>AI</strong>
            <p>Thinking...</p>
          </div>
        )}
      </div>

      <form onSubmit={askQuestion}>
        <input
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask about this recipe..."
          aria-label="Ask a question about the recipe"
        />

        <button type="submit" disabled={loading || !question.trim()}>
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </form>
    </section>
  );
}
