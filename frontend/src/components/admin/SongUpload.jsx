import { useState, useRef } from 'react';
import { songService } from '../../services/songService';

const SongUpload = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Solo se permiten archivos PDF, JPG o PNG');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !file) {
      setError('Completa el título y selecciona un archivo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('file', file);

      // Subida usando songService para mantener consistencia con /uploads/
      const savedSong = await songService.uploadSong(formData);

      // Limpieza del formulario
      setTitle('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Callback al componente padre
      if (onUploadSuccess) onUploadSuccess(savedSong);
    } catch (err) {
      setError(err.message || 'Error al subir la canción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      background: '#f5f7fa',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      margin: '-8px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: '30px',
        width: '100%',
        maxWidth: '500px'
      }}>
        <h2 style={{ color: '#2c3e50', fontSize: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🎵 Subir Nueva Canción
        </h2>

        {error && (
          <div style={{
            background: '#fadbd8',
            border: '1px solid #e74c3c',
            color: '#c0392b',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#34495e', fontWeight: '500' }}>
              Título de la canción
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Sublime Gracia"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #bdc3c7',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#34495e', fontWeight: '500' }}>
              Archivo (PDF o Imagen)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${file ? '#2ecc71' : '#bdc3c7'}`,
                borderRadius: '10px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                background: file ? '#e8f5e9' : '#f8f9fa'
              }}
            >
              <div style={{ marginBottom: '8px', color: file ? '#2ecc71' : '#7f8c8d' }}>📁</div>
              <p style={{ margin: '8px 0 0', color: '#7f8c8d', fontSize: '14px' }}>
                {file ? 'Archivo seleccionado' : 'Haz clic para seleccionar archivo'}
              </p>
              <p style={{ color: '#7f8c8d', fontSize: '12px', marginTop: '4px' }}>
                PDF para partituras · JPG/PNG para letras con acordes
              </p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
              />
            </div>

            {file && (
              <div style={{
                marginTop: '10px',
                padding: '8px',
                background: '#ecf0f1',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ✅ {file.name}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#95a5a6' : 'linear-gradient(90deg, #27ae60, #2ecc71)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? 'Subiendo...' : '📤 Subir Canción'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SongUpload;