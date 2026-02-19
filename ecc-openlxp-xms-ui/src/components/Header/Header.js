'use strict';

import { useAuth } from "../../context/authContext";
import Image from 'next/image';
import React from "react";

// Local imports
import Link from "next/link";
import NavBar from "./NavBar/NavBar";
import logoImage from '@/public/dodLogo.png';

const Header = () => {
  const navButtons = [
    {
      name: "Home",
      route: "/",
      testId: "home-btn",
    },
    {
      name: "Catalogs", 
      route: "/dashboard",
      testID: "catalog-btn"
    },
    {
      name: "Support", 
      route: "/support",
      testID: "support-btn"
    }
  ];

  // to be replaced from the admin console
  const logo = {
    title: "Experience Management Service",
    subtitle: "Department of Defense",
  };

  const {user, logout} = useAuth();

  const imagePath = '/_next/static/media/dodLogo.ed71202b.png'

  return (
    <header className="bg-gradient-to-t from-blue-medium to-blue text-white">
      <div className="w-10/12 flex flex-row justify-between mx-auto h-auto rounded-lg items-center pt-2">
        <div className="flex flex-row items-center">
        <Image src={imagePath} alt={'home'} height={'50'} width={'50'} priority={true} data-testid="home-btn2"/>
        <NavBar navButtons={navButtons} />
        </div>
        <div className="flex flex-row justify-end">
          {!user ? (
            <div className="flex flex-row">
              <div className="hover:bg-blue-light rounded border md:text-md m-2 p-2">
                <Link href={'/login'} className="hover:bg-blue-light p-0 mt-2">
                  Sign In
                </Link>
              </div>
              <div className=" hover:bg-blue-light rounded border md:text-md m-2 p-2">
                <Link href="/register" className="hover:bg-blue-light p-0 mt-2">
                  Sign Up
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-row">
              <span className="px-2 p-6 text-white items-center justify-center">
                {user?.user?.first_name}&nbsp;{user?.user?.last_name}
              </span>
              <button className="hover:bg-blue-light rounded border md:text-lg m-2 p-2.5" 
              onClick={()=>{logout()}}>Logout </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
