'use strict';

import { NavLink } from "react-router-dom";

/**
 * Expects a logo object to be passed in with
 * `logo = { title:string, subtitle:string, logo:url}`
 * @param logo
 */

const HeaderLogo = (props) => {
  const titleToShow = props.title || undefined;
  const subtitleToShow = props.subtitle || undefined;
  const imageToShow = props.img || undefined;

  const img = imageToShow ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageToShow} alt="DOD Logo" className={"pl-3"} width={60}/>
  ) : null;

  const title = titleToShow ? (
    <div className="lg:text-lg sm:text-lg">{titleToShow}</div>
  ) : null;

  const subtitle = subtitleToShow ? (
    <div className="lg:text-md sm:text-base">{subtitleToShow}</div>
  ) : null;

  return (
    <NavLink
      className="flex flex-row items-center text-white max-w-md rounded-lg"
      to="/"
      data-testid="logo-button">
      {img}
      <div className="flex flex-col align-baseline pl-2">
        {title}
        {subtitle}
      </div>
    </NavLink>
  );
};
export default HeaderLogo;
