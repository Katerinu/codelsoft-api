const { Router } = require('express');
const { videoCheck } = require('../controllers/videoController');

const videoRouter = Router();

videoRouter.get("/", videoCheck);

module.exports = videoRouter;
