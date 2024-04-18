import { Request, Response } from 'express';
declare const createTaskByUser: (req: Request, res: Response) => Promise<void>;
declare const getSingleTask: (req: any, res: Response) => Promise<void>;
declare const getListTasks: (req: any, res: Response) => Promise<void>;
declare const updateTaskByUser: (req: Request, res: Response) => Promise<void>;
declare const updateTaskByAdmin: (req: Request, res: Response) => Promise<void>;
declare const deleteTask: (req: Request, res: Response) => Promise<void>;
export { createTaskByUser, getSingleTask, getListTasks, updateTaskByUser, updateTaskByAdmin, deleteTask };
