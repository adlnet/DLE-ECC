'use strict';

/**
 * @description Accepts a list object and maps the experience metadata_key_hash's into an array
 * @param {object} data - Course object
 * @returns {{name:string, description:string, experiences:[string]}}
 */

export default function prepareListDataToSend(data) {
  return {
    ...data,
    experiences: data.experiences.map(
      (course) => course.meta.metadata_key_hash
    ),
  };
}
