export const isDigitsOnly = (s: string) => /^\d*$/.test(s);              
export const isDigitsList = (s: string) => /^[\d\s,]*$/.test(s);          
export const splitDigitsList = (s: string) =>
  s.split(/[\s,]+/).map(v => v.trim()).filter(Boolean);
export const everyTokenIsNumber = (tokens: string[]) => tokens.every(t => /^\d+$/.test(t));
