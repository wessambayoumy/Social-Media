import nodemailer from "nodemailer";
import { env ,cacheService} from "@services";
import { HashService } from "@security";
import { ConflictError } from "@response";
import EventEmitter from "node:events";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: env.emailUser,
    pass: env.emailPass,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text: string,
) => {
  await transporter.sendMail({
    from: env.emailUser,
    to,
    subject,
    html,
    text,
  });
};

const event = new EventEmitter();

event.on(
  "verifyEmail",
  async (
    otpName: string,
    email: string,
    options: {
      ex?: number;
      text?: string;
    } = {},
  ) => {
    const { ex = 5, text = `this code will expire in ${ex} minutes` } = options;

    if (await cacheService.exists(otpName))
      throw new ConflictError("otp name taken");
    const otp = Math.ceil(Math.random() * 1000000)
      .toString()
      .padEnd(6, Math.ceil(Math.random() * 10).toString());

    await sendEmail(
      email,
      `Your Verification Code`,
      `<h3>Your OTP code is: ${otp}</h3>`,
      text,
    );
    await cacheService.set({
      key: otpName,
      value: await HashService.hash(otp),
      options: {
        expiration: { type: "EX", value: ex * 60 },
      },
    });
  },
);
