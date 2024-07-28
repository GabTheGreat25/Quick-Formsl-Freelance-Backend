import { transporter } from "../config/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";
import { ENV } from "../config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mail = path.join(__dirname, "../views/customer.html");
const content = fs.readFileSync(mail, "utf8");

const template = handlebars.compile(content);

export const sendCustomerEmail = (email, customerName, result) => {
  const replacement = {
    customerName: customerName,
    result,
  };
  
  const index = template(replacement);

  return transporter.sendMail({
    from: ENV.EMAIL,
    to: `${email}`,
    subject: "Quick Form Copy Notification",
    html: index,
  });
};
