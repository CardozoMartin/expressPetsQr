import bcrypt from 'bcryptjs';
import UserModel from '../models/userSchema.js';
import crypto from 'crypto';
import nodemailer from "nodemailer";

// Configurar el transporte de correo con nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "martincardozo1993xp@gmail.com",
    pass: "fvtp ptmw pdgy atgg", // Contraseña de aplicación
  },
});

export const getUsers = async (_, res) => {
  try {
    const data = await UserModel.find({});
    const filterData = data.map((user) => ({
      id: user._doc._id,
      name: user._doc.name,
      email: user._doc.email,
      surname: user._doc.surname,
      isAdmin: user._doc.isAdmin,
    }));
    res.json({ data: filterData, message: 'Usuarios encontrados' });
  } catch (e) {
    res.status(500).json({
      data: null,
      message: 'Ocurrió un error',
    });
  }
};

export const postUser = async (req, res) => {
  const { body } = req;
  
  // Crear el hash de la contraseña
  const hashPassword = bcrypt.hashSync(body.password, 10);
  // Crear el usuario (pero aún no guardarlo)
  const newUser = new UserModel({
    email: body.email,
    name: body.name,
    surname: body.surname,
    password: hashPassword,
    isActive: false,
    verificationToken: body.verificationToken,  // Usar el token generado
  });
  
  // Generar un token de verificación
  
  
  try {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    newUser.verificationToken = verificationToken;
    const verificationLink = `http://localhost:5000/api/v1/verificar/${verificationToken}`;

    // Guardar el usuario en la base de datos
    await newUser.save();

  
    
    // Configurar el correo de verificación
    const mailOptions = {
      from: "martincardozo1993xp@gmail.com",
      to: body.email,
      subject: "Verifica tu correo electrónico",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #4CAF50;">¡Bienvenido, ${body.name}!</h2>
          <p style="color: #333;">Gracias por registrarte en nuestra plataforma. Por favor, haz clic en el botón de abajo para verificar tu correo electrónico.</p>
          <a 
            href="${verificationLink}" 
            style="display: inline-block; margin-top: 20px; padding: 10px 20px; color: white; background-color: #4CAF50; text-decoration: none; font-size: 16px; border-radius: 5px;"
          >
            Verificar correo
          </a>
          <p style="color: #555; margin-top: 20px;">Si no solicitaste esta cuenta, ignora este mensaje.</p>
          <p style="color: #777; font-size: 12px;">&copy; 2024 Nuestra Plataforma. Todos los derechos reservados.</p>
        </div>
      `,
    };

    // Enviar el correo de verificación
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar el correo:", error);
      } else {
        console.log("Correo de verificación enviado:", info.response);
      }
    });

    // Responder con mensaje de éxito
    res.status(201).json({
      data: null,
      message: 'Registro exitoso, se ha enviado un correo de verificación',
    });

  } catch (e) {
    // Manejo de errores si ocurre algún problema al guardar el usuario o enviar el correo
    if (e.message.includes('duplicate')) {
      return res.status(400).json({
        data: null,
        message: 'El email ya se encuentra registrado',
      });
    }

    // Otro tipo de errores
    res.status(500).json({
      data: null,
      message: 'Hubo un problema al registrar el usuario, por favor intenta de nuevo',
    });
    console.error("Error al registrar el usuario o enviar el correo:", e);
  }
};

export const putUser = async (req, res) => {
  const {
    body,
    params: { id },
  } = req;

  if (body.password) {
    const hashPassword = bcrypt.hashSync(body.password, 10);
    body.password = hashPassword;
  }

  try {
    const action = await UserModel.updateOne({ _id: id }, body);
    if (action.matchedCount === 0) {
      res.status(400).json({
        data: null,
        message: 'No se encontro un usuario con ese id',
      });
      return;
    }
    res.json({
      data: null,
      message: 'Usuario editado exitosamente',
    });
  } catch (e) {
    if (e.message.includes('duplicate')) {
      res.status(400).json({
        data: null,
        message: 'El email ya se encuentra registrado',
      });
      return;
    }
  }
};

export const deleteUser = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const action = await UserModel.updateOne({ _id: id }, { isActive: false });
    if (action.matchedCount === 0) {
      res.status(400).json({
        data: null,
        message: 'No se encontro un usuario con ese id',
      });
      return;
    }
    res.json({
      data: null,
      message: 'Usuario eliminado exitosamente',
    });
  } catch (e) {
    res.status(400).json({
      data: null,
      message: 'Ocurrio un error al eliminar el usuario',
    });
    return;
  }
};
