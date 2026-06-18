const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

pool.query('SELECT NOW()')
  .then(() => {
    console.log('Database Connected');
  })
  .catch(err => {
    console.error(err);
  });

app.get('/', (req, res) => {
  res.send('Task Tracker API Running');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});