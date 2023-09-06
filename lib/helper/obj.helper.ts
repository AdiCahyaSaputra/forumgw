export const excludeField = <O extends object, F extends keyof O>(
  object: O,
  field: F,
): Omit<O, F> => {
  const newObject = { ...object };

  if (field in newObject) {
    delete newObject[field];
  }

  return newObject;
};
