"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 3 * 60 * 1000, // 3 minutes window
    max: 5, // Limit to 5 requests per window
    message: { message: 'Too many login attempts. Please try again later.' },
});
exports.default = limiter;
//# sourceMappingURL=limiter.js.map