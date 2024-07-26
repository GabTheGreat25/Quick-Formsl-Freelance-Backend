import { transporter } from "../config/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mail = path.join(__dirname, "../views/admin.html");
const content = fs.readFileSync(mail, "utf8");

const template = handlebars.compile(content);

export const sendAdminEmail = (email, name, customer) => {
  const replacement = {
    name: name,
    customer: customer,
  };

  const index = template(replacement);

  return transporter.sendMail({
    from: process.env.EMAIL,
    to: `${email}`,
    subject: "New Form Submission Notification",
    text: "Dear Admin,\n\nWe are pleased to inform you that a new form has been successfully created.\n\nBest regards,\nYour Team",
    html: index,
  });
};
