import UserModel from 'moongose/models/user_model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const { JWT_SECRET_KEY } = process.env;

export const postLogin = async (req, res) => {
  const {
    body: { email, password },
  } = req;

  try {
    // Buscar el usuario por correo y verificar que esté verificado
    const data = await UserModel.findOne({ email, isVerified: true });

    // Verificar si el usuario no existe o si la contraseña no coincide
    if (!data) {
      return res.status(400).json({
        data: null,
        message: 'Usuario no encontrado o correo no verificado',
      });
    }

    if (!bcrypt.compareSync(password, data.password)) {
      return res.status(400).json({
        data: null,
        message: 'Contraseña incorrecta',
      });
    }
    if (!data.isVerified) {
      return res.status(400).json({
        data: null,
        message: 'Cuenta no verificada',
      });
    }

    const userInfo = {
      user: {
        id: data._doc._id,
        firstname: data._doc.firstname,
        lastname: data._doc.lastname,
        username: data._doc.username,
        isAdmin: data._doc.isAdmin,
      },
    };

    // Generar el token
    const token = jwt.sign(userInfo, JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

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

