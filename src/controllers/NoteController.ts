import { Request, Response } from "express";
import { INote } from "../models/Note";

export class NoteController {
  static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
    const { content } = req.body;
  };
}
