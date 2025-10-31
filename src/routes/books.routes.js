const router = require('express').Router();
const ctrl = require('../controllers/books.controller');

router.post('/', ctrl.createBook);
router.get('/', ctrl.getBooks);
router.get('/:id', ctrl.getBookById);
router.patch('/:id', ctrl.updateBook);
router.delete('/:id', ctrl.deleteBook);

module.exports = router;