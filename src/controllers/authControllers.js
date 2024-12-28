import UserModel from '../models/userSchema.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const { JWT_SECRET_KEY } = process.env;

export const postLogin = async (req, res) => {
  const {
    body: { email, password },
  } = req;

  try {
    // Buscar el usuario por correo
    const data = await UserModel.findOne({ email });

    // Verificar si el usuario no existe
    if (!data) {
      return res.status(400).json({
        data: null,
        message: 'Usuario no encontrado',
      });
    }

    // Verificar si la cuenta no está verificada
    if (!data.isVerified) {
      return res.status(400).json({
        data: null,
        message: 'Cuenta no verificada. Por favor, verifica tu correo.',
      });
    }

    // Verificar si la contraseña es incorrecta
    const passwordMatch = bcrypt.compareSync(password, data.password);
    if (!passwordMatch) {
      return res.status(400).json({
        data: null,
        message: 'Contraseña incorrecta',
      });
    }

    // Crear payload para el token
    const userInfo = {
      user: {
        id: data._id,
        firstname: data.firstname,
        lastname: data.lastname,
        username: data.username,
        isAdmin: data.isAdmin,
      },
    };

    // Generar el token
    const token = jwt.sign(userInfo, JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    // Responder con el token
    res.json({
      data: token,
      message: 'Usuario logueado exitosamente',
    });
  } catch (e) {
    res.status(500).json({
      data: null,
      message: 'Ocurrió un error al iniciar sesión',
    });
  }
};
