
const OasisAscendLogo = ({ size = 40 }) => {
  return (
    <div className="flex items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="100" height="100" rx="20" fill="#0F172A" />

        <path
          d="M30 60L50 35L70 60"
          stroke="#FACC15"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <rect x="30" y="65" width="40" height="6" rx="3" fill="#FACC15" />
      </svg>

      <div className="leading-tight">
        <h1 className="text-lg font-bold text-gray-900 tracking-wide">
          OASIS ASCEND
        </h1>
        <p className="text-xs text-gray-500 tracking-wide">
          Attendance Management System
        </p>
      </div>
    </div>
  );
};

export default OasisAscendLogo;
