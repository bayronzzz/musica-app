import { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';

const LiveMode = ({ selectedSong, onBack }) => {
  const [isLive, setIsLive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { socket } = useSocket();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (selectedSong) {
      startLive();
    }
    return () => {
      if (isLive) {
        stopLive();
      }
    };
  }, [selectedSong]);

  const startLive = () => {
    socket?.emit('admin:start-live');
    socket?.emit('admin:change-song', {
      songId: selectedSong.id,
      pageNumber: 1
    });
    setIsLive(true);
    setCurrentPage(1);
  };

  const stopLive = () => {
    socket?.emit('admin:stop-live');
    setIsLive(false);
    if (onBack) onBack();
  };

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > (selectedSong.page_count || 999)) return;
    socket?.emit('admin:change-page', {
      songId: selectedSong.id,
      pageNumber: newPage
    });
    setCurrentPage(newPage);
  };

  if (!selectedSong) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#bdc3c7',
        padding: '20px'
      }}>
        <div style={{ fontSize: '80px', opacity: 0.2 }}>🎵</div>
        <p style={{ fontSize: '20px', fontWeight: 'lighter', letterSpacing: '1px' }}>
          Selecciona una canción para iniciar
        </p>
      </div>
    );
  }

  return (
    <div className="live-mode-container">
      {/* HEADER */}
      <div className="header">
        <div className="header-content">
          <div className="title-section">
            <div className="title-row">
              <h2 className="title">{selectedSong.title}</h2>
              {isLive && (
                <div className="live-badge">
                  <div className="live-dot"></div>
                  En Vivo
                </div>
              )}
            </div>
            <p className="subtitle">
              <span className="status-dot"></span>
              Transmitiendo a todos los músicos conectados
            </p>
          </div>

          <div className="button-group">
            <button onClick={onBack} className="btn btn-secondary">
              Volver
            </button>
            <button onClick={stopLive} className="btn btn-danger">
              Detener Sesión
            </button>
          </div>
        </div>
      </div>

      {/* VISOR */}
      <div className="viewer-container">
        <div className="viewer-wrapper">
          <div className="viewer-content">
            <div className="media-container">
              {selectedSong.file_type === 'pdf' ? (
                <iframe
                  src={`${API_URL}/${selectedSong.file_path}#page=${currentPage}`}
                  className="pdf-viewer"
                  title={selectedSong.title}
                />
              ) : (
                <img
                  src={`${API_URL}/${selectedSong.file_path}`}
                  alt={selectedSong.title}
                  className="image-viewer"
                />
              )}
            </div>
          </div>
        </div>

        {/* CONTROLES DE NAVEGACIÓN */}
        {selectedSong.file_type === 'pdf' && (
          <div className="navigation-controls">
            <button
              onClick={() => changePage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="nav-button"
              style={{ opacity: currentPage === 1 ? 0.3 : 1 }}
            >
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="page-indicator">
              <span className="page-number">
                {currentPage.toString().padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={() => changePage(currentPage + 1)}
              className="nav-button"
            >
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .live-mode-container {
          background: #0f111a;
          color: #ecf0f1;
          min-height: 100vh;
          padding: clamp(12px, 3vw, 20px);
        }

        /* HEADER STYLES */
        .header {
          background: #1a1d2b;
          border-radius: clamp(12px, 2vw, 16px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          padding: clamp(16px, 3vw, 24px);
          margin-bottom: clamp(16px, 3vw, 24px);
        }

        .header-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .title-section {
          flex: 1;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .title {
          font-size: clamp(20px, 5vw, 32px);
          font-weight: bold;
          margin: 0;
          background: linear-gradient(90deg, white, #bdc3c7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          word-break: break-word;
        }

        .live-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #2980b9;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: clamp(10px, 2vw, 12px);
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          white-space: nowrap;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 8px #3498db;
        }

        .subtitle {
          font-size: clamp(12px, 2.5vw, 14px);
          color: #bdc3c7;
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: #f1c40f;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .button-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn {
          padding: clamp(10px, 2vw, 12px) clamp(16px, 3vw, 20px);
          border-radius: 8px;
          cursor: pointer;
          font-size: clamp(14px, 2.5vw, 16px);
          transition: all 0.2s;
          border: none;
          font-weight: 500;
          flex: 1;
          min-width: 120px;
          white-space: nowrap;
        }

        .btn-secondary {
          background: rgba(255,255,255,0.05);
          color: #bdc3c7;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.1);
        }

        .btn-danger {
          background: linear-gradient(90deg, #e67e22, #d35400);
          color: white;
          box-shadow: 0 4px 12px rgba(230, 126, 34, 0.3);
        }

        .btn-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(230, 126, 34, 0.4);
        }

        /* VIEWER STYLES */
        .viewer-container {
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
        }

        .viewer-wrapper {
          position: relative;
          border-radius: clamp(12px, 2vw, 16px);
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.05);
        }

        .viewer-content {
          background: #1a1d2b;
          border-radius: clamp(12px, 2vw, 16px);
          overflow: hidden;
        }

        .media-container {
          aspect-ratio: 3/4;
          max-height: 75vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.4);
        }

        .pdf-viewer {
          width: 100%;
          height: 100%;
          border: none;
          filter: invert(5%) grayscale(10%);
        }

        .image-viewer {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          padding: clamp(8px, 2vw, 12px);
        }

        /* NAVIGATION CONTROLS */
        .navigation-controls {
          margin-top: clamp(16px, 3vw, 24px);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: clamp(16px, 4vw, 24px);
          flex-wrap: wrap;
        }

        .nav-button {
          padding: clamp(12px, 2.5vw, 16px);
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          font-size: 24px;
          color: #f1c40f;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-button:disabled {
          cursor: not-allowed;
        }

        .nav-button:not(:disabled):hover {
          background: rgba(255,255,255,0.1);
          transform: scale(1.1);
        }

        .nav-icon {
          width: clamp(20px, 4vw, 24px);
          height: clamp(20px, 4vw, 24px);
          fill: currentColor;
        }

        .page-indicator {
          background: #1a1d2b;
          border: 2px solid #f1c40f;
          padding: clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px);
          border-radius: 16px;
          box-shadow: 0 0 12px rgba(241, 196, 15, 0.2);
        }

        .page-number {
          font-size: clamp(20px, 4vw, 24px);
          font-weight: bold;
          color: #f1c40f;
        }

        /* RESPONSIVE BREAKPOINTS */
        @media (min-width: 768px) {
          .header-content {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }

          .button-group {
            flex-wrap: nowrap;
          }

          .btn {
            flex: initial;
          }
        }

        @media (max-width: 480px) {
          .btn {
            min-width: 100px;
            font-size: 14px;
            padding: 10px 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default LiveMode;