'use strict';

export default {
  'Course Type': {
    doc_count_error_upper_bound: 0,
    sum_other_doc_count: 0,
    buckets: [
      {
        key: 'test bucket 1',
        doc_count: 30,
      },
      {
        key: 'test bucket 2',
        doc_count: 20,
      },
    ],
    field_name: 'Course.CourseType',
  },
  Provider: {
    doc_count_error_upper_bound: 0,
    sum_other_doc_count: 0,
    buckets: [
      {
        key: 'JKO',
        doc_count: 28,
      },
    ],
    field_name: 'Course.CourseProviderName',
  },
};
