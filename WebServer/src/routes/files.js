const express = require('express');
const fileController = require('../controllers/files');
const permissionsRouter = require('./permissions');
const router = express.Router();
router.use('/:id/permissions', permissionsRouter);

router.get('/', fileController.listFiles);
router.post('/', fileController.createFile);

router.get('/:id', fileController.getFile);
router.patch('/:id', fileController.updateFile);
router.delete('/:id', fileController.deleteFile);

router.post('/:id/star', fileController.starFile);
router.delete('/:id/star', fileController.unstarFile);


module.exports = router;

