'use strict';

export default function InterestListsResult({interestList, isSubscribed, onSubscribe, onUnsubscribe}) {
  const {name, description} = interestList;

  return (
    <div className='w-full flex'>

      {/*  card title and description start*/}
      <div className='w-4/5 font-sans'>
        <h3 className='text-lg font-medium'>{name}</h3>
        <p>{description}</p>

      </div>
      {/*  card title and description end*/}

      {/*  card actions start*/}
      <div className='w-1/5 flex justify-end items-center gap-2'>
        {isSubscribed ?
         <button
           className='rounded bg-red-50 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-2 py-1.5 outline-none focus:ring-2 ring-red-500 transform transition-all duration-150 ease-in-out'
           onClick={onUnsubscribe}>
           Unsubscribe
         </button> :
         <button
           className='rounded bg-green-50 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-2 py-1.5 outline-none focus:ring-2 ring-green-500 transform transition-all duration-150 ease-in-out'
           onClick={onSubscribe}>
           Subscribe
         </button>
        }
      </div>
      {/*  card actions end*/}
    </div>
  );
}
