import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import './database/database.js';
import userRoute from './routes/useRoutes.js';
import authRoute from './routes/authRoute.js';
import petRoute from './routes/petRoute.js';
import commentRoute from './routes/commentRoute.js'

const app = express();

const PORT = process.env.PORT || 5000;

app.use(morgan('dev'));

const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como solicitudes desde herramientas de prueba)
    if (!origin) return callback(null, true);
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

app.use('/api/v1/registro', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/pet', petRoute);
app.use('/api/v1/comments', commentRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
