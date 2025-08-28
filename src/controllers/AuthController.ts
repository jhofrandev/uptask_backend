import User from "../models/User";
import type { Request, Response } from "express";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import Token from "../models/Token";
import { AuthEmail } from "../emails/AuthEmail";

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

      // Enviando email de confirmación
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      // Guardar el usuario
      await Promise.all([user.save(), token.save()]);
      res.status(201).send("Cuenta creada, revisa tu emaail para activarla");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        const error = new Error("Token no valido");
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findById(tokenExists.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
      res.send("Cuanta confirmada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("Usuario no existe");
        return res.status(404).json({ error: error.message });
      }

      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();
        await token.save();

        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          "Tu cuenta no ha sido confirmada, te hemos reeviado un nuevo email"
        );
        return res.status(401).json({ error: error.message });
      }

      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("Password incorrecto");
        return res.status(401).json({ error: error.message });
      }

      res.send("Login correcto");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
