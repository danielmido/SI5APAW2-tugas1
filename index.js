const express = require('express');
const app = express();

// ==== Data ====
const latestBooks = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin' },
  { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt' },
  { id: 3, title: 'Refactoring', author: 'Martin Fowler' },
  { id: 4, title: 'You Don’t Know JS Yet', author: 'Kyle Simpson' },
  { id: 5, title: 'Designing Data-Intensive Apps', author: 'Martin Kleppmann' },
];

const favoriteBooks = [
  { id: 101, title: 'Atomic Habits', author: 'James Clear' },
  { id: 102, title: 'Deep Work', author: 'Cal Newport' },
  { id: 103, title: 'Hooked', author: 'Nir Eyal' },
  { id: 104, title: 'Sprint', author: 'Jake Knapp' },
  { id: 105, title: 'Inspired', author: 'Marty Cagan' },
];

// ==== Route 'home' ====
app.get('/', (req, res) => {
  res.send('Selamat datang di ExpressJS');
});

// ==== Route 'about' ====
app.get('/about', (req, res) => {
  res.send('Ini halaman tentang saya');
});

// ==== JSON Route ====

// ==== Port Settings ====
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});