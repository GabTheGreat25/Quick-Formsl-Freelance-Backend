import { createTransport } from "nodemailer";
import { ENV } from "../config/index.js";
import { RESOURCE } from "../constants/index.js";

const transporter = createTransport({
  service: RESOURCE.GMAIL,
  auth: {
    user: ENV.EMAIL,
    pass: ENV.EMAIL_PASSWORD,
  },
});

export { transporter };
