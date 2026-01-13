require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Rutas
const authRoutes = require('./routes/authRoutes');
const songRoutes = require('./routes/songRoutes');
const liveRoutes = require('./routes/liveRoutes');

// Socket
const setupLiveHandlers = require('./socket/liveHandler');

const app = express();
const server = http.createServer(app);

/* ======================
   SOCKET.IO
====================== */
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.FRONTEND_URL] 
      : '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

/* ======================
   MIDDLEWARES
====================== */
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL]
    : '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   RUTA ABSOLUTA DE UPLOADS
====================== */
const uploadsPath = path.resolve(__dirname, '../uploads');

// Verificamos que exista
if (!fs.existsSync(uploadsPath)) {
  console.log('⚠️ Creando carpeta uploads en:', uploadsPath);
  fs.mkdirSync(uploadsPath, { recursive: true });
} else {
  console.log('✅ Carpeta uploads encontrada en:', uploadsPath);
}

/* ======================
   SERVIR ARCHIVOS CON HEADERS CORRECTOS
====================== */
app.use('/uploads', (req, res, next) => {
  const filePath = path.join(uploadsPath, req.path);
  
  if (filePath.endsWith('.pdf')) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
  } else if (filePath.match(/\.(jpg|jpeg|png|gif)$/i)) {
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif'
    };
    res.setHeader('Content-Type', contentTypes[ext] || 'image/jpeg');
  }
  
  next();
}, express.static(uploadsPath));

/* ======================
   RUTAS API
====================== */
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/live', liveRoutes);

/* ======================
   HEALTH CHECK (para Railway)
====================== */
app.get('/', (req, res) => {
  res.json({
    message: '🎵 API de Músicos de Iglesia funcionando correctamente',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/* ======================
   SOCKET HANDLERS
====================== */
setupLiveHandlers(io);

/* ======================
   MANEJO DE ERRORES
====================== */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

/* ======================
   SERVER
====================== */
const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📁 Archivos estáticos en /uploads`);
  console.log(`📡 Socket.IO activo`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});