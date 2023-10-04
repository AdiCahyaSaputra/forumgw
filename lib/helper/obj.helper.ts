export const excludeField = <O extends object, F extends keyof O>(
  object: O,
  fields: F[],
): Omit<O, F> => {
  const newObject = { ...object };

  for (const field of fields) {
    if (field in newObject) {
      delete newObject[field];
    }
  }

  return newObject;
};
