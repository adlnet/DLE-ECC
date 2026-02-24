'use strict';


export default function SearchListPagination({page, setPage, listToDisplayLength, pageLength, interestListsLength}) {
    const changePage = (number) => {
        setPage(page + number);
    };

    return (
        <div>
          <div className='flex gap-2 items-center justify-end'>
            <button
              onClick={() => changePage(-1)}
              className='py-1 px-2 bg-blue-100 rounded-md border-blue-500 border text-blue-500 disabled:cursor-not-allowed disabled:opacity-50'
              disabled={page === 0 || listToDisplayLength === 0}
            >
              Prev
            </button>
            <button
              onClick={() => changePage(1)}
              className='py-1 px-2 bg-blue-100 rounded-md border-blue-500 border text-blue-500 disabled:cursor-not-allowed disabled:opacity-50'
              disabled={
                listToDisplayLength === page + 1 ||
                listToDisplayLength === 0
              }
            >
              Next
            </button>
          </div>
          <div className='mt-2'>
            Showing{' '}
            <strong>
              {/* lower bound */}
              {pageLength > 0 ? page * 10 + 1 + '-' : ''}
              {/* upper bound */}
              {pageLength === 10
                ? page * 10 + 10
                : page * 10 + pageLength || '0'}
            </strong>
            &nbsp;out of {interestListsLength}
          </div>
        </div>
    );
}