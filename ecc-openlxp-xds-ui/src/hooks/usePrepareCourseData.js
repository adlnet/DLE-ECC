'use strict';

// given config and data prepare the data for display

import { backendHost } from '@/config/endpoints';
import { getDeeplyNestedData } from '@/utils/getDeeplyNestedData';

export default function PrepareCourseData(config, data) {
  let preparedData = null;
  const { course_highlights, course_information, course_img_fallback } = config;
  preparedData = {
    courseTitle: getDeeplyNestedData(course_information.course_title, data),
    courseDescription: getDeeplyNestedData(
      course_information.course_description,
      data
    ),
    courseUrl: getDeeplyNestedData(course_information.course_url, data),
    courseDetails: course_highlights
      .filter((detail) => detail.active)
      .map((detail) => ({
        displayName: detail.display_name,
        value: getDeeplyNestedData(detail.field_name, data),
      })),
    coursePhoto:
      getDeeplyNestedData('Technical_Information.Thumbnail', data) ||
      (course_img_fallback && `${backendHost}${course_img_fallback}`),
  };
  return preparedData;
}
