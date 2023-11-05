 const isAlphaNumeric = (str: string): boolean => {
  const regExp = /^[a-zA-Z0-9\s]*$/;
  return regExp.test(str);
}

export {
  isAlphaNumeric
};
