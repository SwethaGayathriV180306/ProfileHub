import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer as createViteServer } from 'vite';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from './routes/auth';
import studentRoutes from './routes/student';
import adminRoutes from './routes/admin';
import placementRoutes from './routes/placement';
import analyticsRoutes from './routes/analytics';
import documentRoutes from './routes/document';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Trust Proxy for Rate Limiting behind Nginx/Load Balancer
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development to allow Vite scripts
}));
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));
app.use('/uploads', (req, res) => {
  const filename = req.path.substring(1) || 'Unknown_Document';
  
  res.status(200).send(`
    <html>
      <head>
        <title>Dummy Document - \${filename}</title>
        <style>
          body { font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f1f5f9; margin: 0; }
          .certificate { background: white; padding: 50px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: center; max-width: 600px; width: 100%; border: 8px solid #cbd5e1; position: relative; overflow: hidden; }
          .ribbon { position: absolute; top: 20px; right: -30px; background: #3b82f6; color: white; padding: 5px 40px; transform: rotate(45deg); font-weight: bold; font-size: 12px; letter-spacing: 1px; }
          h1 { color: #1e293b; margin-bottom: 10px; font-size: 32px; letter-spacing: -1px; }
          .doc-name { font-size: 20px; color: #3b82f6; font-weight: bold; margin: 30px 0; padding: 20px; border: 2px dashed #93c5fd; border-radius: 8px; background: #eff6ff; word-wrap: break-word; }
          p { color: #64748b; font-size: 16px; line-height: 1.6; }
          .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="ribbon">DUMMY COPY</div>
          <h1>Official Document Replica</h1>
          <p>This view serves as a demonstration placeholder. The original file is not physically stored on the current server disk.</p>
          <div class="doc-name">\${filename}</div>
          <p>If this were a production environment, the actual uploaded PDF/Image would be rendered here securely.</p>
          <div class="footer">ProfileHub Sandbox Environment</div>
        </div>
      </body>
    </html>
  `);
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

import { seedAdmin } from './utils/seed';

// Database Connection
const startServer = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.log('No MONGODB_URI found, starting in-memory MongoDB...');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('In-memory MongoDB started at', mongoUri);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    // Seed Admin User
    await seedAdmin();
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }

  // Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
  });

  console.log('Mounting API routes...');
  app.use('/api/auth', authRoutes);
  app.use('/api/student', studentRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/placement', placementRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/document', documentRoutes);
  console.log('API routes mounted.');

  // Vite Middleware for Development (or Static Fallback for Production)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, 'dist')));

    // The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  // Start Server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
