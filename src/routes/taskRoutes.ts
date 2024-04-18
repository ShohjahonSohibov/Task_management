import express from 'express';
const router = express.Router();

import {
  createTaskByUser,
  getSingleTask,
  getListTasks,
  updateTaskByUser,
  updateTaskByAdmin,
  deleteTask,
} from "../controller/task";

// Task Routes with rate limiting
router.post('/', createTaskByUser); // Create a task
router.get('/:taskID', getSingleTask); // Get a single task
router.get('/', getListTasks); // Get list of tasks (filtered/paginated)
router.put('/:taskID', updateTaskByUser); // Update a task by user
router.put('/admin/:taskID', updateTaskByAdmin); // Update a task by admin
router.delete('/:taskID', deleteTask); // Delete a task

export default router;
