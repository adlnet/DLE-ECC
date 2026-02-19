'use strict';

import FooterLink from "./FooterLink/FooterLink";
import React from "react";

const Footer = (props) => {

  const leftLinks = [
    { name: 'DOD Home Page', url: 'https://www.defense.gov/' },
    { name: 'About ADL', url: 'https://adlnet.gov/about/' },
    { name: 'Web Policy', url: 'https://dodcio.defense.gov/DoD-Web-Policy/' },
  ];
  const rightLinks = [
    {
      name: 'Privacy',
      url: 'https://dodcio.defense.gov/Home/Privacy-Policy.aspx',
    },
    { name: 'Contact US', url: 'https://dodcio.defense.gov/Contact/' },
  ];

  const makeExternalLinks = (links) =>
    links.map((link, index) => {
      links['number']=index
      return (
        <a
          key={links.number}
          className='text-center text-gray-500 text-base p-1 hover:text-gray-900 h-auto hover:text-shadow-md transform transition-all duration-75 ease-in-out'
          href={link.url}
        >
          {link.name}
        </a>
      );
    });

  return (
    <div className='mt-10 bottom-0 bg-opacity-90 w-full mx-auto z-50'>
      <nav className={'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t'}>
        <div className={'w-full py-4 inline-flex items-center justify-between'}>
          <div className={'flex items-center gap-4'}>
            {makeExternalLinks(leftLinks)}
          </div>
          <div className={'flex items-right gap-4'}>
            {makeExternalLinks(rightLinks)}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Footer;
