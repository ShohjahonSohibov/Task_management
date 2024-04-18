import express from 'express'
const router = express.Router();

import { register, login } from "../controller/auth";
import limiter from "../util/limiter";

router.post('/register', limiter, register)
router.post('/login', limiter, login)

export default router;