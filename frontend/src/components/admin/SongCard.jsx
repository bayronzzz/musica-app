import { useState } from 'react';

const SongCard = ({ song, onDelete, onSelect, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(song.title);

  const API_URL = 'https://api.example.com'; // Reemplaza con tu variable de entorno

  const handleEdit = async () => {
    if (isEditing && newTitle.trim() !== song.title) {
      await onEdit(song.id, newTitle.trim());
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="song-card">
      {/* PREVIEW */}
      <div className="preview-container">
        {song.file_type === 'pdf' ? (
          <iframe
            src={`${API_URL}/${song.file_path}#page=1`}
            title={song.title}
            className="preview-pdf"
          />
        ) : (
          <img
            src={`${API_URL}/${song.file_path}`}
            alt={song.title}
            className="preview-image"
          />
        )}
      </div>

      {/* CONTENT */}
      <div className="card-content">
        {/* TÍTULO + ACCIONES */}
        <div className="title-actions">
          {isEditing ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              className="title-input"
            />
          ) : (
            <h3 className="card-title">{song.title}</h3>
          )}

          <div className="action-buttons">
            <button onClick={handleEdit} className="btn-action btn-edit">
              {isEditing ? '✔️' : '✏️'}
            </button>

            <button onClick={() => onDelete(song.id)} className="btn-action btn-delete">
              🗑️
            </button>
          </div>
        </div>

        {/* INFO */}
        <div className="card-info">
          <span className="info-item">
            {song.file_type === 'pdf' ? '📄 PDF' : '🖼️ Imagen'}
          </span>
          <span className="info-item">
            Subido por: {song.uploaded_by_name || 'Desconocido'}
          </span>
          {song.page_count > 0 && (
            <span className="info-item">Páginas: {song.page_count}</span>
          )}
        </div>

        {/* BOTÓN PRINCIPAL */}
        <button onClick={() => onSelect(song)} className="btn-primary">
          🎵 Usar en modo en vivo
        </button>
      </div>

      <style>{`
        .song-card {
          background: #2c3e50;
          border-radius: clamp(12px, 2vw, 16px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          overflow: hidden;
          border: 1px solid #34495e;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .song-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }

        /* PREVIEW */
        .preview-container {
          width: 100%;
          height: clamp(160px, 30vw, 192px);
          background: #1a252f;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
        }

        .preview-pdf {
          width: 100%;
          height: 100%;
          border: none;
          opacity: 0.9;
        }

        .preview-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          padding: clamp(6px, 1.5vw, 8px);
        }

        /* CONTENT */
        .card-content {
          padding: clamp(16px, 3vw, 20px);
          display: flex;
          flex-direction: column;
          gap: clamp(10px, 2vw, 12px);
          flex: 1;
        }

        /* TÍTULO Y ACCIONES */
        .title-actions {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: clamp(6px, 1.5vw, 8px);
          min-height: 40px;
        }

        .card-title {
          font-weight: bold;
          font-size: clamp(16px, 3vw, 18px);
          color: white;
          margin: 0;
          line-height: 1.4;
          word-break: break-word;
          flex: 1;
        }

        .title-input {
          flex: 1;
          padding: clamp(6px, 1.5vw, 8px);
          border: 1px solid #34495e;
          border-radius: 6px;
          background: #34495e;
          color: white;
          font-size: clamp(14px, 2.5vw, 16px);
          outline: none;
          transition: border-color 0.2s;
        }

        .title-input:focus {
          border-color: #3498db;
        }

        .action-buttons {
          display: flex;
          gap: clamp(6px, 1.5vw, 8px);
          flex-shrink: 0;
        }

        .btn-action {
          padding: clamp(6px, 1.5vw, 8px);
          border-radius: 6px;
          background: #34495e;
          border: none;
          cursor: pointer;
          font-size: clamp(12px, 2.5vw, 14px);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: clamp(32px, 6vw, 36px);
          min-height: clamp(32px, 6vw, 36px);
        }

        .btn-action:hover {
          transform: scale(1.1);
          background: #3d5368;
        }

        .btn-action:active {
          transform: scale(0.95);
        }

        .btn-edit {
          color: #3498db;
        }

        .btn-edit:hover {
          color: #5dade2;
        }

        .btn-delete {
          color: #e74c3c;
        }

        .btn-delete:hover {
          color: #ec7063;
        }

        /* INFO */
        .card-info {
          font-size: clamp(11px, 2vw, 12px);
          color: #bdc3c7;
          display: flex;
          flex-direction: column;
          gap: clamp(3px, 1vw, 4px);
        }

        .info-item {
          display: block;
        }

        /* BOTÓN PRINCIPAL */
        .btn-primary {
          margin-top: auto;
          padding: clamp(10px, 2vw, 12px);
          border-radius: 8px;
          background: linear-gradient(90deg, #3498db, #2980b9);
          color: white;
          border: none;
          font-weight: bold;
          cursor: pointer;
          font-size: clamp(14px, 2.5vw, 16px);
          transition: all 0.2s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .btn-primary:hover {
          background: linear-gradient(90deg, #2980b9, #3498db);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        /* RESPONSIVE ADJUSTMENTS */
        @media (max-width: 480px) {
          .btn-primary {
            font-size: 14px;
            padding: 10px;
          }
          
          .card-title {
            font-size: 16px;
          }
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .preview-container {
            height: 200px;
          }
        }

        @media (min-width: 1024px) {
          .song-card:hover .btn-primary {
            background: linear-gradient(90deg, #2980b9, #3498db);
          }
        }
      `}</style>
    </div>
  );
};

// Demo Component
export default function App() {
  const [songs, setSongs] = useState([
    {
      id: 1,
      title: "Amazing Grace - Versión Completa para Orquesta",
      file_type: "pdf",
      file_path: "songs/amazing-grace.pdf",
      uploaded_by_name: "Juan Pérez",
      page_count: 5
    },
    {
      id: 2,
      title: "Himno Nacional",
      file_type: "image",
      file_path: "songs/himno.jpg",
      uploaded_by_name: "María García",
      page_count: 0
    },
    {
      id: 3,
      title: "Sinfonía No. 9 - Beethoven",
      file_type: "pdf",
      file_path: "songs/beethoven-9.pdf",
      uploaded_by_name: "Carlos López",
      page_count: 12
    }
  ]);

  const handleDelete = (id) => {
    setSongs(songs.filter(s => s.id !== id));
    alert(`Canción ${id} eliminada`);
  };

  const handleSelect = (song) => {
    alert(`Seleccionada: ${song.title}`);
  };

  const handleEdit = async (id, newTitle) => {
    setSongs(songs.map(s => s.id === id ? {...s, title: newTitle} : s));
  };

  return (
    <div style={{
      background: '#0f111a',
      minHeight: '100vh',
      padding: 'clamp(16px, 3vw, 24px)'
    }}>
      <h1 style={{
        color: 'white',
        fontSize: 'clamp(24px, 5vw, 32px)',
        marginBottom: 'clamp(20px, 4vw, 32px)',
        textAlign: 'center'
      }}>
        Biblioteca de Partituras
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
        gap: 'clamp(16px, 3vw, 24px)',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {songs.map(song => (
          <SongCard
            key={song.id}
            song={song}
            onDelete={handleDelete}
            onSelect={handleSelect}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
}