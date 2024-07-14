import { Schema } from "mongoose";
import users from "../model.js";
import { RESOURCE, ROLE } from "../../../../constants/index.js";

const schemaOptions = {
  discriminatorKey: RESOURCE.ROLE,
};

const customerSchema = new Schema({}, schemaOptions);

export const CustomerDiscriminator =
  users?.discriminators?.[ROLE.CUSTOMER] ||
  users.discriminator(ROLE.CUSTOMER, customerSchema);
