'use strict';

const CourseHeader = (props) => {
  return (
    <tr>
      <th
        scope="col"
        className="px-6 py-3 text-left text-gray-600 uppercase tracking-wider">
        <div className="text-sm">Title</div>
        <div className="text-xs font-thin">Course Code</div>
      </th>

      {/* <th
        scope="col"
        className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
        Course Status
      </th> */}

      <th
        scope="col"
        className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
        View Course
      </th>
    </tr>
  );
};
export default CourseHeader;
