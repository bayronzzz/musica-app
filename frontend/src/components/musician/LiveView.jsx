import { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';

const LiveView = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLive, setIsLive] = useState(false);
  const { socket, isConnected } = useSocket();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (socket) {
      socket.emit('musician:request-current');

      socket.on('live:started', () => {
        setIsLive(true);
      });

      socket.on('live:song-changed', (data) => {
        setCurrentSong(data);
        setCurrentPage(data.pageNumber || 1);
        setIsLive(true);
      });

      socket.on('live:page-changed', (data) => {
        setCurrentPage(data.pageNumber);
      });

      socket.on('live:stopped', () => {
        setIsLive(false);
        setCurrentSong(null);
        setCurrentPage(1);
      });

      socket.on('live:current-song', (data) => {
        if (data.current_song_id) {
          setCurrentSong({
            songId: data.current_song_id,
            title: data.song_title,
            filePath: data.file_path,
            fileType: data.file_type,
            pageNumber: data.current_page_number,
            pageName: data.page_name
          });
          setCurrentPage(data.current_page_number || 1);
          setIsLive(true);
        }
      });

      socket.on('live:no-session', () => {
        setIsLive(false);
        setCurrentSong(null);
      });

      return () => {
        socket.off('live:started');
        socket.off('live:song-changed');
        socket.off('live:page-changed');
        socket.off('live:stopped');
        socket.off('live:current-song');
        socket.off('live:no-session');
      };
    }
  }, [socket]);

  if (!isConnected) {
    return (
      <div className="connecting-container">
        <div className="connecting-content">
          <div className="spinner-wrapper">
            <div className="spinner"></div>
            <div className="spinner-icon-wrapper">
              <svg className="spinner-icon" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
            </div>
          </div>
          <p className="connecting-title">Conectando al servidor...</p>
          <p className="connecting-subtitle">Espera un momento</p>
        </div>

        <style>{`
          .connecting-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1a202c, #1e3a8a, #7c3aed);
            color: white;
            padding: 20px;
          }
          .connecting-content {
            text-align: center;
          }
          .spinner-wrapper {
            position: relative;
            width: clamp(72px, 15vw, 96px);
            height: clamp(72px, 15vw, 96px);
            margin: 0 auto;
          }
          .spinner {
            animation: spin 1s linear infinite;
            border-radius: 50%;
            border: 4px solid #3b82f6;
            border-top-color: transparent;
            width: 100%;
            height: 100%;
          }
          .spinner-icon-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .spinner-icon {
            width: 50%;
            height: 50%;
            fill: #3b82f6;
          }
          .connecting-title {
            margin-top: 24px;
            font-size: clamp(16px, 4vw, 20px);
            font-weight: bold;
          }
          .connecting-subtitle {
            margin-top: 8px;
            color: #93c5fd;
            font-size: clamp(14px, 3vw, 16px);
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isLive || !currentSong) {
    return (
      <div className="waiting-container">
        <div className="waiting-content">
          <div className="waiting-icon">
            <svg className="music-icon" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          
          <h2 className="waiting-title">Esperando al director...</h2>
          <p className="waiting-subtitle">
            Las canciones aparecerán aquí cuando el director inicie el modo en vivo
          </p>

          <div className="status-badge">
            <span className="status-pulse-wrapper">
              <span className="status-pulse"></span>
              <span className="status-dot"></span>
            </span>
            <span className="status-text">Conectado y listo</span>
          </div>
        </div>

        <style>{`
          .waiting-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1a202c, #1e3a8a, #7c3aed);
            color: white;
            padding: 20px;
          }
          .waiting-content {
            text-align: center;
            max-width: 600px;
          }
          .waiting-icon {
            margin-bottom: clamp(24px, 5vw, 32px);
            animation: bounce 2s infinite;
          }
          .music-icon {
            width: clamp(80px, 20vw, 128px);
            height: clamp(80px, 20vw, 128px);
            fill: none;
            stroke: #3b82f6;
            stroke-width: 1.5;
            margin: 0 auto;
          }
          .waiting-title {
            font-size: clamp(24px, 6vw, 40px);
            font-weight: bold;
            margin-bottom: 16px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          .waiting-subtitle {
            font-size: clamp(16px, 3vw, 20px);
            color: #bfdbfe;
            margin-bottom: clamp(24px, 5vw, 32px);
            line-height: 1.5;
          }
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 9999px;
            padding: clamp(12px, 2vw, 16px) clamp(20px, 4vw, 32px);
            border: 1px solid rgba(255,255,255,0.2);
          }
          .status-pulse-wrapper {
            position: relative;
            display: flex;
            width: 16px;
            height: 16px;
          }
          .status-pulse {
            animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: #4ade80;
            opacity: 0.75;
          }
          .status-dot {
            position: relative;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: #22c55e;
          }
          .status-text {
            font-weight: bold;
            font-size: clamp(14px, 3vw, 18px);
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes ping {
            75%, 100% { transform: scale(2); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="live-view-container">
      {/* Header */}
      <div className="live-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="song-title">{currentSong.title}</h1>
            {currentSong.pageName && (
              <p className="page-name">{currentSong.pageName}</p>
            )}
          </div>

          <div className="badges-section">
            <div className="live-badge">
              <span className="live-pulse-wrapper">
                <span className="live-pulse"></span>
                <span className="live-dot"></span>
              </span>
              <span className="live-text">EN VIVO</span>
            </div>

            {currentSong.fileType === 'pdf' && (
              <div className="page-badge">
                <span>📄 Página {currentPage}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visor de canción */}
      <div className="viewer-section">
        <div className="viewer-wrapper">
          {currentSong.fileType === 'pdf' ? (
            <iframe
              src={`${API_URL}/${currentSong.filePath}#page=${currentPage}`}
              className="pdf-iframe"
              title={currentSong.title}
            />
          ) : (
            <div className="image-wrapper">
              <img
                src={`${API_URL}/${currentSong.filePath}`}
                alt={currentSong.title}
                className="song-image"
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .live-view-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a202c, #1f2937, #000000);
          display: flex;
          flex-direction: column;
        }

        /* HEADER */
        .live-header {
          background: linear-gradient(90deg, #1f2937, #111827);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          border-bottom: 1px solid #374151;
          padding: clamp(16px, 3vw, 20px) clamp(16px, 3vw, 24px);
        }

        .header-content {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: clamp(12px, 2vw, 16px);
        }

        .title-section {
          flex: 1;
        }

        .song-title {
          font-size: clamp(20px, 5vw, 32px);
          font-weight: bold;
          color: white;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          word-break: break-word;
        }

        .page-name {
          font-size: clamp(12px, 2.5vw, 14px);
          color: #60a5fa;
          font-weight: bold;
          margin: 0;
        }

        .badges-section {
          display: flex;
          align-items: center;
          gap: clamp(8px, 2vw, 16px);
          flex-wrap: wrap;
        }

        .live-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(239, 68, 68, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 9999px;
          padding: clamp(8px, 2vw, 12px) clamp(16px, 3vw, 24px);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .live-pulse-wrapper {
          position: relative;
          display: flex;
          width: 12px;
          height: 12px;
          flex-shrink: 0;
        }

        .live-pulse {
          animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #ef4444;
          opacity: 0.75;
        }

        .live-dot {
          position: relative;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #dc2626;
        }

        .live-text {
          font-weight: bold;
          color: #fee2e2;
          letter-spacing: 1px;
          font-size: clamp(12px, 2.5vw, 14px);
        }

        .page-badge {
          background: rgba(59, 130, 246, 0.2);
          backdrop-filter: blur(10px);
          padding: clamp(8px, 2vw, 12px) clamp(16px, 3vw, 24px);
          border-radius: 9999px;
          border: 1px solid rgba(59, 130, 246, 0.3);
          font-weight: bold;
          color: #dbeafe;
          font-size: clamp(12px, 2.5vw, 14px);
        }

        /* VIEWER */
        .viewer-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(12px, 2vw, 16px);
          overflow: hidden;
        }

        .viewer-wrapper {
          width: 100%;
          height: 100%;
          max-width: 1200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pdf-iframe {
          width: 100%;
          height: calc(100vh - clamp(120px, 20vh, 160px));
          border: none;
          border-radius: clamp(12px, 2vw, 16px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          background: white;
        }

        .image-wrapper {
          width: 100%;
          height: calc(100vh - clamp(120px, 20vh, 160px));
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: clamp(12px, 2vw, 16px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          padding: clamp(8px, 2vw, 16px);
        }

        .song-image {
          max-width: 100%;
          max-height: 100%;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        @keyframes ping {
          75%, 100% { 
            transform: scale(2); 
            opacity: 0; 
          }
        }

        /* RESPONSIVE */
        @media (min-width: 768px) {
          .header-content {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        @media (max-width: 480px) {
          .badges-section {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default LiveView;