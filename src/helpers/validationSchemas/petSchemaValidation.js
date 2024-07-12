import Joi from 'joi';

export const postPetSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z0-9-_ ]+$/),
  tipo: Joi.string()
    .required()
    .valid('Perro', 'Gato', 'Conejo', 'Hamster', 'Caballo'),
  raza: Joi.string().optional().min(2).max(50),
  direccion: Joi.string().required().min(2).max(100),
  numberphone: Joi.string().required().min(7).max(15),
  content: Joi.string().optional().max(500),
  
  userID: Joi.string().required(),
  isActive: Joi.boolean().optional()
});
