import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static readonly createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);
    try {
      await project.save();
      res.status(201).send("Proyecto Creado Correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  static readonly getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({});
      res.json(projects);
    } catch (error) {
      console.log(error);
    }
  };
}
