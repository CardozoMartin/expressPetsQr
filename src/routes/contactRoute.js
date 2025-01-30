// contactRoute.js
import express from 'express';
import nodemailer from 'nodemailer';



const router = express.Router();

// Configure nodemailer with more secure options
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    secure: true, // use TLS
    tls: {
        rejectUnauthorized: false // only for development
    }
});

// Validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                error: 'Todos los campos son requeridos' 
            });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ 
                error: 'Formato de email inválido' 
            });
        }

        // Email options with sanitized input
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'petsqrsoporte@gmail.com',
            subject: `PetsQR - Nuevo mensaje de contacto: ${subject.slice(0, 100)}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Nuevo Mensaje de Contacto - PetsQR</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: Arial, sans-serif;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background-color: #4f46e5; padding: 30px 40px; text-align: center;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🐾 PetsQR</h1>
                                <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Nuevo Mensaje de Contacto</p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="padding-bottom: 20px;">
                                            <h2 style="margin: 0; color: #1f2937; font-size: 20px;">Detalles del Mensaje</h2>
                                        </td>
                                    </tr>
                                    
                                    <!-- Name -->
                                    <tr>
                                        <td style="padding: 15px; background-color: #f8fafc; border-radius: 6px; margin-bottom: 10px;">
                                            <p style="margin: 0; color: #64748b; font-size: 14px;">Nombre</p>
                                            <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 16px;">${name}</p>
                                        </td>
                                    </tr>
                                    
                                    <!-- Email -->
                                    <tr>
                                        <td style="padding: 15px; background-color: #f8fafc; border-radius: 6px; margin-top: 10px;">
                                            <p style="margin: 0; color: #64748b; font-size: 14px;">Email</p>
                                            <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 16px;">${email}</p>
                                        </td>
                                    </tr>
                                    
                                    <!-- Subject -->
                                    <tr>
                                        <td style="padding: 15px; background-color: #f8fafc; border-radius: 6px; margin-top: 10px;">
                                            <p style="margin: 0; color: #64748b; font-size: 14px;">Asunto</p>
                                            <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 16px;">${subject}</p>
                                        </td>
                                    </tr>
                                    
                                    <!-- Message -->
                                    <tr>
                                        <td style="padding: 15px; background-color: #f8fafc; border-radius: 6px; margin-top: 10px;">
                                            <p style="margin: 0; color: #64748b; font-size: 14px;">Mensaje</p>
                                            <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 16px; white-space: pre-wrap; line-height: 1.5;">${message}</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                                <p style="margin: 0; color: #64748b; font-size: 14px;">Este mensaje fue enviado desde el formulario de contacto de PetsQR</p>
                                <p style="margin: 10px 0 0 0; color: #64748b; font-size: 14px;">© ${new Date().getFullYear()} PetsQR. Todos los derechos reservados.</p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Send success response
        res.status(200).json({ 
            success: true,
            message: 'Mensaje enviado exitosamente' 
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al enviar el mensaje',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;