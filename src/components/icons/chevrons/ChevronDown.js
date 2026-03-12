import * as React from "react";
const ChevronDown = ({ width = 14, height = 8, className, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 14 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.792893 0.542893C1.18342 0.152369 1.81658 0.152369 2.20711 0.542893L7 5.33579L11.7929 0.542893C12.1834 0.152369 12.8166 0.152369 13.2071 0.542893C13.5976 0.933417 13.5976 1.56658 13.2071 1.95711L7.70711 7.45711C7.31658 7.84763 6.68342 7.84763 6.29289 7.45711L0.792893 1.95711C0.402369 1.56658 0.402369 0.933417 0.792893 0.542893Z"
      fill={color}
    />
  </svg>
);
export default ChevronDown;
