'use strict';

import Footer from '../Footer/Footer';
import Header from '../Header/Header';

export default function DefaultLayout({ children, footerLocation }) {
  return (
    <div className='relative custom-scroll min-h-screen'>
      <Header />
      <div className='w-9/12 mx-auto px-4 sm:px-6 md:px-8'> 
        {children}
      </div>
      <div className='absolute bottom-0 w-full'>
        <Footer />
      </div>
    </div>
  );
}
