import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const Contact = () => {
  const [message, setMessage] = useState('');

  return (
    <form action='/submit-contact' method='POST'>
      <h2>Contact Page</h2>
      <label>
        Message:
        <textarea name='message' value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
      </label>
      <button type='submit'>Send</button>
    </form>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Contact />);
