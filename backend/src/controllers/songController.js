const { query } = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

/* ======================
   SUBIR CANCIÓN
====================== */
exports.uploadSong = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!title || !file) {
      return res.status(400).json({
        error: 'Título y archivo son obligatorios'
      });
    }

    const fileType = file.mimetype.includes('pdf') ? 'pdf' : 'image';

    // ✅ RUTA WEB PÚBLICA (CLAVE)
    const filePath = `uploads/songs/${file.filename}`;
    
    const result = await query(
      `INSERT INTO songs (title, file_path, file_type, uploaded_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, filePath, fileType, req.user.id]
    );

    res.status(201).json({
      message: 'Canción subida exitosamente',
      song: result.rows[0]
    });
  } catch (error) {
    console.error('Error al subir canción:', error);
    res.status(500).json({
      error: 'Error al subir canción'
    });
  }
};

/* ======================
   OBTENER TODAS
====================== */
exports.getAllSongs = async (req, res) => {
  try {
    const result = await query(
      `SELECT s.*,
              u.name AS uploaded_by_name,
              (SELECT COUNT(*) FROM song_pages WHERE song_id = s.id) AS page_count
       FROM songs s
       LEFT JOIN users u ON s.uploaded_by = u.id
       ORDER BY s.created_at DESC`
    );

    res.json({ songs: result.rows });
  } catch (error) {
    console.error('Error al obtener canciones:', error);
    res.status(500).json({
      error: 'Error al obtener canciones'
    });
  }
};

/* ======================
   OBTENER POR ID
====================== */
exports.getSongById = async (req, res) => {
  try {
    const { id } = req.params;

    const songResult = await query(
      'SELECT * FROM songs WHERE id = $1',
      [id]
    );

    if (songResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Canción no encontrada'
      });
    }

    const pagesResult = await query(
      `SELECT * FROM song_pages
       WHERE song_id = $1
       ORDER BY page_number`,
      [id]
    );

    res.json({
      song: songResult.rows[0],
      pages: pagesResult.rows
    });
  } catch (error) {
    console.error('Error al obtener canción:', error);
    res.status(500).json({
      error: 'Error al obtener canción'
    });
  }
};

/* ======================
   ACTUALIZAR NOMBRE PÁGINA
====================== */
exports.updatePageName = async (req, res) => {
  try {
    const { songId, pageNumber } = req.params;
    const { pageName } = req.body;

    const pageExists = await query(
      `SELECT id FROM song_pages
       WHERE song_id = $1 AND page_number = $2`,
      [songId, pageNumber]
    );

    if (pageExists.rows.length > 0) {
      await query(
        `UPDATE song_pages
         SET page_name = $1
         WHERE song_id = $2 AND page_number = $3`,
        [pageName, songId, pageNumber]
      );
    } else {
      await query(
        `INSERT INTO song_pages (song_id, page_number, page_name)
         VALUES ($1, $2, $3)`,
        [songId, pageNumber, pageName]
      );
    }

    res.json({
      message: 'Nombre de página actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar página:', error);
    res.status(500).json({
      error: 'Error al actualizar página'
    });
  }
};

/* ======================
   ELIMINAR CANCIÓN
====================== */
exports.deleteSong = async (req, res) => {
  try {
    const { id } = req.params;

    const songResult = await query(
      'SELECT file_path FROM songs WHERE id = $1',
      [id]
    );

    if (songResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Canción no encontrada'
      });
    }

    const filePath = songResult.rows[0].file_path;

    await query('DELETE FROM songs WHERE id = $1', [id]);

    // 🔥 Convertir ruta web a ruta física
    const fullPath = path.join(
      __dirname,
      '../../',
      filePath.replace('/uploads/', 'uploads/')
    );

    try {
      await fs.unlink(fullPath);
    } catch (fileError) {
      console.error('Error al eliminar archivo:', fileError);
    }

    res.json({
      message: 'Canción eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar canción:', error);
    res.status(500).json({
      error: 'Error al eliminar canción'
    });
  }
};

/* ======================
   ACTUALIZAR TÍTULO
====================== */
exports.updateSongTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        error: 'El título es obligatorio'
      });
    }

    await query(
      'UPDATE songs SET title = $1 WHERE id = $2',
      [title, id]
    );

    res.json({
      message: 'Título actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar título:', error);
    res.status(500).json({
      error: 'Error al actualizar título'
    });
  }
};
