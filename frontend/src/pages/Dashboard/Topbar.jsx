import React, { useContext } from "react";
import { AuthContext } from "../../ContextApi/isAuth";
import OasisAscendLogo from "../../components/Oalogo";
import Clock from "../../components/Clock";

const TopBar = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="w-full bg-white border-b border-gray-200 px-3 sm:px-6 py-2 flex items-center justify-between">
      {/* LEFT: LOGO */}
      <div className="flex items-center">
        <div className="sm:hidden">
          <OasisAscendLogo size={30} />
        </div>
        <div className="hidden sm:block">
          <OasisAscendLogo size={42} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* CLOCK (hide on mobile) */}
        <div className=" md:block">
          <Clock />
        </div>

        {/* USER AVATAR */}
        <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm sm:text-base select-none">
          {user?.username?.[0]?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
