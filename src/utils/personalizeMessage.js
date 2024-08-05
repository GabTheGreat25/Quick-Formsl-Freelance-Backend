export const personalizeMessage = (template, variables) => {
  return template.replace(/\[(\w+)\]/g, (_, key) => variables[key] || "");
};
