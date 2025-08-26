import User from "../models/User";
import type { Request, Response } from "express";
import { hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import Token from "../models/Token";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      // prevenir duplicados
      const userExists = await User.findOne({ email });
      if (userExists) {
        const error = new Error("El usaurio ya existe");
        return res.status(409).json({ error: error.message });
      }

      // Crea un usuario
      const user = new User(req.body);

      // Hashea el password
      user.password = await hashPassword(password);

      // Generar un token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // Guardar el usuario
      await Promise.all([user.save(), token.save()]);
      res.status(201).send("Cuenta creada, revisa tu emaail para activarla");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
