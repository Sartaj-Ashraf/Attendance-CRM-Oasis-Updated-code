import { useState } from "react";
import { Bell, ChevronDown, LogOut, User, Settings } from "lucide-react";

export default function Navbar({
  userName = "Asif",
  role = "Owner",
}) {
  const [open, setOpen] = useState(false);

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-xl font-semibold text-gray-800">
          AttendEase
        </h1>

        {/* Right Section */}
        <div className="flex items-center gap-4 relative">
          {/* Notifications */}
          <button className="relative p-2 rounded-md hover:bg-gray-100">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
          </button>

          {/* User Menu */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
              {getInitials(userName)}
            </div>

            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium text-gray-800">
                {userName}
              </span>
              <span className="text-xs text-gray-500">
                {role}
              </span>
            </div>

            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {open && (
            <div className="absolute right-0 top-14 w-48 bg-white border rounded-md shadow-md">
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
                <User className="w-4 h-4" />
                Profile
              </button>

              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
                <Settings className="w-4 h-4" />
                Account Settings
              </button>

              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
