const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller.firestore');

router.get('/', controller.getAll);
router.get('/:videoId', controller.getByVideoId);
router.get('/filtre/:categorie', controller.getByCategorie);
router.post('/', controller.create);
router.put('/:videoId', controller.update);
router.delete('/:videoId', controller.remove);

module.exports = router;