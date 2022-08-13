import nodemailer from "nodemailer";

import * as Interfaces from "@interfaces";

/**
 * @description Sends an email with the
 * specified data.
 */
const sendMail: Interfaces.Mail.MailOptions = async (email, html, subject) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    to: email,
    from: `"${process.env.NAME}" <${process.env.MAIL_ID}>`,
    subject,
    html,
  });
};

export { sendMail };
