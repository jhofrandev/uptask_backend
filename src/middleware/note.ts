import type { Request, Response, NextFunction } from "express";
import Note, { INote } from "../models/Note";

declare global {
  namespace Express {
    interface Request {
      note: INote;
    }
  }
}

export async function noteExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      const error = new Error("Nota no encontrada");
      return res.status(404).json({ error: error.message });
    }

    req.note = note;
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function noteCreatedByUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.note.createdBy.toString() !== req.user.id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ error: error.message });
  }
  next();
}
