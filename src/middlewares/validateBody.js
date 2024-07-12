import { postUserSchema } from '../helpers/validationSchemas/userSchemaValidation.js';

export const validateBody = (req, res, next,schema) => {
  const { body } = req;

  const { error } = schema.validate(body);

  if (error) {
    res.status(400).json({
      data: null,
      message: error.details[0].message,
    });
    return;
  }
  next();
};
