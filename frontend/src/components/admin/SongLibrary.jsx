import { useState, useEffect } from 'react';
import { songService } from '../../services/songService';
import Loader from '../common/Loader';

const SongLibrary = ({ onSelectSong }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  const loadSongs = async () => {
    try {
      setLoading(true);
      const data = await songService.getAllSongs();
      setSongs(data.songs);
      setError('');
    } catch (err) {
      setError('Error al cargar las canciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const handleDelete = async (songId) => {
    if (window.confirm('¿Estás seguro de eliminar esta canción?')) {
      try {
        await songService.deleteSong(songId);
        setSongs(songs.filter(song => song.id !== songId));
      } catch (err) {
        alert('Error al eliminar la canción');
      }
    }
  };

  const startEdit = (song) => {
    setEditingId(song.id);
    setEditTitle(song.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const saveEdit = async (songId) => {
    try {
      await songService.updateSongTitle(songId, editTitle);
      setSongs(songs.map(song => 
        song.id === songId ? { ...song, title: editTitle } : song
      ));
      setEditingId(null);
    } catch (err) {
      alert('Error al actualizar el título');
    }
  };

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader message="Cargando biblioteca..." />;

  if (error) {
    return (
      <div className="error-container">
        <svg className="error-icon" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="error-text">{error}</p>
          <button onClick={loadSongs} className="error-retry">
            Intentar de nuevo
          </button>
        </div>
        <style>{`
          .error-container {
            padding: clamp(16px, 3vw, 20px);
            background: #fadbd8;
            border: 1px solid #e74c3c;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 20px;
          }
          .error-icon {
            width: clamp(20px, 4vw, 24px);
            height: clamp(20px, 4vw, 24px);
            fill: #c0392b;
            flex-shrink: 0;
          }
          .error-text {
            font-weight: bold;
            color: #c0392b;
            font-size: clamp(14px, 2.5vw, 16px);
            margin: 0;
          }
          .error-retry {
            color: #c0392b;
            text-decoration: underline;
            background: none;
            border: none;
            cursor: pointer;
            font-size: clamp(12px, 2vw, 14px);
            margin-top: 4px;
            padding: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="library-container">
      {/* HEADER */}
      <div className="library-header">
        <div className="header-title-row">
          <div className="icon-container">
            <svg className="music-icon" viewBox="0 0 24 24">
              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div>
            <h2 className="library-title">Biblioteca de Canciones</h2>
            <p className="library-subtitle">
              {songs.length} {songs.length === 1 ? 'canción' : 'canciones'} disponibles
            </p>
          </div>
        </div>

        <div className="search-row">
          <div className="search-container">
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar canciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <button onClick={loadSongs} className="refresh-button">
            <svg className="refresh-icon" viewBox="0 0 24 24">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="refresh-text">Actualizar</span>
          </button>
        </div>
      </div>

      {/* LISTA DE CANCIONES */}
      {filteredSongs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrapper">
            <svg className="empty-icon" viewBox="0 0 24 24">
              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <p className="empty-text">
            {searchTerm ? 'No se encontraron canciones' : 'No hay canciones aún'}
          </p>
        </div>
      ) : (
        <>
          {/* Vista de tabla para desktop */}
          <div className="table-view">
            <table className="songs-table">
              <thead>
                <tr className="table-header">
                  <th className="th-song">Canción</th>
                  <th className="th-type">Tipo</th>
                  <th className="th-uploader">Subido por</th>
                  <th className="th-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSongs.map((song, index) => (
                  <tr key={song.id} className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                    <td className="td-song">
                      {editingId === song.id ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          autoFocus
                          className="edit-input"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') saveEdit(song.id);
                            if (e.key === 'Escape') cancelEdit();
                          }}
                        />
                      ) : (
                        <div className="song-info">
                          <span className="song-emoji">🎵</span>
                          <span className="song-title">{song.title}</span>
                        </div>
                      )}
                    </td>
                    
                    <td className="td-type">
                      <span className={`type-badge ${song.file_type}`}>
                        {song.file_type === 'pdf' ? '📄 PDF' : '🖼️ IMG'}
                      </span>
                    </td>
                    
                    <td className="td-uploader">
                      {song.uploaded_by_name || 'Desconocido'}
                    </td>
                    
                    <td className="td-actions">
                      <div className="action-buttons">
                        {editingId === song.id ? (
                          <>
                            <button onClick={() => saveEdit(song.id)} className="btn btn-save">
                              ✓ <span className="btn-text">Guardar</span>
                            </button>
                            <button onClick={cancelEdit} className="btn btn-cancel">
                              ✕ <span className="btn-text">Cancelar</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => onSelectSong(song)} className="btn btn-live" title="Usar en modo en vivo">
                              ▶ <span className="btn-text">En Vivo</span>
                            </button>
                            <button onClick={() => startEdit(song)} className="btn btn-edit" title="Editar">
                              ✏️
                            </button>
                            <button onClick={() => handleDelete(song.id)} className="btn btn-delete" title="Eliminar">
                              🗑️
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista de cards para móvil */}
          <div className="cards-view">
            {filteredSongs.map((song) => (
              <div key={song.id} className="song-card">
                <div className="card-header">
                  {editingId === song.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      autoFocus
                      className="edit-input-mobile"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') saveEdit(song.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                  ) : (
                    <>
                      <div className="card-title-section">
                        <span className="card-emoji">🎵</span>
                        <span className="card-title">{song.title}</span>
                      </div>
                      <span className={`type-badge-mobile ${song.file_type}`}>
                        {song.file_type === 'pdf' ? '📄' : '🖼️'}
                      </span>
                    </>
                  )}
                </div>

                <div className="card-info">
                  <span className="card-uploader">
                    👤 {song.uploaded_by_name || 'Desconocido'}
                  </span>
                </div>

                <div className="card-actions">
                  {editingId === song.id ? (
                    <>
                      <button onClick={() => saveEdit(song.id)} className="btn-mobile btn-save">
                        ✓ Guardar
                      </button>
                      <button onClick={cancelEdit} className="btn-mobile btn-cancel">
                        ✕ Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => onSelectSong(song)} className="btn-mobile btn-live">
                        ▶ En Vivo
                      </button>
                      <button onClick={() => startEdit(song)} className="btn-mobile btn-edit">
                        ✏️ Editar
                      </button>
                      <button onClick={() => handleDelete(song.id)} className="btn-mobile btn-delete">
                        🗑️ Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        * {
          box-sizing: border-box;
        }

        .library-container {
          padding: clamp(12px, 3vw, 20px);
          background: #f5f7fa;
          min-height: 100vh;
        }

        /* HEADER */
        .library-header {
          background: #2c3e50;
          border-radius: clamp(12px, 2vw, 16px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          padding: clamp(16px, 3vw, 24px);
          margin-bottom: clamp(16px, 3vw, 24px);
        }

        .header-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .icon-container {
          background: linear-gradient(90deg, #3498db, #2980b9);
          padding: clamp(10px, 2vw, 12px);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .music-icon {
          width: clamp(20px, 4vw, 24px);
          height: clamp(20px, 4vw, 24px);
          fill: white;
        }

        .library-title {
          color: white;
          font-size: clamp(18px, 4vw, 24px);
          margin: 0;
          font-weight: bold;
        }

        .library-subtitle {
          color: #bdc3c7;
          font-size: clamp(12px, 2vw, 14px);
          margin: 0;
        }

        .search-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .search-container {
          flex: 1;
          position: relative;
          min-width: 200px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          fill: #bdc3c7;
        }

        .search-input {
          width: 100%;
          padding: clamp(10px, 2vw, 12px) clamp(36px, 8vw, 40px);
          border: 1px solid #34495e;
          border-radius: 8px;
          background: #34495e;
          color: white;
          font-size: clamp(14px, 2.5vw, 16px);
          outline: none;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          border-color: #3498db;
        }

        .refresh-button {
          padding: clamp(10px, 2vw, 12px) clamp(16px, 3vw, 20px);
          background: linear-gradient(90deg, #3498db, #2980b9);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          font-size: clamp(14px, 2.5vw, 16px);
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .refresh-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
        }

        .refresh-icon {
          width: 16px;
          height: 16px;
          fill: white;
        }

        .refresh-text {
          display: none;
        }

        /* EMPTY STATE */
        .empty-state {
          text-align: center;
          padding: clamp(32px, 6vw, 40px);
          background: #ecf0f1;
          border-radius: 16px;
          border: 2px dashed #bdc3c7;
        }

        .empty-icon-wrapper {
          background: #2c3e50;
          padding: 20px;
          border-radius: 50%;
          display: inline-block;
          margin-bottom: 16px;
        }

        .empty-icon {
          width: clamp(40px, 8vw, 48px);
          height: clamp(40px, 8vw, 48px);
          fill: #bdc3c7;
        }

        .empty-text {
          font-size: clamp(16px, 3vw, 18px);
          font-weight: bold;
          color: #7f8c8d;
          margin: 0;
        }

        /* TABLE VIEW - Desktop */
        .table-view {
          display: none;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .songs-table {
          width: 100%;
          border-collapse: collapse;
        }

        .table-header {
          background: #2c3e50;
          color: white;
        }

        .table-header th {
          padding: 16px;
          font-weight: bold;
          text-align: left;
        }

        .th-song {
          text-align: left;
        }

        .th-type {
          text-align: center;
          width: 120px;
        }

        .th-uploader {
          text-align: center;
          width: 150px;
        }

        .th-actions {
          text-align: center;
          width: 200px;
        }

        .table-row {
          border-bottom: 1px solid #ecf0f1;
          transition: background 0.2s;
        }

        .table-row.even {
          background: #f8f9fa;
        }

        .table-row.odd {
          background: white;
        }

        .table-row:hover {
          background: #e8f4f8 !important;
        }

        .table-row td {
          padding: 16px;
        }

        .td-type {
          text-align: center;
        }

        .td-uploader {
          text-align: center;
          color: #7f8c8d;
          font-size: 14px;
        }

        .td-actions {
          text-align: center;
        }

        .song-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .song-emoji {
          font-size: 24px;
        }

        .song-title {
          font-size: 16px;
          font-weight: 500;
          color: #2c3e50;
        }

        .edit-input {
          width: 100%;
          padding: 8px;
          border: 2px solid #3498db;
          border-radius: 6px;
          font-size: 16px;
          outline: none;
        }

        .type-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          color: white;
          display: inline-block;
        }

        .type-badge.pdf {
          background: #e74c3c;
        }

        .type-badge.image {
          background: #3498db;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }

        .btn:hover {
          transform: translateY(-2px);
        }

        .btn-live {
          background: linear-gradient(90deg, #3498db, #2980b9);
          color: white;
          font-weight: bold;
        }

        .btn-edit {
          background: #f39c12;
          color: white;
        }

        .btn-delete {
          background: #e74c3c;
          color: white;
        }

        .btn-save {
          background: #27ae60;
          color: white;
          font-weight: bold;
        }

        .btn-cancel {
          background: #95a5a6;
          color: white;
        }

        /* CARDS VIEW - Mobile */
        .cards-view {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .song-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 16px;
          border: 1px solid #ecf0f1;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }

        .card-title-section {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .card-emoji {
          font-size: 20px;
          flex-shrink: 0;
        }

        .card-title {
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
          word-break: break-word;
        }

        .type-badge-mobile {
          font-size: 20px;
          flex-shrink: 0;
        }

        .edit-input-mobile {
          width: 100%;
          padding: 8px;
          border: 2px solid #3498db;
          border-radius: 6px;
          font-size: 16px;
          outline: none;
        }

        .card-info {
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #ecf0f1;
        }

        .card-uploader {
          font-size: 14px;
          color: #7f8c8d;
        }

        .card-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .btn-mobile {
          flex: 1;
          min-width: 100px;
          padding: 10px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-mobile:active {
          transform: scale(0.95);
        }

        .btn-mobile.btn-live {
          background: linear-gradient(90deg, #3498db, #2980b9);
          color: white;
        }

        .btn-mobile.btn-edit {
          background: #f39c12;
          color: white;
        }

        .btn-mobile.btn-delete {
          background: #e74c3c;
          color: white;
        }

        .btn-mobile.btn-save {
          background: #27ae60;
          color: white;
        }

        .btn-mobile.btn-cancel {
          background: #95a5a6;
          color: white;
        }

        /* RESPONSIVE */
        @media (min-width: 480px) {
          .refresh-text {
            display: inline;
          }
        }

        @media (min-width: 768px) {
          .table-view {
            display: block;
          }

          .cards-view {
            display: none;
          }

          .btn-text {
            display: inline;
          }
        }

        @media (max-width: 767px) {
          .btn-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default SongLibrary;