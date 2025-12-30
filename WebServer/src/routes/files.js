const express = require('express');
const fileController = require('../controllers/files');
const permissionsRouter = require('./permissions');
const router = express.Router();

router.get('/', listFiles);
router.post('/', createFile);

router.get('/:id', fileController.getFileById);
router.patch('/:id', fileController.updateFile);
router.delete('/:id', fileController.deleteFile);

router.use('/:id/permissions', permissionsRouter);

module.exports = router;

