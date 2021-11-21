const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller.preference');

router.get('/', controller.get);
router.post('/', controller.create);
router.put('/', controller.update);

module.exports = router;