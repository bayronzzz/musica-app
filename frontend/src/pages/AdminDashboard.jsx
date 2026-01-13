import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import SongUpload from '../components/admin/SongUpload';
import SongLibrary from '../components/admin/SongLibrary';
import LiveMode from '../components/admin/LiveMode';

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('library');
  const [selectedSong, setSelectedSong] = useState(null);
  const [refreshLibrary, setRefreshLibrary] = useState(0);

  const handleSelectSong = (song) => {
    setSelectedSong(song);
    setCurrentView('live');
  };

  const handleBackFromLive = () => {
    setSelectedSong(null);
    setCurrentView('library');
  };

  const handleUploadSuccess = () => {
    setRefreshLibrary(prev => prev + 1);
    setCurrentView('library');
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard-content">
        {/* Navegación por pestañas */}
        {currentView !== 'live' && (
          <div className="tabs-container">
            <button
              onClick={() => setCurrentView('library')}
              className={`tab-button ${currentView === 'library' ? 'active library' : ''}`}
            >
              <svg className="tab-icon" viewBox="0 0 24 24">
                <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span className="tab-text">Biblioteca</span>
              <span className="tab-text-full">Biblioteca de Canciones</span>
            </button>

            <button
              onClick={() => setCurrentView('upload')}
              className={`tab-button ${currentView === 'upload' ? 'active upload' : ''}`}
            >
              <svg className="tab-icon" viewBox="0 0 24 24">
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="tab-text">Subir</span>
              <span className="tab-text-full">Subir Canciones</span>
            </button>
          </div>
        )}

        {/* Contenido según la vista */}
        <div className="view-content">
          {currentView === 'library' && (
            <SongLibrary 
              key={refreshLibrary} 
              onSelectSong={handleSelectSong} 
            />
          )}

          {currentView === 'upload' && (
            <SongUpload onUploadSuccess={handleUploadSuccess} />
          )}

          {currentView === 'live' && selectedSong && (
            <LiveMode 
              selectedSong={selectedSong} 
              onBack={handleBackFromLive} 
            />
          )}
        </div>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .dashboard-container {
          min-height: 100vh;
          background: #f5f7fa;
        }

        .dashboard-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: clamp(16px, 3vw, 24px);
        }

        /* TABS */
        .tabs-container {
          background: white;
          border-radius: clamp(12px, 2vw, 16px);
          padding: clamp(8px, 1.5vw, 12px);
          margin-bottom: clamp(16px, 3vw, 24px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: clamp(8px, 1.5vw, 12px);
        }

        .tab-button {
          padding: clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px);
          background: #f8f9fa;
          color: #666;
          border: none;
          border-radius: clamp(10px, 1.5vw, 12px);
          font-size: clamp(14px, 2.5vw, 16px);
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(6px, 1.5vw, 8px);
          position: relative;
          overflow: hidden;
        }

        .tab-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: inherit;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .tab-button:hover:not(.active) {
          background: #e9ecef;
          transform: translateY(-2px);
        }

        .tab-button:active {
          transform: translateY(0);
        }

        /* Active states */
        .tab-button.active {
          color: white;
          position: relative;
        }

        .tab-button.active.library {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .tab-button.active.upload {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
        }

        .tab-icon {
          width: clamp(18px, 4vw, 20px);
          height: clamp(18px, 4vw, 20px);
          fill: currentColor;
          flex-shrink: 0;
        }

        /* Text visibility based on screen size */
        .tab-text {
          display: inline;
        }

        .tab-text-full {
          display: none;
        }

        /* VIEW CONTENT */
        .view-content {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* RESPONSIVE BREAKPOINTS */
        
        /* Mobile small */
        @media (max-width: 480px) {
          .tabs-container {
            grid-template-columns: 1fr 1fr;
          }

          .tab-button {
            flex-direction: column;
            padding: 12px 8px;
          }

          .tab-icon {
            margin-bottom: 4px;
          }
        }

        /* Tablet and up */
        @media (min-width: 640px) {
          .tab-text {
            display: none;
          }

          .tab-text-full {
            display: inline;
          }

          .tabs-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .tab-button:hover.active {
            transform: translateY(-4px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
          }

          .tab-button:hover.active.upload {
            box-shadow: 0 6px 20px rgba(240, 147, 251, 0.5);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;