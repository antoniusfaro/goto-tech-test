const deepCopy = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

export {
  deepCopy
};