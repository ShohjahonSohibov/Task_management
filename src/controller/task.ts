import { Request, Response } from 'express';
import { Task, TaskDocument } from '../models/task';
import mongoose, { SortOrder } from 'mongoose';

// Function to create a task by user
const createTaskByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const newTask: TaskDocument = await Task.create(req.body);
        res.status(201).json(newTask);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err: any) => err.message);
            res.status(400).json({ message: 'Validation failed:', errors: validationErrors });
        } else {
            console.error('Error creating task:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

};

// Function to get a single task
const getSingleTask = async (req: any, res: Response): Promise<void> => {
    try {
        const { taskID } = req.params;
        const { isAdmin = false } = req.query;
        const userID = req.user.userId; // ID is obtained from authentication middleware
        let query = {}
        query['_id'] = taskID

        if (!Boolean(isAdmin)) {
            query['user'] = userID
        }
        const task: TaskDocument | null = await Task.findOne(query);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.status(200).json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to get list tasks
const getListTasks = async (req: any, res: Response): Promise<void> => {
    try {
        const userID = req.user.userId; // ID is obtained from authentication middleware

        const { page = 1, limit = 10, sort, isAdmin, status } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        let sortOption: { [key: string]: SortOrder } = { created_at: 1 }; // Define sortOption type explicitly
        let options: { [key: string]: String } = {}
        const aggregationPipeline: any[] = [];
        let taskStats: any[] = []

        if (sort === 'new') {
            sortOption = { created_at: -1 }; // Sort by created_at in descending order (latest first)
        }

        if (!Boolean(isAdmin)) {
            options["user"] = userID;

            // Add aggregation pipeline stages for task counts per user and completion averages
            aggregationPipeline.push(
                {
                    $group: {
                        _id: "$user", // Group by user
                        totalTasks: { $sum: 1 }, // Count total tasks for each user
                        completedTasks: { $sum: { $cond: { if: { $eq: ["$status", "completed"] }, then: 1, else: 0 } } } // Count completed tasks for each user
                    }
                },
                {
                    $project: {
                        user: "$_id",
                        totalTasks: 1,
                        completedTasks: 1,
                        averageCompletion: {
                            $round: [
                                { $multiply: [{ $divide: ["$completedTasks", "$totalTasks"] }, 100] },
                                2 // specify the number of decimal places (2 in this case)
                            ]
                        }
                    }
                }
            );

            // Pagination using aggregation framework
            aggregationPipeline.push({ $sort: sortOption });
            aggregationPipeline.push({ $skip: skip });
            aggregationPipeline.push({ $limit: Number(limit) });

            // Execute aggregation pipeline
            taskStats = await Task.aggregate(aggregationPipeline);
        }

        if (status) {
            options["status"] = status
        }
        const tasks: TaskDocument[] = await Task.find(options)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({ tasks, taskStats });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Function to update a task
const updateTaskByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { taskID } = req.params;
        const updatedTaskData = req.body;

        // Check for user field in update data
        if (updatedTaskData.user) {
            throw new Error('User field cannot be updated');
        }

        const updatedTask: TaskDocument | null = await Task.findOneAndUpdate(
            { _id: taskID },
            { $set: updatedTaskData, $unset: { user: 1 } },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.status(200).json(updatedTask);
    } catch (error: any) {
        if (error.name === 'ValidationError') { // Handle validation errors if applicable
            const validationErrors = Object.values(error.errors).map((err: any) => err.message);
            res.status(400).json({ message: 'Validation failed:', errors: validationErrors });
        } else {
            console.error('Error updating task:', error);
            res.status(400).json({ message: 'User field cannot be updated' });
        }
    }
};


// Function to update a task
const updateTaskByAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { taskID } = req.params;
        const updatedTaskData = req.body;
        const updatedTask: TaskDocument | null = await Task.findOneAndUpdate(
            { _id: taskID },
            updatedTaskData,
            { new: true, runValidators: true }
        );
        if (!updatedTask) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.status(200).json(updatedTask);
    } catch (error: any) {
        if (error.name === 'ValidationError') { // Handle validation errors if applicable
            const validationErrors = Object.values(error.errors).map((err: any) => err.message);
            res.status(400).json({ message: 'Validation failed:', errors: validationErrors });
        } else {
            console.error('Error updating task:', error);
            res.status(400).json({ message: 'User field cannot be updated' });
        }
    }
};

// Function to delete a task
const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { taskID } = req.params;
        const deletedTask: TaskDocument | null = await Task.findOneAndDelete({ _id: taskID });
        if (!deletedTask) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export { createTaskByUser, getSingleTask, getListTasks, updateTaskByUser, updateTaskByAdmin, deleteTask };