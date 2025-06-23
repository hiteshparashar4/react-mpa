import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import _ from 'lodash'

const Home = () => {
  const [name, setName] = useState('');

  const array = [1];
  const other = _.concat(array, 2, [3]);

  return (
    <form action="/submit-home" method="POST">
      <h2>Home Page</h2>
      <label>
        Name:
        <input name="name" value={name} onChange={(e) => setName(`${e.target.value} ${other}`)} required />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Home />);
