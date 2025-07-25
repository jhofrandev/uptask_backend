import type { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {
  static readonly createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body);
      task.project = req.project.id;
      req.project.tasks.push(task.id);
      await task.save();
      await req.project.save();
      res.status(201).send("Tarea Creada Correctamente");
    } catch (error) {
      console.log(error);
    }
  };
}
