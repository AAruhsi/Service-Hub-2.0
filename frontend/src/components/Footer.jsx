import React from "react";

const Footer = () => {
  return (
    <div className="flex items-end overflow-x-hidden">
      <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4 dark:bg-black dark:text-white ">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by
            Service Hub
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default Footer;
