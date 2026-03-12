import * as React from "react";
const ChevronRight = ({ width = 16, height = 28, className, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.93934 0.93934C0.353553 1.52513 0.353553 2.47487 0.93934 3.06066L11.8787 14L0.93934 24.9393C0.353553 25.5251 0.353553 26.4749 0.93934 27.0607C1.52513 27.6464 2.47487 27.6464 3.06066 27.0607L15.0607 15.0607C15.6464 14.4749 15.6464 13.5251 15.0607 12.9393L3.06066 0.93934C2.47487 0.353553 1.52513 0.353553 0.93934 0.93934Z"
      fill={color}
    />
  </svg>
);
export default ChevronRight;
