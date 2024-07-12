import UserModel from 'moongose/models/user_model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const { JWT_SECRET_KEY } = process.env;

export const postLogin = async (req, res) => {
  const {
    body: { email, password },
  } = req;

  try {
    const data = await UserModel.findOne({ email, isActive: true });

    if (!data || !bcrypt.compareSync(password, data.password)) {
      res.status(400).json({
        data: null,
        message: 'Usuario o contraseña incorrecta',
      });
      return;
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
      message: 'Ocurrio un error al iniciar sesion',
    });
  }
};
