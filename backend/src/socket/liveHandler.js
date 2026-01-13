const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const setupLiveHandlers = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('No se proporcionó token'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ Usuario conectado: ${socket.user.email} (${socket.user.role})`);

    socket.join('live-session');

    socket.emit('user-connected', {
      userId: socket.user.id,
      role: socket.user.role
    });

    socket.on('admin:start-live', async () => {
      if (socket.user.role !== 'admin') {
        return socket.emit('error', { message: 'No tienes permisos' });
      }

      try {
        await query(
          'UPDATE live_sessions SET is_active = false WHERE admin_id = $1',
          [socket.user.id]
        );

        const result = await query(
          'INSERT INTO live_sessions (admin_id, is_active) VALUES ($1, true) RETURNING *',
          [socket.user.id]
        );

        io.to('live-session').emit('live:started', {
          session: result.rows[0]
        });

        console.log('🎵 Modo en vivo iniciado');
      } catch (error) {
        console.error('Error al iniciar modo en vivo:', error);
        socket.emit('error', { message: 'Error al iniciar modo en vivo' });
      }
    });

    socket.on('admin:change-song', async (data) => {
      if (socket.user.role !== 'admin') {
        return socket.emit('error', { message: 'No tienes permisos' });
      }

      try {
        const { songId, pageNumber = 1 } = data;

        const songResult = await query(
          `SELECT s.*, sp.page_name 
           FROM songs s
           LEFT JOIN song_pages sp ON sp.song_id = s.id AND sp.page_number = $2
           WHERE s.id = $1`,
          [songId, pageNumber]
        );

        if (songResult.rows.length === 0) {
          return socket.emit('error', { message: 'Canción no encontrada' });
        }

        await query(
          `UPDATE live_sessions 
           SET current_song_id = $1, 
               current_page_number = $2,
               updated_at = CURRENT_TIMESTAMP
           WHERE admin_id = $3 AND is_active = true`,
          [songId, pageNumber, socket.user.id]
        );

        const song = songResult.rows[0];

        io.to('live-session').emit('live:song-changed', {
          songId: song.id,
          title: song.title,
          filePath: song.file_path,
          fileType: song.file_type,
          pageNumber,
          pageName: song.page_name,
          changedBy: socket.user.email
        });

        console.log(`🎵 Canción cambiada: ${song.title} - Página ${pageNumber}`);
      } catch (error) {
        console.error('Error al cambiar canción:', error);
        socket.emit('error', { message: 'Error al cambiar canción' });
      }
    });

    socket.on('admin:change-page', async (data) => {
      if (socket.user.role !== 'admin') {
        return socket.emit('error', { message: 'No tienes permisos' });
      }

      try {
        const { songId, pageNumber } = data;

        await query(
          `UPDATE live_sessions 
           SET current_page_number = $1,
               updated_at = CURRENT_TIMESTAMP
           WHERE admin_id = $2 AND is_active = true AND current_song_id = $3`,
          [pageNumber, socket.user.id, songId]
        );

        const pageResult = await query(
          'SELECT page_name FROM song_pages WHERE song_id = $1 AND page_number = $2',
          [songId, pageNumber]
        );

        io.to('live-session').emit('live:page-changed', {
          songId,
          pageNumber,
          pageName: pageResult.rows[0]?.page_name || null
        });

        console.log(`📄 Página cambiada: ${pageNumber}`);
      } catch (error) {
        console.error('Error al cambiar página:', error);
        socket.emit('error', { message: 'Error al cambiar página' });
      }
    });

    socket.on('admin:stop-live', async () => {
      if (socket.user.role !== 'admin') {
        return socket.emit('error', { message: 'No tienes permisos' });
      }

      try {
        await query(
          'UPDATE live_sessions SET is_active = false WHERE admin_id = $1 AND is_active = true',
          [socket.user.id]
        );

        io.to('live-session').emit('live:stopped');

        console.log('🛑 Modo en vivo detenido');
      } catch (error) {
        console.error('Error al detener modo en vivo:', error);
        socket.emit('error', { message: 'Error al detener modo en vivo' });
      }
    });

    socket.on('musician:request-current', async () => {
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

        if (result.rows.length > 0) {
          socket.emit('live:current-song', result.rows[0]);
        } else {
          socket.emit('live:no-session');
        }
      } catch (error) {
        console.error('Error al obtener canción actual:', error);
        socket.emit('error', { message: 'Error al obtener canción actual' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ Usuario desconectado: ${socket.user.email}`);
    });
  });

  console.log('📡 Handlers de Socket.IO configurados');
};

module.exports = setupLiveHandlers;