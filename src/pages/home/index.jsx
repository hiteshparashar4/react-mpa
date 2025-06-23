import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const Home = () => {
  const [name, setName] = useState('');
  
  return (
    <form action='/submit-home' method='POST'>
      <h2>Home Page</h2>
      <label>
        Name:
        <input name='name' value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <button type='submit'>Submit</button>
    </form>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Home />);
