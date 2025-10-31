const router = require('express').Router();
const ctrl = require('../controllers/authors.controller');

router.post('/', ctrl.createAuthor);
router.get('/', ctrl.getAuthors);
router.get('/:id', ctrl.getAuthorById);
router.patch('/:id', ctrl.updateAuthor);
router.delete('/:id', ctrl.deleteAuthor);

module.exports = router;