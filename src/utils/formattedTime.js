export const getFormattedTime = () => {
  const today = new Date();
  let hours = today.getHours();
  const minutes = String(today.getMinutes()).padStart(2, "0");
  const seconds = String(today.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = String(hours).padStart(2, "0");

  return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
};
