"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTaskByAdmin = exports.updateTaskByUser = exports.getListTasks = exports.getSingleTask = exports.createTaskByUser = void 0;
const task_1 = require("../models/task");
// Function to create a task by user
const createTaskByUser = async (req, res) => {
    try {
        const newTask = await task_1.Task.create(req.body);
        res.status(201).json(newTask);
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            res.status(400).json({ message: 'Validation failed:', errors: validationErrors });
        }
        else {
            console.error('Error creating task:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
exports.createTaskByUser = createTaskByUser;
// Function to get a single task
const getSingleTask = async (req, res) => {
    try {
        const { taskID } = req.params;
        const { isAdmin = false } = req.query;
        const userID = req.user.userId; // ID is obtained from authentication middleware
        let query = {};
        query['_id'] = taskID;
        if (!Boolean(isAdmin)) {
            query['user'] = userID;
        }
        const task = await task_1.Task.findOne(query);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.status(200).json(task);
    }
    catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getSingleTask = getSingleTask;
// Function to get list tasks
const getListTasks = async (req, res) => {
    try {
        const userID = req.user.userId; // ID is obtained from authentication middleware
        const { page = 1, limit = 10, sort, isAdmin, status } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        let sortOption = { created_at: 1 }; // Define sortOption type explicitly
        let options = {};
        const aggregationPipeline = [];
        let taskStats = [];
        if (sort === 'new') {
            sortOption = { created_at: -1 }; // Sort by created_at in descending order (latest first)
        }
        if (!Boolean(isAdmin)) {
            options["user"] = userID;
            // Add aggregation pipeline stages for task counts per user and completion averages
            aggregationPipeline.push({
                $group: {
                    _id: '$user',
                    totalTasks: { $sum: 1 },
                    avgCompletion: { $avg: '$completion' }
                }
            });
            // Execute aggregation pipeline
            taskStats = await task_1.Task.aggregate(aggregationPipeline);
            // Pagination using aggregation framework
            aggregationPipeline.push({ $sort: sortOption });
            aggregationPipeline.push({ $skip: skip });
            aggregationPipeline.push({ $limit: Number(limit) });
        }
        if (status) {
            options["status"] = status;
        }
        const tasks = await task_1.Task.find(options)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));
        res.status(200).json({ tasks, taskStats });
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getListTasks = getListTasks;
// Function to update a task
const updateTaskByUser = async (req, res) => {
    try {
        const { taskID } = req.params;
        const updatedTaskData = req.body;
        // Check for user field in update data
        if (updatedTaskData.user) {
            throw new Error('User field cannot be updated');
        }
        const updatedTask = await task_1.Task.findOneAndUpdate({ _id: taskID }, { $set: updatedTaskData, $unset: { user: 1 } }, { new: true, runValidators: true });
        if (!updatedTask) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.status(200).json(updatedTask);
    }
    catch (error) {
        if (error.name === 'ValidationError') { // Handle validation errors if applicable
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            res.status(400).json({ message: 'Validation failed:', errors: validationErrors });
        }
        else {
            console.error('Error updating task:', error);
            res.status(400).json({ message: 'User field cannot be updated' });
        }
    }
};
exports.updateTaskByUser = updateTaskByUser;
// Function to update a task
const updateTaskByAdmin = async (req, res) => {
    try {
        const { taskID } = req.params;
        const updatedTaskData = req.body;
        const updatedTask = await task_1.Task.findOneAndUpdate({ _id: taskID }, updatedTaskData, { new: true, runValidators: true });
        if (!updatedTask) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.status(200).json(updatedTask);
    }
    catch (error) {
        if (error.name === 'ValidationError') { // Handle validation errors if applicable
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            res.status(400).json({ message: 'Validation failed:', errors: validationErrors });
        }
        else {
            console.error('Error updating task:', error);
            res.status(400).json({ message: 'User field cannot be updated' });
        }
    }
};
exports.updateTaskByAdmin = updateTaskByAdmin;
// Function to delete a task
const deleteTask = async (req, res) => {
    try {
        const { taskID } = req.params;
        const deletedTask = await task_1.Task.findOneAndDelete({ _id: taskID });
        if (!deletedTask) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.status(204).end();
    }
    catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteTask = deleteTask;
//# sourceMappingURL=task.js.map