import express from 'express';
import { verifyToken } from '../controllers/tokenController.js';

const router = express.Router();


router.get("/:token", verifyToken );


export default router;
