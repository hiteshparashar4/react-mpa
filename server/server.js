const express = require('express');
const path = require('path');
require('./db');

const app = express();
const PORT = 3000;

const DIST_DIR = path.resolve(__dirname, '..', 'dist');

app.use(express.static(DIST_DIR));
app.use(express.urlencoded({ extended: true }));

// Page routes
app.get('/', (_, res) => res.sendFile(path.join(DIST_DIR, 'home.html')));
app.get('/about', (_, res) => res.sendFile(path.join(DIST_DIR, 'about.html')));
app.get('/contact', (_, res) => res.sendFile(path.join(DIST_DIR, 'contact.html')));

// API routes
const homeRoutes = require('./routes/homeRoutes');
app.use('/', homeRoutes);

app.post('/submit-about', (req, res) => {
  console.log('About Data:', req.body);
  res.send('About form submitted successfully!');
});

app.post('/submit-contact', (req, res) => {
  console.log('Contact Data:', req.body);
  res.send('Contact form submitted successfully!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
