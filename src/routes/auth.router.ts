import { Router } from 'express';
import { wrapAsync } from '../utils/wrapAsync';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const controller = new AuthController();

router.post('/registro', wrapAsync((req, res) => controller.register(req, res)));
router.post('/login', wrapAsync((req, res) => controller.login(req, res)));

export default router;
