const Loader = ({ message = 'Cargando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      
      {/* Spinner */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-200"></div>
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
      </div>

      {/* Texto */}
      <p className="text-lg font-semibold text-gray-700 animate-pulse">
        {message}
      </p>

      {/* Hint musical */}
      <p className="mt-2 text-sm text-gray-400">
        🎵 Preparando todo para los músicos…
      </p>
    </div>
  );
};

export default Loader;
