import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static readonly createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);

    // Asignar el manager al proyecto
    project.manager = req.user.id;

    try {
      await project.save();
      res.status(201).send("Proyecto Creado Correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  static readonly getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({
        $or: [{ manager: { $in: req.user.id } }],
      });
      res.json(projects);
    } catch (error) {
      console.log(error);
    }
  };

  static readonly getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id).populate("tasks");

      if (!project) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ error: error.message });
      }

      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error("Acción no válida");
        return res.status(404).json({ error: error.message });
      }

      res.json(project);
    } catch (error) {
      console.log(error);
    }
  };

  static readonly updateProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);

      if (!project) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ error: error.message });
      }

      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error("Solo el manager puede actualizar un Proyecto");
        return res.status(404).json({ error: error.message });
      }

      project.clientName = req.body.clientName;
      project.projectName = req.body.projectName;
      project.description = req.body.description;

      await project.save();
      res.status(201).send("Proyecto Actualizado Correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  static readonly deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);

      if (!project) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ error: error.message });
      }

      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error("Solo el manager puede eliminar un Proyecto");
        return res.status(404).json({ error: error.message });
      }

      await project.deleteOne();
      res.send("Proyecto Eliminado Correctamente");
    } catch (error) {
      console.log(error);
    }
  };
}
