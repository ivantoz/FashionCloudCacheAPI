const router = require('express').Router();

const healthcheckRoutes = require('./healthcheck');
const cacheRoutes = require('./cache');


router.use('/healthcheck', healthcheckRoutes);
router.use('/', cacheRoutes);


module.exports = router;
