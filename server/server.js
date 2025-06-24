const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'dist', 'home.html')));
app.get('/about', (_, res) => res.sendFile(path.join(__dirname, 'dist', 'about.html')));
app.get('/contact', (_, res) => res.sendFile(path.join(__dirname, 'dist', 'contact.html')));

app.post('/submit-home', (req, res) => {
  console.log('Home Data:', req.body);
  res.send('Home form submitted successfully!');
});

app.post('/submit-about', (req, res) => {
  console.log('About Data:', req.body);
  res.send('About form submitted successfully!');
});

app.post('/submit-contact', (req, res) => {
  console.log('Contact Data:', req.body);
  res.send('Contact form submitted successfully!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
