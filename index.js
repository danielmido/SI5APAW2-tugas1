const express = require('express');
const path = require('path');

const app = express();

// Path
const VIEWS_DIR = path.join(__dirname, 'views');

// ==== Data ====
const cars = [
  { id: 1, title: 'Honda BR-V', year: '2017' },
  { id: 2, title: 'Toyota Veloz', year: '2024' },
  { id: 3, title: 'Chevrolet Corvette C8 ZR1', year: '2025' },
  { id: 4, title: 'Toyota GR Yaris', year: '2025' },
  { id: 5, title: 'BYD Sealion 7', year: '2025' },
];

// ==== Route Index ====
app.get('/', (req, res) => {
  res.sendFile(path.join(VIEWS_DIR, 'index.html'));
});

// ==== Route 'about' ====
app.get('/about', (req, res) => {
  res.sendFile(path.join(VIEWS_DIR, 'about.html'));
});

// ==== JSON Route ====
app.get('/cars', (req, res) => {
  res.json({
    // == Isi JSON disini ==
    carsList: cars
  });
});

// ==== 404 Fallback ====
app.use((req, res) => {
  res.status(404).send('Error 404: Halaman tidak ditemukan');
});

// ==== Port Settings ====
const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});