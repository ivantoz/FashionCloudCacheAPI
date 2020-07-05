const router = require('express').Router();

const cacheController = require('./cache.controller');

router.get('/cache', cacheController.getAll);
router.get('/cache/:key', cacheController.get);
router.post('/cache/:key', cacheController.createOrUpdate);
router.delete('/cache/:key', cacheController.remove);
router.delete('/cache', cacheController.flushAll);




module.exports = router;