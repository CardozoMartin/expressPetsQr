import express from 'express';
import { getComent, postComment } from "../controllers/comentController.js";
import { upload } from '../database/multer.js';

const router = express.Router();

router.get('/', getComent);
router.post('/',upload.fields([{ name: 'image', maxCount: 1 }]), postComment);

export default router;