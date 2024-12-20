import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import './database/database.js';
import userRoute from './routes/useRoutes.js';
import authRoute from './routes/authRoute.js';
import petRoute from './routes/petRoute.js';
import commentRoute from './routes/commentRoute.js'
import UserModel from './models/userSchema.js';




const app = express();

const PORT = process.env.PORT || 5000;

app.use(morgan('dev'));

const allowedOrigins = ['https://petsqr.netlify.app','http://localhost:5173'];

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
//ybbl bewc qahs pdpl
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/registro', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/pet', petRoute);
app.use('/api/v1/comments', commentRoute);
app.get("/api/v1/verificar/:token", async (req, res) => {
  const { token } = req.params;
  
  try {
    // Verificar si el token recibido es correcto
    console.log('Buscando token:', token);

    const usuario = await UserModel.findOne({ verificationToken: token });

    // Si no se encuentra el usuario, el token es inválido
    if (!usuario) {
      return res.status(400).json({ message: "Token de verificación inválido o expirado" });
    }

    usuario.isVerified = true;
    usuario.verificationToken = null;
    await usuario.save();

    res.status(200).json({ message: "Correo verificado exitosamente" });
  } catch (error) {
    console.error('Error al verificar el correo:', error); // Agrega más detalles al error
    res.status(500).json({ message: "Error al verificar el correo", error });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
