import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo y título */}
        <div className="logo-section">
          <div className="logo-icon">🎵</div>
          <div className="logo-text">
            <h1 className="logo-title">Músicos Iglesia</h1>
            <p className="logo-subtitle">
              Panel de {user?.role === 'admin' ? 'Administración' : 'Músico'}
            </p>
          </div>
        </div>

        {/* Usuario y logout */}
        <div className="user-section">
          <div className="user-info">
            <p className="user-name">{user?.name}</p>
            <p className="user-role">{user?.role}</p>
          </div>

          <button onClick={handleLogout} className="logout-button">
            <svg className="logout-icon" viewBox="0 0 24 24">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="logout-text">Salir</span>
          </button>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }

        .navbar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .navbar-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: clamp(12px, 2vw, 16px);
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: clamp(10px, 2vw, 12px);
        }

        .logo-icon {
          font-size: clamp(28px, 5vw, 32px);
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .logo-title {
          font-size: clamp(16px, 3vw, 20px);
          font-weight: bold;
          color: white;
          margin: 0;
          white-space: nowrap;
        }

        .logo-subtitle {
          font-size: clamp(11px, 2vw, 12px);
          color: rgba(255,255,255,0.8);
          margin: 0;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: clamp(12px, 2vw, 16px);
          flex-wrap: wrap;
        }

        .user-info {
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          padding: clamp(6px, 1.5vw, 8px) clamp(12px, 2.5vw, 16px);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.3);
        }

        .user-name {
          font-size: clamp(13px, 2.5vw, 14px);
          font-weight: bold;
          color: white;
          margin: 0;
          white-space: nowrap;
        }

        .user-role {
          font-size: clamp(11px, 2vw, 12px);
          color: rgba(255,255,255,0.8);
          margin: 0;
          text-transform: capitalize;
        }

        .logout-button {
          padding: clamp(8px, 1.5vw, 10px) clamp(16px, 3vw, 20px);
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 12px;
          font-size: clamp(13px, 2.5vw, 14px);
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: clamp(6px, 1.5vw, 8px);
          white-space: nowrap;
        }

        .logout-button:hover {
          background: rgba(255,255,255,0.3);
          transform: scale(1.05);
        }

        .logout-icon {
          width: clamp(14px, 3vw, 16px);
          height: clamp(14px, 3vw, 16px);
          fill: currentColor;
          stroke: currentColor;
          stroke-width: 2;
        }

        @media (max-width: 480px) {
          .navbar-content {
            flex-direction: column;
            text-align: center;
          }
          .user-section {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .logout-text { display: none; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;