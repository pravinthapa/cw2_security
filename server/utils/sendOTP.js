import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // <--- ignores self-signed certificate errors
  },
});

export const sendOTP = async (to, otp) => {
  const msg = {
    from: `"LifeLockr" <${process.env.MAIL_USER}>`,
    to,
    subject: "Your LifeLockr verification code",
    html: `<p>Your one‑time code is: <b>${otp}</b>. It expires in 5 minutes.</p>`,
  };
  await transporter.sendMail(msg);
};
