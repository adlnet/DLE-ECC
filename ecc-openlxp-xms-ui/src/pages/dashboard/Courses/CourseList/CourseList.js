'use strict';

import { data } from "browserslist";
import { getDeeplyNestedData } from "@/utils/getDeeplyNestedData";
import { useInfoMappings } from "@/hooks/useInfoMappings";
import { useRouter } from "next/router";
import CourseListHeader from "../CourseHeader/CourseListHeader";

const CourseList = (props) => {
  const router = useRouter();
  const config = useInfoMappings();

  const courses = props.data?.experiences.results || [];

  // Creates the individual rows of the table.
  const rows = courses?.map((data, index) => {
    if (Object.keys(data).length > 0)
      return  (
      <tr key={data.metadata_key_hash}
       className='group cursor-pointer hover:shadow-lg pr-2 pl-1 py-1 rounded-md outline-none' 
       onClick={() => router.push(`/dashboard/${data.provider_name}/${data.metadata_key_hash}`)} >
        <td className="px-6 py-4 text-sm text-gray-900">
           <div className="font-medium">
            {getDeeplyNestedData(config.data?.course_title, data)}
           </div>
           <div className="font-light">
            {getDeeplyNestedData(config.data?.course_code, data)}
           </div>
         </td>

         <td className="px-6 py-4  text-center text-sm font-medium"
           aria-label={`View more about this course ${data.metadata_key_hash}`}
         > View
         </td>
      </tr>)
  });

  return (
    <table
      className="min-w-full divide-y divide-black table-auto"
      data-testid="course-table">
      <thead>
        <CourseListHeader />
      </thead>
      <tbody data-testid="course-rows">{rows}</tbody>
    </table>
  );
};
export default CourseList;
