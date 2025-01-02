import express from 'express';
import { postUser, getUsers, putUser, deleteUser, recoverPassword, resetPassword,showResetForm  } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/', postUser);
router.post('/recovery', recoverPassword);
router.get('/reset/:token', showResetForm);  // Nueva ruta para mostrar el formulario
router.post('/reset/:token', resetPassword);
router.put('/:id', putUser);
router.delete('/:id', deleteUser);

export default router;
