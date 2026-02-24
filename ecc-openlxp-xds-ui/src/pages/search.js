'use strict';

import { useCallback, useEffect, useState } from 'react';

import { Pagination } from '@/components/buttons/Pagination';
import { unstable_batchedUpdates } from 'react-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useConfig } from '@/hooks/useConfig';
import { useRouter } from 'next/dist/client/router';
import { useSearch } from '@/hooks/useSearch';
import { xAPISendStatement } from '@/utils/xapi/xAPISendStatement';
import CreateSavedSearchModal from '@/components/modals/CreateSavedSearch';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import MoreLikeThis from '@/components/cards/MoreLikeThis';
import SearchBar from '@/components/inputs/SearchBar';
import SearchResult from '@/components/cards/SearchResult';
import SelectList from '@/components/inputs/SelectList';

export default function Search() {
  const router = useRouter();
  const config = useConfig();
  const [params, setParams] = useState(router?.query);
  const { setUrl, data, isLoading } = useSearch();
  const { user } = useAuth();

  useEffect(() => {
    if (router?.query) {
      unstable_batchedUpdates(() => {
        setParams(router?.query);
        setUrl(router?.query);
      });
    }
  }, [router.query]);

  function handleChange(event) {
    setParams((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }

  function handleClear(key) {
    if (params[key] && params.keyword && params.keyword !== '') {
      const modified = { ...params };
      delete modified[key];
      delete modified['undefined'];

      modified.p = 1;
      setParams(modified);
      setUrl(modified);

      router.push({ pathname: '/search', query: modified });
    }
  }

  function handleListSelect(event) {
    if (params.keyword && params.keyword !== '') {
      const modified = { ...params };
      modified[event.target.name] = event.target.value;
      modified.p = 1;
      unstable_batchedUpdates(() => {
        setUrl(modified);
        setParams(modified);
      });
      router.push({ pathname: '/search', query: modified });
    }
  }

  function handleReset(key) {
    setParams((prev) => ({ ...prev, [key]: '' }));
  }

  const handleSearch = useCallback(
    (event) => {
      event.preventDefault();

      // if there is a key word
      if (!params.keyword || params.keyword === '') return;

      // set the start page to 1
      const modified = { ...params };
      modified.p = 1;

      unstable_batchedUpdates(() => {
        setParams(modified);
        setUrl(modified);
      });

      const context = {
        actor: {
          first_name: user?.user?.first_name,
          last_name: user?.user?.last_name,
        },
        verb: {
          id: 'https://w3id.org/xapi/acrossx/verbs/searched',
          display: 'searched',
        },
        object: {
          definitionName: 'ECC Search Capability',
        },
        resultExtName: 'https://w3id.org/xapi/ecc/result/extensions/searchTerm',
        resultExtValue: modified.keyword,
      };

      xAPISendStatement(context);

      router.push({ pathname: '/search', query: modified });
    },
    [params, user]
  );

  function handleSpecificPage(page) {
    const modified = { ...params };
    modified.p = page;
    unstable_batchedUpdates(() => {
      setParams(modified);
      setUrl(modified);
    });
    router.push({ pathname: '/search', query: modified }, undefined, {
      scroll: true,
    });
  }

  function createLists() {
    if (!data?.aggregations) return null;

    const { aggregations } = data;
    const keys = Object?.keys(aggregations);

    return keys?.map((key) => {
      const localData = aggregations?.[key];
      return (
        <SelectList
          key={key + localData.field_params}
          initialValue={params[localData.field_name]}
          options={localData}
          keyName={key}
          onChange={handleListSelect}
          onClear={handleClear}
        />
      );
    });
  }

  return (
    <DefaultLayout>
      <div className='mt-10 pb-4'>
        <span className='flex flex-col py-2 mb-4 max-w-min sticky top-0 z-10 bg-gray-50'>
          <div className='max-w-max self-end'>
            {user && <CreateSavedSearchModal path={router.asPath} />}
          </div>
          <div className='w-[44rem]'>
            <SearchBar
              parameters={params}
              onChange={handleChange}
              onReset={handleReset}
              onClick={handleSearch}
            />
          </div>
          {data && !isLoading && (
            <div className='flex gap-2 pl-6 pt-2'>{data && createLists()}</div>
          )}
        </span>
        {data?.total > 0 && (
          <span className={'text-gray-400 italic pt-12 font-sans px-px'}>
            About {data.total} results.
          </span>
        )}
        <div className={'grid grid-cols-12 pt-2 gap-12 '}>
          <div id='search-results' className={'col-span-8 grid gap-8 relative'}>
            {data &&
              data?.hits?.map((course) => (
                <SearchResult result={course} key={course.meta.id} />
              ))}
            <div className='py-8 sticky bottom-0 bg-gradient-to-t from-gray-50 mb-8'>
              {!isLoading && data && (
                <Pagination
                  totalPages={Math.ceil(
                    data?.total / config?.data?.search_results_per_page
                  )}
                  handleSpecificPage={handleSpecificPage}
                  currentPage={Number.parseInt(params.p)}
                />
              )}
            </div>
          </div>
          <div className='relative col-span-4'>
            <div className='sticky top-48'>
              {data && data?.hits && <MoreLikeThis course={data?.hits[0]} />}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
