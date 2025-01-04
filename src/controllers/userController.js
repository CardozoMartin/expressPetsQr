import bcrypt from 'bcryptjs';
import UserModel from '../models/userSchema.js';
import crypto from 'crypto';
import nodemailer from "nodemailer";
const emailUser = process.env.EMAIL_USER;
const passUser = process.env.EMAIL_PASS;
const Render = process.env.RENDER
// Configurar el transporte de correo con nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: passUser, // Contraseña de aplicación
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
    const verificationLink = `${Render}/api/v1/verificar/${verificationToken}`;

    // Guardar el usuario en la base de datos
    await newUser.save();



    // Configurar el correo de verificación
    const mailOptions = {
      from: emailUser,
      to: body.email,
      subject: "Verifica tu correo electrónico",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #4CAF50;">¡Bienvenido, ${body.name}!</h2>
          <p style="color: #333;">Gracias por registrarte en PetsQr. Por favor, haz clic en el botón de abajo para verificar tu correo electrónico.</p>
          <a 
            href="${verificationLink}" 
            style="display: inline-block; margin-top: 20px; padding: 10px 20px; color: white; background-color: #4CAF50; text-decoration: none; font-size: 16px; border-radius: 5px;"
          >
            Verificar correo
          </a>
          <p style="color: #555; margin-top: 20px;">Si no solicitaste esta cuenta, ignora este mensaje.</p>
          <p style="color: #777; font-size: 12px;">&copy; 2025 PetsQr. Todos los derechos reservados.</p>
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



export const recoverPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "El campo de correo electrónico es obligatorio" });

  try {
    const usuario = await UserModel.findOne({ email });
    if (!usuario) return res.status(404).json({ message: "El correo electrónico no está registrado" });

    const resetToken = crypto.randomBytes(32).toString('hex');
    usuario.resetToken = resetToken;
    usuario.resetTokenExpiration = Date.now() + 3600000; // 1 hora de expiración
    await usuario.save();

    // El link ahora usa la ruta /reset/:token
    const resetLink = `${Render}/api/v1/registro/reset/${resetToken}`;

    const mailOptions = {
      from: emailUser,
      to: email,
      subject: "Recuperación de contraseña",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #007bff; text-align: center; margin-bottom: 20px;">Recuperación de Contraseña</h2>
        <p style="color: #333; font-size: 16px; line-height: 1.5;">
          Hola, 
        </p>
        <p style="color: #333; font-size: 16px; line-height: 1.5;">
          Hemos recibido una solicitud para restablecer tu contraseña. Si no realizaste esta solicitud, puedes ignorar este correo.
        </p>
        <p style="color: #333; font-size: 16px; line-height: 1.5;">
          Para restablecer tu contraseña, haz clic en el siguiente botón:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" style="text-decoration: none; background-color: #007bff; color: white; padding: 10px 20px; border-radius: 5px; font-size: 16px; display: inline-block;">Restablecer mi contraseña</a>
        </div>
       
       
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
          Este enlace es válido solo por 24 horas.
        </p>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 10px;">
          Gracias,<br>El equipo de soporte de PetsQr.
        </p>
      </div>
      `,
    };
    

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).json({ message: "Error al enviar el correo" });
      res.status(200).json({ message: "Correo enviado exitosamente" });
    });
  } catch (error) {
    res.status(500).json({ message: "Error al procesar la solicitud", error });
  }
};

// Nuevo middleware para verificar token antes de mostrar el formulario
export const showResetForm = async (req, res) => {
  const { token } = req.params;
  
  try {
    const usuario = await UserModel.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    });

    if (!usuario) {
      return res.send(`
        <html>
          <head>
            <title>Error</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
              .error { color: red; }
            </style>
          </head>
          <body>
            <h1 class="error">Token inválido o expirado</h1>
            <p>Por favor, solicite un nuevo enlace de recuperación de contraseña.</p>
          </body>
        </html>
      `);
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Restablecer Contraseña</title>
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
            rel="stylesheet"
          />
          <style>
            body {
              min-height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #f5f5f5;
            }
            .card {
              max-width: 400px;
              width: 100%;
            }
          </style>
        </head>
        <body>
          <div class="card shadow-lg border-0">
            <div class="card-body">
              <h1 class="h4 text-center text-gray-900 mb-4 fw-bold">Restablecer Contraseña</h1>
              <form id="resetPasswordForm" action="/api/v1/registro/reset/${token}" method="POST">
                <div class="mb-3">
                  <input
                    type="password"
                    name="newPassword"
                    class="form-control"
                    placeholder="Nueva contraseña"
                    required
                  />
                </div>
                <div class="mb-3">
                  <input
                    type="password"
                    name="confirmPassword"
                    class="form-control"
                    placeholder="Confirmar contraseña"
                    required
                  />
                </div>
                <button type="submit" class="btn btn-warning w-100">
                  Cambiar Contraseña
                </button>
              </form>
              <div id="error" class="text-danger mt-3 text-center"></div>
            </div>
          </div>
          <script>
            const form = document.getElementById('resetPasswordForm');
            const error = document.getElementById('error');
      
            form.addEventListener('submit', async (e) => {
              e.preventDefault();
              const newPassword = form.newPassword.value;
              const confirmPassword = form.confirmPassword.value;
      
              if (newPassword !== confirmPassword) {
                error.textContent = 'Las contraseñas no coinciden';
                return;
              }
      
              try {
                const response = await fetch(form.action, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ newPassword }),
                });
      
                const data = await response.json();
      
                if (response.ok) {
                  alert('Contraseña actualizada exitosamente');
                  window.location.href = 'https://petsqr.netlify.app/login';
                } else {
                  error.textContent = data.message || 'Error al actualizar la contraseña';
                }
              } catch (err) {
                error.textContent = 'Error al procesar la solicitud';
              }
            });
          </script>
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          ></script>
        </body>
      </html>
      `);
      
      
  } catch (error) {
    res.status(500).send('Error al procesar la solicitud');
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) return res.status(400).json({ message: "La nueva contraseña es obligatoria" });

  try {
    const usuario = await UserModel.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!usuario) return res.status(400).json({ message: "Token inválido o expirado" });

    usuario.password = bcrypt.hashSync(newPassword, 10);
    usuario.resetToken = undefined;
    usuario.resetTokenExpiration = undefined;
    await usuario.save();

    res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al restablecer la contraseña", error });
  }
};
