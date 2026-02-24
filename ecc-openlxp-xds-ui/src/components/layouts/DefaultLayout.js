'use strict';

import { useConfig } from '../../hooks/useConfig';
import Footer from '../Footer';
import Header from '../Header';

export default function DefaultLayout({ children, footerLocation }) {
  useConfig();
  return (
    <div className={'relative custom-scroll min-h-screen'}>
      <Header />
      <div className='max-w-7xl mx-auto px-4 sm:px-4 lg:px-8'>{children}</div>
      <Footer location={footerLocation} />
    </div>
  );
}
