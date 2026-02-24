'use strict';

const { getDeeplyNestedData } = require('@/utils/getDeeplyNestedData');

const testData = { Course: { CourseTitle: 'value' } };

it('should return the value based on the string', () => {
  const result = getDeeplyNestedData('Course.CourseTitle', testData);
  expect(result).toBe(testData.Course.CourseTitle);
});
it('should return undefined if key is not found', () => {
  const result = getDeeplyNestedData('Course.CourseNotHere', testData);
  expect(result).toBeUndefined();
});
it('should return null if initial key is not found', () => {
  const result = getDeeplyNestedData('', testData);
  expect(result).toBeNull();
});
