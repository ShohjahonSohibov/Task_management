"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    name: { type: String, required: true },
    locked: { type: Boolean, required: false, default: false },
    lockedAt: { type: Date, required: false },
    loginAttempts: { type: Number, required: false, default: 0 },
    created_at: { type: Date, default: Date.now }, // Automatic timestamp
    updated_at: { type: Date, default: Date.now }, // Automatic timestamp
    is_deleted: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } } // Enable automatic timestamps
);
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
//# sourceMappingURL=user.js.map