'use strict';

/**
 * UPDATE DEEPLY NESTED JSON
 * @param {object} dataToBeUpdated - The data that will be updated
 * @param {array} arrayOfKeys - a series of keys to iterate over
 * @param {any} valueToUpdate - the value that will replace the existing one
 */

export function updateDeeplyNestedJson(
  dataToBeUpdated = undefined,
  arrayOfKeys = undefined,
  valueToUpdate = undefined
) {
  // If no keys are provided
  if (!arrayOfKeys) {
    return;
  }
  if (!dataToBeUpdated) {
    return valueToUpdate;
  }

  // Copy the list of keys
  const keys = [...arrayOfKeys];

  // Get the first key in the array
  const currentKey = keys.shift();

  // If there are no more keys return the value
  if (!currentKey) return valueToUpdate;

  // Update the key with the returned value
  dataToBeUpdated[currentKey] = updateDeeplyNestedJson(
    dataToBeUpdated[currentKey],
    keys,
    valueToUpdate
  );
  return dataToBeUpdated;
}

export function flattenObjectToArray(dataToFlatten, output = {}) {
  // If there is no more data to flatten
  if (!dataToFlatten) return;

  // List of keys to iterate over
  const keys = Object.keys(dataToFlatten);

  keys.forEach((key) => {
    const currentData = dataToFlatten[key];

    // If the key is undefined
    if (!currentData) output[key] = "";

    // If the value is not an object.
    if (typeof currentData !== "object") {
      output[key] = currentData;
      return;
    }

    // Go to the next layer
    flattenObjectToArray(currentData, output);
  });

  return output;
}
