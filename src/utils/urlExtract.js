export const urlExtract = (url) => {
  const match = url.match(/([0-9a-fA-F]{24})/);
  return match ? match[1] : null;
};
