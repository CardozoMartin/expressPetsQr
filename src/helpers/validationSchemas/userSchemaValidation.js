import Joi from 'joi';

export const postUserSchema = Joi.object({
  firstname: Joi.string()
    .trim() // Elimina espacios en blanco al inicio y al final
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.empty': 'El nombre es obligatorio',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no debe tener más de 50 caracteres',
      'any.required': 'El campo nombre es requerido',
    }),
  // eslint-disable-next-line newline-per-chained-call
  lastname: Joi.string().trim().min(3).max(50).required().messages({
    'string.empty': 'El apellido es obligatorio',
    'string.min': 'El apellido debe tener al menos 3 caracteres',
    'string.max': 'El apellido no debe tener más de 50 caracteres',
    'any.required': 'El campo apellido es requerido',
  }),
  email: Joi.string()
    .trim()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }) // Valida formato de email
    .lowercase()
    .required()
    .messages({
      'string.empty': 'El correo electrónico es obligatorio',
      'string.email': 'Ingrese un correo electrónico válido',
      'any.required': 'El campo email es requerido',
    }),
  direccion: Joi.string()
    .trim()
    .max(255) // Limite razonable para la longitud de la dirección
    .required()
    .messages({
      'string.empty': 'La dirección es obligatoria',
      'string.max': 'La dirección no debe tener más de 255 caracteres',
      'any.required': 'El campo direccion es requerido',
    }),
  numberphone: Joi.string()
    .trim()
    .min(10) // Ajustar según los estándares regionales de números de teléfono
    .max(20) // Permitir números de teléfono internacionales (opcional)
    .pattern(/^\d+$/) // Solo permite números
    .required()
    .messages({
      'string.empty': 'El número de teléfono es obligatorio',
      'string.min': 'El número de teléfono debe tener al menos 10 caracteres',
      'string.max': 'El número de teléfono no debe tener más de 20 caracteres',
      'string.pattern': 'El número de teléfono solo debe contener números',
      'any.required': 'El campo telefono es requerido',
    }),
  password: Joi.string()
    .trim()
    .min(8) // Recomendación de longitud mínima de contraseña
    .max(64) // Límite superior razonable, ajustar según sea necesario
    .required()
    .messages({
      'string.empty': 'La contraseña es obligatoria',
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.max': 'La contraseña no debe tener más de 64 caracteres',
      'any.required': 'El campo contraseña es requerido',
    }),
});
export const putUserSchema = Joi.object({
  firstname: Joi.string()
    .trim() // Elimina espacios en blanco al inicio y al final
    .min(3)
    .max(50)
    .messages({
      'string.empty': 'El nombre es obligatorio',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no debe tener más de 50 caracteres',
      'any.required': 'El campo nombre es requerido',
    }),
  // eslint-disable-next-line newline-per-chained-call
  lastname: Joi.string().trim().min(3).max(50).messages({
    'string.empty': 'El apellido es obligatorio',
    'string.min': 'El apellido debe tener al menos 3 caracteres',
    'string.max': 'El apellido no debe tener más de 50 caracteres',
    'any.required': 'El campo apellido es requerido',
  }),
  email: Joi.string()
    .trim()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }) // Valida formato de email
    .lowercase()
    .messages({
      'string.empty': 'El correo electrónico es obligatorio',
      'string.email': 'Ingrese un correo electrónico válido',
      'any.required': 'El campo email es requerido',
    }),
  direccion: Joi.string()
    .trim()
    .max(255) // Limite razonable para la longitud de la dirección
    .messages({
      'string.empty': 'La dirección es obligatoria',
      'string.max': 'La dirección no debe tener más de 255 caracteres',
      'any.required': 'El campo direccion es requerido',
    }),
  numerphone: Joi.string()
    .trim()
    .min(10) // Ajustar según los estándares regionales de números de teléfono
    .max(20) // Permitir números de teléfono internacionales (opcional)
    .pattern(/^\d+$/) // Solo permite números
    .messages({
      'string.empty': 'El número de teléfono es obligatorio',
      'string.min': 'El número de teléfono debe tener al menos 10 caracteres',
      'string.max': 'El número de teléfono no debe tener más de 20 caracteres',
      'string.pattern': 'El número de teléfono solo debe contener números',
      'any.required': 'El campo telefono es requerido',
    }),
  password: Joi.string()
    .trim()
    .min(8) // Recomendación de longitud mínima de contraseña
    .max(64) // Límite superior razonable, ajustar según sea necesario
    .messages({
      'string.empty': 'La contraseña es obligatoria',
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.max': 'La contraseña no debe tener más de 64 caracteres',
      'any.required': 'El campo contraseña es requerido',
    }),
}).custom((value, helper) => {
  // eslint-disable-next-line object-curly-newline
  const { firstname, lastname, email, direccion, numerphone, password } = value;

  if ((!firstname, !lastname, !email, !direccion, !numerphone, !password)) {
    return helper.message('Al menos un campo debe estar presente en el body');
  }
  return true;
});
