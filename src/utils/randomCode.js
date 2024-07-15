import { STATUSCODE } from "../constants/index.js";

export const generateRandomCode = () => {
  const length = STATUSCODE.SIX;

  let code = "";

  for (let i = STATUSCODE.ZERO; i < length; i++)
    code += Math.floor(Math.random() * STATUSCODE.TEN);

  return code;
};
