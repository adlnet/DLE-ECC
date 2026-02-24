'use strict';

import { backendHost } from '@/config/endpoints';
import { useAuth } from '@/contexts/AuthContext';
import { useConfig } from '@/hooks/useConfig';
import { useRouter } from 'next/router';
import { xAPISendStatement } from '@/utils/xapi/xAPISendStatement';
import CourseSpotlight from '@/components/cards/CourseSpotlight';
import Footer from '@/components/Footer';
import Head from 'next/head'
import Header from '@/components/Header';
import Image from 'next/image';
import React, { useCallback, useMemo } from 'react';
import SearchBar from '@/components/inputs/SearchBar';
import logo from '@/public/logo.png';
import useField from '@/hooks/useField';
import useSpotlightCourses from '@/hooks/useSpotlightCourses';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const config = useConfig();

  const spotlight = useSpotlightCourses();
  const { fields, updateKeyValuePair, resetKey } = useField({
    keyword: '',
    p: 1,
  });

  const handleSearch = useCallback(
    (e) => {
      if (!fields.keyword || fields.keyword === '') return;
      const context = {
        actor: {
          first_name: user?.user?.first_name || 'Anonymous',
          last_name: user?.user?.last_name || 'User',
        },
        verb: {
          id: 'https://w3id.org/xapi/acrossx/verbs/searched',
          display: 'searched',
        },
        object: {
          definitionName: 'ECC Search Capability',
        },
        resultExtName: 'https://w3id.org/xapi/ecc/result/extensions/searchTerm',
        resultExtValue: fields.keyword,
      };
      xAPISendStatement(context);
      router.push({ pathname: '/search/', query: fields });
    },
    [fields, user]
  );

  const handleChange = (event) => {
    updateKeyValuePair(event.target.name, event.target.value);
  };

  const thumbnail = useMemo(() => { 
    return (
      (config?.data?.ui_logo &&
        `${backendHost}${config?.data?.ui_logo}`) ||
      null
    );
  }, [config]);

  return (
    <>
      <Head>
        <title>Experience Discovery Service</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className='max-w-7xl mx-auto flex flex-col items-center justify-center mt-10'>
        {config?.isSuccess && thumbnail ? <img
            src={thumbnail}
            alt=''
            className='h-32 w-32 m-2'
          /> : <Image src={logo} height={150} width={150} alt='' />}
        <h1 className='text-3xl font-bold mt-4'>Enterprise Course Catalog</h1>
        <h2 className='text-xl font-sans mt-2'>Department of Defense</h2>
      </div>
      <div className='w-[44rem] mx-auto mt-10'>
        <SearchBar
          parameters={fields}
          onReset={resetKey}
          onClick={handleSearch}
          onChange={handleChange}
        />
      </div>
      {spotlight.isSuccess && spotlight.data.length > 0 && (
        <>
          <span className='text-gray-400 italic block mt-24 font-sans px-2 max-w-7xl mx-auto'>
            Spotlight Courses
          </span>
          <div className='flex flex-col justify-center w-full mt-4 px-2 max-w-7xl mx-auto'>
            <div className='inline-flex overflow-x-auto gap-2 pb-4 custom-scroll '>
              {spotlight.data.map((course) => {
                return <CourseSpotlight course={course} key={course.meta.id} />;
              })}
            </div>
          </div>
        </>
      )}
      <Footer />
    </>
  );
}
