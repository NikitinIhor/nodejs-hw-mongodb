import 'dotenv/config';
import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_PASSWORD, SMTP_FROM, SMTP_USER } =
  process.env;

const nodemailerConfig = {
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = async options => {
  const email = { ...options, from: SMTP_FROM };

  return await transport.sendMail(email);
};
