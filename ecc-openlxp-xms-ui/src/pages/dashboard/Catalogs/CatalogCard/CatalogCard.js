'use strict';

import Image from 'next/image';
import Link from 'next/link';
import React from "react";

const CatalogCard = (props) => {
  const title = props.title;
  const img = props.img;

  return (
    // eslint-disable-next-line @next/next/link-passhref
    <Link
      href={`/dashboard/${title}`}
      className="my-4"
      data-testid="nav-link">
      <div className="flex flex-row w-64 h-28 bg-gray-200 p-3 rounded-lg space-x-12 hover:shadow-lg transition-shadow">
        
        { img?.src ?
            <Image src={img.src} alt={'catalog image default'} width={'100'} height={'80'} priority={true}/> :
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt="catalog" className="object-contain rounded-md" width={'100'} height={'80'}/>
        }
        
        <div className="font-sans font-thin self-center w-1/2 text-2xl">{title}</div>
      </div>
    </Link>
  );
};
export default CatalogCard;
