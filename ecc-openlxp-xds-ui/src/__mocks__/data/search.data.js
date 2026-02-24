'use strict';

import aggregationsData from './aggregations.data';
import courseData from './course.data';
export default {
  hits: [courseData],
  total: 1,
  aggregations: [aggregationsData],
};
