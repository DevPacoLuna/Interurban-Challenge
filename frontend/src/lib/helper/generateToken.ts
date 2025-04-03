export const generateToken = (str: string): string => {
  return str
    .split("")
    .map((char) => char.charCodeAt(0).toString(36))
    .join("");
};
