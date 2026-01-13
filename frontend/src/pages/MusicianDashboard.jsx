import Navbar from '../components/common/Navbar';
import LiveView from '../components/musician/LiveView';

const MusicianDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🎵 Modo En Vivo
          </h2>

          <LiveView />
        </div>
      </main>
    </div>
  );
};

export default MusicianDashboard;
