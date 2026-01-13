const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

// =======================
// 🔒 RUTAS PROTEGIDAS (ADMIN)
// =======================

// SUBIR CANCIÓN
router.post(
  '/',
  auth,
  roleCheck('admin'),
  upload.single('file'), // el campo debe llamarse "file"
  songController.uploadSong
);

// ACTUALIZAR TÍTULO
router.put(
  '/:id',
  auth,
  roleCheck('admin'),
  songController.updateSongTitle
);

// ELIMINAR CANCIÓN
router.delete(
  '/:id',
  auth,
  roleCheck('admin'),
  songController.deleteSong
);

// ACTUALIZAR NOMBRE DE PÁGINA
router.put(
  '/:songId/pages/:pageNumber',
  auth,
  roleCheck('admin'),
  songController.updatePageName
);

// =======================
// 🌍 RUTAS PÚBLICAS (LECTURA)
// =======================

// OBTENER TODAS LAS CANCIONES
router.get(
  '/',
  songController.getAllSongs
);

// OBTENER CANCIÓN POR ID
router.get(
  '/:id',
  songController.getSongById
);

module.exports = router;
