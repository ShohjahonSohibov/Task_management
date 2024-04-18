"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = exports.TaskStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["Start"] = "start";
    TaskStatus["Completed"] = "completed";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
const taskSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        required: true,
        enum: TaskStatus,
    },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: false }, // Reference to User model
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
}, { timestamps: true } // Enable automatic timestamps
);
// Optional validation (if needed)
// taskSchema.pre('save', function (next) {
//   // Add validation logic here
//   next();
// });
const Task = mongoose_1.default.model('Task', taskSchema);
exports.Task = Task;
//# sourceMappingURL=task.js.map