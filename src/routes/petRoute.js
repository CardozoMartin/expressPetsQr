import express from 'express';

import {
  deletePet,
  getPetById,
  getPets,
  postPet,
  putPet,
} from '../controllers/petController.js';
import { petValidateBody } from '../middlewares/petValidateBody.js';
import { postPetSchema } from '../helpers/validationSchemas/petSchemaValidation.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { upload } from '../database/multer.js';
const router = express.Router();

router.get('/', getPets);
router.get('/:id', getPetById);

router.post(
  '/',
  (res, req, next) => petValidateBody(req, res, next, postPetSchema),
  upload.fields([{ name: 'image', maxCount: 1 }]),
  postPet,
);
router.put('/:id', putPet);
router.delete('/:id', isAuthenticated, deletePet);

export default router;
