const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./db');
const errorHandler = require('./middleware/errorHandler');

const authorsRouter = require('./routes/authors.routes');
const booksRouter = require('./routes/books.routes');

const app = express();

// DB connect
connectDB();

// Core middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View (biarkan route HTML lama tetap hidup)
app.use('/static', express.static(path.join(__dirname, '..', 'views')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'about.html'));
});

// API routes (Tugas 2)
app.use('/api/authors', authorsRouter);
app.use('/api/books', booksRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Error handler (terakhir)
app.use(errorHandler);

module.exports = app;