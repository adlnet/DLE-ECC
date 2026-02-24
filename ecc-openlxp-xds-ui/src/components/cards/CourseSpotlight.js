'use strict';

import { getDeeplyNestedData } from '@/utils/getDeeplyNestedData';
import { removeHTML } from '@/utils/cleaning';
import { useAuth } from '@/contexts/AuthContext';
import { useCallback, useMemo } from 'react';
import { useConfig } from '@/hooks/useConfig';
import { useRouter } from 'next/router';
import { xAPISendStatement } from '@/utils/xapi/xAPISendStatement';
import Link from 'next/link';

export default function CourseSpotlight({ course }) {
  const { Course, meta, Technical_Information, Course_Instance } = {
    ...course,
  };
  const config = useConfig();
  const router = useRouter();
  const { user } = useAuth();

  const thumbnail = useMemo(() => {
    return (
      Course_Instance?.Thumbnail ||
      Technical_Information?.Thumbnail ||
      (config?.data.course_img_fallback &&
        `${config?.data.course_img_fallback}`) ||
      null
    );
  }, [Course_Instance, Technical_Information, config]);

  const title = useMemo(() => {
    return (getDeeplyNestedData(config.data?.course_information?.course_title, course));
  }, [config.isSuccess, config.data]);

  const provider = useMemo(() => {
    return (getDeeplyNestedData(config.data?.course_information?.course_provider, course));
  }, [config.isSuccess, config.data]);

  const handleClick = useCallback(
    (e) => {
      if (!user)
        return router.push(`/course/${meta.metadata_key_hash || meta.id}`);

      const context = {
        actor: {
          first_name: user?.user?.first_name,
          last_name: user?.user?.last_name,
        },
        verb: {
          id: 'https://w3id.org/xapi/tla/verbs/explored',
          display: 'explored',
        },
        object: {
          id: `${globalThis.origin}/course/${meta.id}`,
          definitionName: title || Course.CourseTitle,
          description: removeHTML(getDeeplyNestedData(config.data?.course_information?.course_description, course)) || Course.CourseShortDescription,
        },
        resultExtName: 'https://w3id.org/xapi/ecc/result/extensions/CourseId',
        resultExtValue: meta.metadata_key_hash || meta.id,
      };
      xAPISendStatement(context);
      router.push('/course/' + (meta.metadata_key_hash || meta.id));
    },
    [Course, meta, user]
  );

  return (
    <Link href={`/course/${meta.metadata_key_hash || meta.id}`} passHref>
      <div
        onClick={handleClick}
        role='button'
        tabIndex='0'
        aria-hidden='true'
        className='bg-gradient-to-b from-black-70 to-black-10 z-0 overflow-hidden relative rounded-md shadow-stone-200 hover:shadow-lg bg-stone-200 cursor-pointer flex-shrink-0 transform transition-shadow duration-150 ease-in-out font-sans text-gray-50 text-shadow-md p-2 h-[176px] w-[296px]'
      >
        <h2 className='font-bold'>{title || Course?.CourseTitle}</h2>
        <div className='mt-2'>
          <span className='font-semibold'>Provider:&nbsp;</span>
          {provider || Course?.CourseProviderName }
        </div>
        {thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt=''
            className='h-8 w-12 absolute bottom-0 right-0 m-2'
          />
        )}
      </div>
    </Link>
  );
}
