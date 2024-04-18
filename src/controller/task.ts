import { Request, Response } from 'express';
import { Task, TaskDocument } from '../models/task';
import { SortOrder } from 'mongoose';

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

// Function to get list tasks by user
const getListTasks = async (req: any, res: Response): Promise<void> => {
    try {
        let options: { [key: string]: String } = {}
        const userID = req.user.userId; // ID is obtained from authentication middleware
        const { page = 1, limit = 10, sort, isAdmin, status } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        let sortOption: { [key: string]: SortOrder } = { created_at: 1 }; // Define sortOption type explicitly
        
        if (sort === 'new') {
            sortOption = { created_at: -1 }; // Sort by created_at in ascending order (latest first)
        }

        if (!Boolean(isAdmin)) {
            options["user"] = userID;
          }
          
        if (status) { 
            options["status"] = status
        }
        const tasks: TaskDocument[] = await Task.find(options)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json(tasks);
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