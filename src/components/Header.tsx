import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <div className="bg-[#0D0D0D] h-[200px] flex justify-center items-center">
      <div className="flex justify-center items-center gap-3 h-[48px] ">
        <Image
          src="/rocket.svg"
          alt="logo"
          width={25}
          height={25}
          className="h-full"
        />
        <h1 className="text-[40px] text-primary font-inter font-black">
          Todo
          <span className="text-secondary"> App</span></h1>
      
      </div>
    </div>
  );
};

export default Header;
