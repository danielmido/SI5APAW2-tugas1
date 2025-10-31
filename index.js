const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

// ==== App ====
const app = express();

// ==== DB connect ====
const connectDB = require('./src/db');
connectDB();

// ==== Path ====
const VIEWS_DIR = path.join(__dirname, 'views');

// ==== Core middleware ====
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// ==== Health Check API ====
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});


// ==== API Routes ====
const authorsRouter = require('./src/routes/authors.routes');
const booksRouter = require('./src/routes/books.routes');
app.use('/api/authors', authorsRouter);
app.use('/api/books', booksRouter);

// ==== 404 Fallback ====
app.use((req, res) => {
  res.status(404).send('Error 404: Halaman tidak ditemukan');
});

// ==== Port Settings ====
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});