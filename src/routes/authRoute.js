import express from 'express';
import { postLogin } from '../controllers/authControllers.js';

const router = express.Router();

router.post('/login', postLogin);
export default router;
