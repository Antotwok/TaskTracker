const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

const taskRoutes = require('./routes/taskRoutes');

app.use('/api/tasks', taskRoutes);

pool.query('SELECT NOW()')
  .then(() => {
    console.log('Database Connected');
  })
  .catch(err => {
    console.error(err);
  });

app.listen(3000, () => {
  console.log('Server running on port 3000');
});