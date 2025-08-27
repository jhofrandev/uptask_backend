import { transport } from "../config/nodemailer";

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    await transport.sendMail({
      from: "Uptask <admin@uptask.com>",
      to: user.email,
      subject: "Uptask - Confirma tu cuenta",
      text: "Uptask - Confirma tu cuenta",
      html: `
        <p>Hola: ${user.name}, has creatu tu cuenta en UpTask, ya casi esta todo listo, solo debes confirmar tu cuenta</p>

        <p>Visita el sigueite enlace: </p><a href="">Confirmar cuenta</a>

        <p>Debe de ingresar el sigueinte código: <b>${user.token}</b></p>

        <p>El token expira en 10 minutos</p>
      `,
    });
  };
}
