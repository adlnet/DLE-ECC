// Functions to render data
export const getDeeplyNestedData = (strKey, data) => {
  if (!strKey) return null;

  // gets the keys for the data mapping
  const objKeys = strKey.split('.');

  // inits with all the data
  let valueToReturn = data;

  // Reduces it down to the specific value
  objKeys.forEach((key) => {
    if (valueToReturn) {
      valueToReturn = valueToReturn[key];
    }
  });

  // Returning the desired value.
  return valueToReturn;
};
