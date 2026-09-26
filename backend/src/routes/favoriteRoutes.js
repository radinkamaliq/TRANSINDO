// backend/src/routes/favoriteRoutes.js
const express = require('express');
const auth = require('../middleware/auth');
const {
  listFavorites, createFavorite, updateFavorite, deleteFavorite, planFromFavorite,
} = require('../controllers/favoriteController');

const router = express.Router();
router.use(auth);

router.get('/',    listFavorites);
router.post('/',   createFavorite);
router.patch('/:id',  updateFavorite);
router.delete('/:id', deleteFavorite);
router.post('/:id/plan', planFromFavorite);

module.exports = router;
