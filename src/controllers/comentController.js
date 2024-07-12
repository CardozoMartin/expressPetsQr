
import Comet from "../models/comentSchema.js"
import { uploadFile } from '../helpers/upload.js';


export const getComent = async (_, res) => {
    try {
        const data = await Comet.find({});
        const filterData = data.map((coment) => ({
            id: coment._doc._id,
            userName: coment._doc._userName,
            comments: coment._doc.comments,
            image: coment._doc.image,
            userID: coment.userID,
        }));
        res.json({ data: filterData, message: 'comentarios encontrados' });
    } catch (e) {
        res.status(500).json({
            data: null,
            message: 'Ocurrió un error',
        });
    }
};

export const postComment = async (req, res) => {

    const body = req.body;
    const imagen = req.files.image;

    if (imagen && imagen.length > 0) {
        const { downloadURL } = await uploadFile(imagen[0]);


        const newComments = new Comet({

            userName: body.userName,
            comments: body.comments,
            image: downloadURL,
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
                // eslint-disable-next-line no-useless-return
                return;
            }
        }
    }
}