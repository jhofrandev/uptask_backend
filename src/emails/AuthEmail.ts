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

        <p>Visita el sigueite enlace: </p><a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>

        <p>Debe de ingresar el sigueinte código: <b>${user.token}</b></p>

        <p>El token expira en 10 minutos</p>
      `,
    });
  };

  static sendPasswordResetToken = async (user: IEmail) => {
    await transport.sendMail({
      from: "Uptask <admin@uptask.com>",
      to: user.email,
      subject: "Uptask - Reestablece tu password",
      text: "Uptask - Reestablece tu password",
      html: `
        <p>Hola: ${user.name}, has solicitado reestablecer tu password</p>

        <p>Visita el sigueite enlace: </p>
        <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer password</a>

        <p>Debe de ingresar el sigueinte código: <b>${user.token}</b></p>

        <p>El token expira en 10 minutos</p>
      `,
    });
  };
}
