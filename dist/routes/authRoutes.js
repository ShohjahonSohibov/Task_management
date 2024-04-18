"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../controller/auth");
const limiter_1 = __importDefault(require("../util/limiter"));
router.post('/register', limiter_1.default, auth_1.register);
router.post('/login', limiter_1.default, auth_1.login);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map