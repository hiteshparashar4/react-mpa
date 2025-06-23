import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import _ from 'lodash';

const About = () => {
  const [email, setEmail] = useState('');
  const array = [1];
  const other = _.concat(array, 2, [3]);

  return (
    <form action="/submit-about" method="POST">
      <h2>About Page</h2>
      <label>
        Email:
        <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<About />);
