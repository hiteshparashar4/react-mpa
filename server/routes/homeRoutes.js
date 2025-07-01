const express = require('express');
const router = express.Router();
const HomeForm = require('../models/HomeForm');

router.post('/submit-home', async (req, res) => {
  try {
    const entry = new HomeForm(req.body);
    await entry.save();
    res.send('Home form submitted and saved to MongoDB!');
  } catch (err) {
    console.error('DB Save Error:', err);
    res.status(500).send('Failed to save form data.');
  }
});

module.exports = router;
