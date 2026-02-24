'use strict';

import courseData from '@/__mocks__/data/course.data';
import prepareListDataToSend from '@/utils/prepListDataToSend';
const listData = {
  name: 'list name',
  description: 'list description',
  experiences: [courseData],
};
describe('Prepare List Data To Send', () => {
  it('should maintain the name of the list', () => {
    expect(prepareListDataToSend(listData).name).toBe('list name');
  });
  it('should maintain the description of the list', () => {
    expect(prepareListDataToSend(listData).description).toBe(
      'list description'
    );
  });
  describe('experiences', () => {
    describe('with data', () => {
      it("should convert list of courses into array of id's", () => {
        expect(prepareListDataToSend(listData).experiences.length).toBe(1);
        expect(prepareListDataToSend(listData).experiences[0]).toBe(
          courseData.meta.id
        );
      });
    });
    describe('without data', () => {
      it('should return an empty array', () => {
        const modified = { ...listData, experiences: [] };
        expect(prepareListDataToSend(modified).experiences).toEqual([]);
      });
    });
  });
});
