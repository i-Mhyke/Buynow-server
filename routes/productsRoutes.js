const express = require('express');
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/category', authController.protectRoutes, categoryController.createCategory);
router.get('/category', authController.protectRoutes, categoryController.getCategories);
router.get('/category/:category_id', authController.protectRoutes, categoryController.getCategory);

module.exports = router;
