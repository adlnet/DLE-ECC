'use strict';

import { flattenObjectToArray, updateDeeplyNestedJson } from "../../utils/utils";

describe("function flattenObject", () => {
  it("returns undefined when no data is passed", () => {
    const data = null;

    const flattenObject = flattenObjectToArray(data);
    expect(flattenObject).toBeUndefined();
  });

  it("returns a 1-D list from a 2-D list", () => {
    const data = { this: { they: "them", fe: "fi", fo: "fum" } };
    const dataToExpect = { they: "them", fe: "fi", fo: "fum" };

    const flattenedData = flattenObjectToArray(data);
    expect(flattenedData).toEqual(dataToExpect);
  });

  it("returns a singleton list when the variable is overridden.", () => {
    const data = { this: "that" };
    const dataToExpect = { this: "that" };

    const flattenedData = flattenObjectToArray(data);
    expect(flattenedData).toEqual(dataToExpect);
  });
});

describe("function updateDeeplyNestedJson", () => {
  it("returns undefined if keys are not provided", () => {
    const data = { test: 1 };
    const keys = null;
    const value = 2;

    expect(updateDeeplyNestedJson(data, keys, value)).toBeUndefined();
  });

  it("returns the value if data is not provided", () => {
    const data = null;
    const keys = ["test"];
    const value = 2;

    expect(updateDeeplyNestedJson(data, keys, value)).toEqual(2);
  });

  it("returns the value if provided an empty array", () => {
    const data = { this: 1 };
    const keys = [];
    const value = 2;

    expect(updateDeeplyNestedJson(data, keys, value)).toBe(value);
  });

  it("returns the updated data of a single layered obj", () => {
    const data = { this: "that" };
    const keys = ["this"];
    const value = "test";

    expect(updateDeeplyNestedJson(data, keys, value)).toEqual({ this: "test" });
  });

  it("returns the updated data of a deeply nested obj", () => {
    const data = { this: { nested: { data: "value" } } };
    const keys = ["this", "nested", "data"];
    const value = "updated";

    expect(updateDeeplyNestedJson(data, keys, value)).toEqual({
      this: { nested: { data: "updated" } },
    });
  });

  it("returns the updated data of consecutive updates", () => {
    const data = { this: { nested: { data: "value", thing: "value" } } };
    const keys1 = ["this", "nested", "data"];
    const value1 = "dataUpdated";
    const keys2 = ["this", "nested", "thing"];
    const value2 = "thingUpdated";

    let temp = updateDeeplyNestedJson(data, keys1, value1);
    expect(temp).toEqual({
      this: { nested: { data: "dataUpdated", thing: "value" } },
    });

    temp = updateDeeplyNestedJson(temp, keys2, value2);
    expect(temp).toEqual({
      this: { nested: { data: "dataUpdated", thing: "thingUpdated" } },
    });
  });

  it("returns the updated data obj with new key value pair", () => {
    const data = { this: { nested: { data: "value", thing: "value" } } };
    const keys = ["this", "nested", "newKey"];
    const value = "newValue";

    expect(updateDeeplyNestedJson(data, keys, value)).toEqual({
      this: { nested: { data: "value", thing: "value", newKey: "newValue" } },
    });
  });
});
