import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import './database/database.js';
import userRoute from './routes/useRoutes.js';
import authRoute from './routes/authRoute.js';
import petRoute from './routes/petRoute.js';
import commentRoute from './routes/commentRoute.js';
import tokenRoute from './routes/tokenRoute.js'
import UserModel from './models/userSchema.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Simular __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(morgan('dev'));

const allowedOrigins = ['https://petsqr.netlify.app', 'http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Permitir solicitudes sin origen
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/v1/registro', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/pet', petRoute);
app.use('/api/v1/comments', commentRoute);
app.use("/api/v1/verificar",tokenRoute );

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
