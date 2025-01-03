
import Comet from "../models/comentSchema.js"
import { uploadFile } from '../helpers/upload.js';


export const getComent = async (_, res) => {
    try {
        const data = await Comet.find({});
        const filterData = data.map((coment) => ({
            id: coment._id,  // No es necesario usar _doc._id
            name: coment.name,  // Acceso directo al campo
            surname: coment.surname,  // Acceso directo al campo
            comments: coment.comments,
            image: coment.image,
            userID: coment.userID,
        }));
        res.json({ data: filterData, message: 'Comentarios encontrados' });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            data: null,
            message: 'Ocurrió un error',
        });
    }
};


export const postComment = async (req, res) => {
    const body = req.body;
    const imagen = req.files?.image; // Usamos el operador de encadenamiento opcional en caso de que no se envíe una imagen

    let imageURL = null; // Inicializamos como null

    // Si se envía una imagen, la subimos
    if (imagen && imagen.length > 0) {
        const { downloadURL } = await uploadFile(imagen[0]);
        imageURL = downloadURL; // Asignamos la URL de la imagen subida
    }

    // Creamos el comentario, independientemente de si hay imagen o no
    const newComments = new Comet({
        name: body.name,
        surname:body.surname,
        comments: body.comments,
        image: imageURL, // Si no hay imagen, la propiedad será null
        userID: body.userID,
        isActive: true,
    });

    try {
        await newComments.save();
        res.status(201).json({
            data: null,
            message: 'Registro exitoso',
        });
    } catch (e) {
        if (e.message.includes('duplicate')) {
            res.status(400).json({
                data: null,
                message: 'El email ya se encuentra registrado',
            });
            return;
        }
        res.status(500).json({
            data: null,
            message: 'Ocurrió un error al guardar el comentario',
        });
    }
};
