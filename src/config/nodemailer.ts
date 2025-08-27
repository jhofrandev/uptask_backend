// Looking to send emails in production? Check out our Email API/SMTP product!
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const config = () => {
  return {
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };
};

export const transport = nodemailer.createTransport(config());
