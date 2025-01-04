// index.js
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path'; 

import './database/database.js';
import userRoute from './routes/useRoutes.js';
import authRoute from './routes/authRoute.js';
import petRoute from './routes/petRoute.js';
import commentRoute from './routes/commentRoute.js';
import tokenRoute from './routes/tokenRoute.js';
import UserModel from './models/userSchema.js';

const app = express();
const PORT = process.env.PORT || 5000;



// Middlewares
app.use(morgan('dev'));

const allowedOrigins = [
  'https://petsqr.netlify.app', 
  'https://serverpetsqr.onrender.com',
  'http://localhost:5173',
  'http://localhost:5000', // Agregamos el origen del backend
  'http://localhost' // Para cubrir diferentes puertos locales
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes del navegador cuando accede directamente al HTML
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Especificar métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Especificar headers permitidos
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas - Asegúrate de que userRoute incluya la ruta de reset
app.use('/api/v1/registro', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/pet', petRoute);
app.use('/api/v1/comments', commentRoute);
app.use("/api/v1/verificar", tokenRoute);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});