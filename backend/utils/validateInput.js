

export const isValidEmail = (email) => {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

export const isPositiveInteger = (val) => {
  return Number.isInteger(val) && val > 0;
};
