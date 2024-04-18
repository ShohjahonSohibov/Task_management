"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const task_1 = require("../controller/task");
// Task Routes with rate limiting
router.post('/', task_1.createTaskByUser); // Create a task
router.get('/:taskID', task_1.getSingleTask); // Get a single task
router.get('/', task_1.getListTasks); // Get list of tasks (filtered/paginated)
router.put('/:taskID', task_1.updateTaskByUser); // Update a task by user
router.put('/admin/:taskID', task_1.updateTaskByAdmin); // Update a task by admin
router.delete('/:taskID', task_1.deleteTask); // Delete a task
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map