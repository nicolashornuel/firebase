const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller.realtime');

router.get('/', controller.getAll);
router.get('/:categorie', controller.getByCategorie);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;