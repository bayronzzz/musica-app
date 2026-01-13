const { query } = require('../config/database');

exports.getActiveSession = async (req, res) => {
  try {
    const result = await query(
      `SELECT ls.*, s.title as song_title, s.file_path, s.file_type
       FROM live_sessions ls
       LEFT JOIN songs s ON ls.current_song_id = s.id
       WHERE ls.is_active = true AND ls.admin_id = $1
       ORDER BY ls.started_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.json({ session: null });
    }

    res.json({ session: result.rows[0] });
  } catch (error) {
    console.error('Error al obtener sesion:', error);
    res.status(500).json({ error: 'Error al obtener sesion' });
  }
};

exports.getCurrentLiveSession = async (req, res) => {
  try {
    const result = await query(
      `SELECT ls.*, s.title as song_title, s.file_path, s.file_type,
       sp.page_name
       FROM live_sessions ls
       LEFT JOIN songs s ON ls.current_song_id = s.id
       LEFT JOIN song_pages sp ON sp.song_id = ls.current_song_id 
         AND sp.page_number = ls.current_page_number
       WHERE ls.is_active = true
       ORDER BY ls.updated_at DESC
       LIMIT 1`
    );

    if (result.rows.length === 0) {
      return res.json({ 
        session: null,
        message: 'No hay sesion en vivo activa' 
      });
    }

    res.json({ session: result.rows[0] });
  } catch (error) {
    console.error('Error al obtener sesion actual:', error);
    res.status(500).json({ error: 'Error al obtener sesion' });
  }
};

exports.startLiveMode = async (req, res) => {
  try {
    await query(
      'UPDATE live_sessions SET is_active = false WHERE admin_id = $1',
      [req.user.id]
    );

    const result = await query(
      'INSERT INTO live_sessions (admin_id, is_active) VALUES ($1, true) RETURNING *',
      [req.user.id]
    );

    res.json({
      message: 'Modo en vivo iniciado',
      session: result.rows[0]
    });
  } catch (error) {
    console.error('Error al iniciar modo en vivo:', error);
    res.status(500).json({ error: 'Error al iniciar modo en vivo' });
  }
};

exports.stopLiveMode = async (req, res) => {
  try {
    await query(
      'UPDATE live_sessions SET is_active = false WHERE admin_id = $1 AND is_active = true',
      [req.user.id]
    );

    res.json({ message: 'Modo en vivo detenido' });
  } catch (error) {
    console.error('Error al detener modo en vivo:', error);
    res.status(500).json({ error: 'Error al detener modo en vivo' });
  }
};

exports.changeLiveSong = async (req, res) => {
  try {
    const { songId, pageNumber } = req.body;

    if (!songId) {
      return res.status(400).json({ error: 'ID de cancion es obligatorio' });
    }

    const songResult = await query('SELECT id FROM songs WHERE id = $1', [songId]);

    if (songResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cancion no encontrada' });
    }

    const result = await query(
      `UPDATE live_sessions 
       SET current_song_id = $1, 
           current_page_number = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE admin_id = $3 AND is_active = true
       RETURNING *`,
      [songId, pageNumber || 1, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No hay sesion activa' });
    }

    res.json({
      message: 'Cancion actualizada',
      session: result.rows[0]
    });
  } catch (error) {
    console.error('Error al cambiar cancion:', error);
    res.status(500).json({ error: 'Error al cambiar cancion' });
  }
};