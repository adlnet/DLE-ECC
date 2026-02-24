'use strict';

import DefaultLayout from '@/components/layouts/DefaultLayout';

export default function Help() {
  return (
    <DefaultLayout>
      <div className='mt-10 pb-20'>
        <h1 className='pb-4 border-b mb-8 text-3xl font-semibold'>Help</h1>
        <h2 className='text-xl font-semibold'>Purpose</h2>
        <p className='pb-4 mb-2'>
          {' '}
          The Enterprise Course Catalog (ECC) enables a global search capability
          that pulls information from decentralized local catalogs across the
          DoD and aggregates the content into a single, Defense-wide portal.
          Existing course catalog systems and their respective contents will
          still be owned and managed by their current system owners, but the
          content (data) within those systems will be discoverable across all of
          DoD via the ECC portal.{' '}
        </p>
        <h2 className='text-xl font-semibold'>Features</h2>
        <p className='mb-2'>
          {' '}
          Search course: Searching through the catalog of courses is possible
          through the home page as well the search results page. Easy navigation
          back to Search Courses is possible through the link in the header.
        </p>
        <p className='mb-2'>
          {' '}
          Save search: Any search can be saved with the click of the “Save this
          search” button located just on top of the search bar in the search
          results page. Type in a query name you want to save this search under
          and click &quot;Save&quot;.{' '}
        </p>
        <p className='mb-2'>
          {' '}
          Viewing and managing saved searched: Saved searches can be accessed by
          clicking the drop down in the top right corner next to the user
          information, then clicking “Saved Searches”. Click the “View” button
          to return to this search or “Delete” for any searches that no longer
          need to be saved.{' '}
        </p>
        <p className='mb-2'>
          {' '}
          Save courses to list: By clicking the Save button associated with any
          course, a pop up will be shown. Click “Add” to add a course to any
          existing list or “Remove” to remove from a list. A new list can also
          be created by entering a list name and description, then clicking
          “Create”. Once completed, clicking the “Close” will close
          the popup.{' '}
        </p>
        <p className='mb-2'>
          {' '}
          View lists: Lists can be accessed by clicking the drop down in the top
          right corner next to the user information, then clicking “My Lists”.
          Click the “View” button to view the courses in that list or “Edit” to
          make changed to that specific list.
        </p>
        <p className='mb-2'>
          {' '}
          Search lists to subscribe: Search list is accessible through the link
          in the header. Search for the list, click “Subscribe” to the list or
          “Unsubscribe”.{' '}
        </p>
        <p className='pb-4 mb-2'>
          {' '}
          Viewing subscribed lists: Subscribed lists can be accessed by clicking
          the drop down in the top right corner next to the user information,
          then clicking “Subscribed”. Click the “View” button to view the
          courses in that list or “Unsubscribe” to no longer see the list in
          subscribed lists.{' '}
        </p>

        <h2 className='text-xl font-semibold'>Course Providers</h2>
        <p className='pb-4 mb-2'>
          AETC: 6000+ courses, DAU: 1000+ courses, edX: 1500+ courses, JKO:
          1000+ courses{' '}
        </p>
      </div>
    </DefaultLayout>
  );
}
