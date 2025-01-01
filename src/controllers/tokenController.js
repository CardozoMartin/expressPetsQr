import path from 'path';
import { fileURLToPath } from 'url';
import UserModel from '../models/userSchema.js';

// Simular __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyToken = async (req, res) => {
    const { token } = req.params;

    try {
        // Buscar al usuario usando el token de verificación
        const usuario = await UserModel.findOne({ verificationToken: token });

        if (!usuario) {
            return res.status(404).sendFile(path.join(__dirname, '../public', 'error.html')); 
            // Página de error si el usuario no es encontrado
        }

        // Si el usuario existe, verificamos el token
        usuario.isVerified = true;
        usuario.verificationToken = null;
        await usuario.save();

        // Enviar página de éxito
        res.sendFile(path.join(__dirname, '../public', 'verify.html')); 

    } catch (error) {
        console.error("Error al verificar el correo:", error);
        res.status(500).sendFile(path.join(__dirname, '../public', 'error.html')); 
        // Página de error genérica en caso de problemas con la base de datos
    }
};
