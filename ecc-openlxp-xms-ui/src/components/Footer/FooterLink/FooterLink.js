'use strict';

const FooterLink = (props) => {
  const link = props.link || null;
  const name = props.name || null;

  return (
    <a
      className=" text-center text-white text-sm hover:bg-blue rounded-sm"
      href={link}
      target="_blank"
      rel="noopener noreferrer">
      {name}
    </a>
  );
};
export default FooterLink;
