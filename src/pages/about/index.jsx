import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const About = () => {
  const [email, setEmail] = useState('');

  return (
    <form action='/submit-about' method='POST'>
      <h2>About Page</h2>
      <label>
        Email:
        <input name='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <button type='submit'>Submit</button>
    </form>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<About />);
