export const toObject = (objThis: any): any => {
  if (typeof objThis === 'string') {
    return objThis;
  }

  const obj = { ...objThis };
  Object.keys(obj).map((key) => {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  });

  return obj;
};
