import React from 'react';

function Footer() {
  return (
    <footer className="bg-[#306464] py-6">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} I AM MUSIC. All rights reserved.
        </p>
        <div className="mt-4">
          <a href="/about" className="text-sm hover:text-[#fdb034] mx-2">About</a>
          <a href="/privacy" className="text-sm hover:text-[#fdb034] mx-2">Privacy Policy</a>
          <a href="/terms" className="text-sm hover:text-[#fdb034] mx-2">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
