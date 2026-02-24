'use strict';

import {
  AcademicCapIcon,
  ArchiveIcon,
  UserIcon,
} from '@heroicons/react/outline';
import { getDeeplyNestedData } from '@/utils/getDeeplyNestedData';
import { removeHTML } from '@/utils/cleaning';
import { useAuth } from '@/contexts/AuthContext';
import { useCallback, useMemo, useState } from 'react';
import { useConfig } from '@/hooks/useConfig';
import { useCourse } from '@/hooks/useCourse';
import { useDerivedCourse } from '@/hooks/useDerivedCourses';
import { useMoreCoursesLikeThis } from '@/hooks/useMoreCoursesLikeThis';
import { useRouter } from 'next/router';
import { xAPISendStatement } from '@/utils/xapi/xAPISendStatement';
import Accordion from '@/components/Accordion';
import CourseSpotlight from '@/components/cards/CourseSpotlight';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SaveModalCoursePage from '@/components/modals/SaveModalCoursePage';
import ShareButton from '@/components/buttons/ShareBtn';

function RelatedCourses({ id }) {
  const config = useConfig();
  const moreLikeThis = useMoreCoursesLikeThis(id);
  if (moreLikeThis?.data?.hits < 1) return null;

  return (
    <>
      <div className='bg-gray-200 mt-10 font-bold block font-sans p-4 '>
        <div className='w-full gap-10 max-w-7xl mx-auto'>Related Courses</div>
      </div>
      <div className='flex justify-center w-full overflow-x-hidden my-10 max-w-7xl mx-auto'>
        <div className='inline-flex overflow-x-auto gap-2 py-4 custom-scroll '>
          {moreLikeThis.data?.hits?.map((course, index) => (
            <CourseSpotlight course={course} key={getDeeplyNestedData(config.data?.course_information?.course_title, course)} />
          ))}
        </div>
      </div>
    </>
  );
}

function DerivedCourses({ id, derivedCourses }) {
  const config = useConfig();

  const [showContent, setShowContent] = useState(false);

  if(derivedCourses.data?.hits.length == 0){
    return (<></>)
  }

  return (
    <>
      <div className='bg-gray-200 mt-10 font-bold block font-sans p-4 '>
        <div className='w-full gap-10 max-w-7xl mx-auto'>Derived Courses</div>
      </div>
      <div className='w-full mx-auto max-w-7xl'>
      <div className=' w-3/4 my-6 max-w-7xl'>
        <strong className='text-gray-600 text-lg'>{derivedCourses.data?.hits.length} total courses</strong>
        <p className='my-2'> These are additional resources for reference. </p>
      
        {derivedCourses?.data?.hits?.slice(0, 5).map((course, index) => (
            <Accordion key={getDeeplyNestedData(config.data?.course_information?.course_title, course)} 
            title={getDeeplyNestedData(config.data?.course_information?.course_title, course)}
            content={<a href={course.meta?.id}>
              <div className='flex flex-col '>
                <div className='py-4'>
                  <strong>Course Code: </strong>{getDeeplyNestedData(config.data?.course_information?.course_code, course)}
                </div>
                <div>
                  <strong>Description: </strong>{removeHTML(getDeeplyNestedData(config.data?.course_information?.course_description, course))}
                </div>
                <div className='py-4 '>
                  <strong className=''>Start Date: </strong>{getDeeplyNestedData(config.data?.course_information?.course_startDate, course)?.replace(' ', '').split('T')[0]}
                  <strong className='ml-8'>End Date: </strong>{getDeeplyNestedData(config.data?.course_information?.course_endDate, course)?.replace(' ', '').split('T')[0]}
                  <strong className='ml-8'>Instructor: </strong>{getDeeplyNestedData(config.data?.course_information?.course_instructor, course)}
                  <strong className='ml-8'>Delivery Mode: </strong>{getDeeplyNestedData(config.data?.course_information?.course_deliveryMode, course) || "Not Available"}

                </div>
              </div>
            </a>}/>
          ))}
        {derivedCourses.data?.hits.length > 5 && !showContent && 
        <div className='flex flex-col items-center justify-center'>
          <button
          onClick={()=>{setShowContent(true)}}
          className='flex px-4 py-2 m-4 justify-center items-center w-1/2 whitespace-nowrap p-2 text-center text-white hover:shadow-md rounded-sm bg-blue-400 hover:bg-blue-600  font-medium transform transition-all duration-75 ease-in-out focus:ring-2 ring-blue-400 outline-none'
        > Show {derivedCourses.data?.hits.length-5} More Courses </button> </div>}

        {showContent && 
          derivedCourses?.data?.hits?.slice(5, derivedCourses.data?.hits.length).map((course, index) => (
            <Accordion key={getDeeplyNestedData(config.data?.course_information?.course_title, course)} 
            title={getDeeplyNestedData(config.data?.course_information?.course_title, course)}
            content={<a href={course.meta?.id}>
              <div className='flex flex-col '>
                <div className='py-4'>
                  <strong>Course Code: </strong>{getDeeplyNestedData(config.data?.course_information?.course_code, course)}
                </div>
                <div>
                  <strong>Description: </strong>{removeHTML(getDeeplyNestedData(config.data?.course_information?.course_description, course))}
                </div>
                <div className='py-4 '>
                  <strong className=''>Start Date: </strong>{getDeeplyNestedData(config.data?.course_information?.course_startDate, course)?.replace(' ', '').split('T')[0]}
                  <strong className='ml-8'>End Date: </strong>{getDeeplyNestedData(config.data?.course_information?.course_endDate, course)?.replace(' ', '').split('T')[0]}
                  <strong className='ml-8'>Instructor: </strong>{getDeeplyNestedData(config.data?.course_information?.course_instructor, course)}
                  <strong className='ml-8'>Delivery Mode: </strong>{getDeeplyNestedData(config.data?.course_information?.course_deliveryMode, course) || "Not Available"}

                </div>
              </div>
            </a>}/>
          ))}
        {showContent && 
        <div className='flex flex-col items-center justify-center'>
          <button
          onClick={()=>{setShowContent(false)}}
          className='flex px-4 py-2 m-4 justify-center items-center w-1/2 whitespace-nowrap p-2 text-center text-white hover:shadow-md rounded-sm bg-blue-400 hover:bg-blue-600  font-medium transform transition-all duration-75 ease-in-out focus:ring-2 ring-blue-400 outline-none'
        > Show Less Courses </button></div>}
      </div>
    </div>
    </>
  );
}

export default function Course() {
  const router = useRouter();
  const { user } = useAuth();

  // state of the fetching
  const course = useCourse(router.query?.courseId);
  const config = useConfig();

  // prepare the course data
  const data = useMemo(() => {
    if (!course.isSuccess || !config.isSuccess) return null;
    return {
      title: removeHTML(
        getDeeplyNestedData(
          config.data?.course_information?.course_title,
          course.data
        )
      ),
      date: {
        start: getDeeplyNestedData(
          config.data?.course_information?.course_startDate,
          course.data
        )?.replace(' ', '').split('T')[0],
        end: getDeeplyNestedData(
          config.data?.course_information?.course_endDate,
          course.data
        )?.replace(' ', '').split('T')[0],
      },
      description: removeHTML(
        getDeeplyNestedData(
          config.data?.course_information?.course_description,
          course.data
        )
      ),
      url: getDeeplyNestedData(
        config.data?.course_information?.course_url,
        course.data
      ),
      code: getDeeplyNestedData(config.data?.course_information?.course_code, course.data),
      photo:
        getDeeplyNestedData('Course_Instance.Thumbnail', course.data) ||
        getDeeplyNestedData(config.data?.course_information?.course_thumbnail, course.data),

      provider: getDeeplyNestedData(config.data?.course_information?.course_provider, course.data),
      instructor: getDeeplyNestedData(
        config.data?.course_information?.course_instructor,
        course.data
      ),
      delivery: getDeeplyNestedData(
        config.data?.course_information?.course_deliveryMode,
        course.data
      ),
      details: config.data?.course_highlights?.map((highlight) => {
        return {
          title: highlight.display_name,
          content: removeHTML(
            getDeeplyNestedData(highlight.field_name, course.data)
          ),
        };
      }),
    };
  }, [course.isSuccess, course.data, config.isSuccess, config.data]);

  const derivedCourses = useDerivedCourse(data?.code);

  const handleClick = useCallback(() => {
    if (!user) return;
    console.count('enrollment button clicked');

    const context = {
      actor: {
        first_name: user?.user?.first_name || 'anonymous',
        last_name: user?.user?.last_name || 'user',
      },
      verb: {
        id: 'https://w3id.org/xapi/tla/verbs/registered',
        display: 'enrolled',
      },
      object: {
        definitionName: data?.title,
        description: data?.description,
        id: `${globalThis.origin}/course/${router.query?.courseId}`,
      },
      resultExtName: 'https://w3id.org/xapi/ecc/result/extensions/CourseId',
      resultExtValue: router.query?.courseId,
    };

    xAPISendStatement(context);
  }, [router.query?.courseId, data?.title, data?.description, user]);
  
  return (
    <>
      <Header />
      {/* content */}
      <div className='flex max-w-7xl px-4 mx-auto gap-8 mt-10'>
        <div className='w-2/3'>
          <div className='flex justify-between items-center'>
            <h1 className='font-semibold text-4xl'>
              {data?.title || 'Not Available'}
            </h1>
            <div className='flex gap-2'>
              <ShareButton
                id={router.query?.courseId}
                courseTitle={data?.title}
                courseDescription={data?.description}
              />
              <a
                className='min-w-max whitespace-nowrap p-2 text-center text-white hover:shadow-md rounded-sm bg-blue-400 hover:bg-blue-600  font-medium transform transition-all duration-75 ease-in-out focus:ring-2 ring-blue-400 outline-none'
                href={data?.url}
                rel='noopener noreferrer'
                target='_blank'
                onClick={handleClick}
              >
                Go to Enrollment
              </a>
            </div>
          </div>
          <p className='my-2'>
            <strong>Course Code:&nbsp;</strong>
            {data?.code || 'Not Available'}
          </p>
          <p>{data?.description || 'Not Available'}</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data?.photo}
          alt='Course'
          className='w-1/3 aspect-video object-contain'
        />
      </div>

      {/* Dates */}
      <div className='grid max-w-7xl px-4 mx-auto mt-10'>
        <span>
          <strong>Start Date:&nbsp;</strong>
          {data?.date?.start || 'Not Available'}
        </span>
        <span>
          <strong>End Date:&nbsp;</strong>
          {data?.date?.end || 'Not Available'}
        </span>
      </div>

      {/* Details divider */}
      <div id='details-divider' className='bg-gray-200 mt-4 '>
        <div className='flex max-w-7xl mx-auto p-4 justify-between'>
          <div className='flex items-center min-w-max gap-8'>
            <div className='flex justify-center items-center gap-2'>
              <ArchiveIcon className='h-10' />
              <span>
                <div className='text-sm font-semibold'>Provider</div>
                <div className='text-sm'>
                  {data?.provider || 'Not Available'}
                </div>
              </span>
            </div>
            <div className='flex justify-center items-center gap-2'>
              <UserIcon className='h-10' />
              <span>
                <div className='text-sm font-semibold'>Instructor</div>
                <div className='text-sm'>
                  {data?.instructor || 'Not Available'}
                </div>
              </span>
            </div>
            <div className='flex justify-center items-center gap-2'>
              <AcademicCapIcon className='h-10' />
              <span>
                <div className='text-sm font-semibold'>Delivery Mode</div>
                <div className='text-sm'>
                  {data?.delivery || 'Not Available'}
                </div>
              </span>
            </div>
            <SaveModalCoursePage courseId={router.query?.courseId} title={data?.title} />
          </div>
        </div>
      </div>
      {/* Extra Details */}
      <div className='py-4 grid'>
        {data?.details?.map((detail, index) => {
          return (
            <div
              key={detail.title}
              className='grid grid-cols-5 w-full max-w-7xl px-4 mt-5 mx-auto'
            >
              <h2 className='min-w-max col-span-1 font-semibold'>
                {detail.title}
              </h2>
              <p className='col-span-4'>{detail.content || 'Not Available'}</p>
            </div>
          );
        })}
      </div>

      {/* Derived Courses */}
      {derivedCourses && <DerivedCourses id={data?.code} derivedCourses={derivedCourses}/> }
      {/* Related courses */}
      <RelatedCourses id={router.query?.courseId} />
      <Footer />
    </>
  );
}
