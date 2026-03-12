import * as React from "react";
const ChevronLeft = ({ width = 16, height = 28, className, color }) => (
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
      d="M15.0607 0.93934C15.6464 1.52513 15.6464 2.47487 15.0607 3.06066L4.12132 14L15.0607 24.9393C15.6464 25.5251 15.6464 26.4749 15.0607 27.0607C14.4749 27.6464 13.5251 27.6464 12.9393 27.0607L0.93934 15.0607C0.353553 14.4749 0.353553 13.5251 0.93934 12.9393L12.9393 0.93934C13.5251 0.353553 14.4749 0.353553 15.0607 0.93934Z"
      fill={color}
    />
  </svg>
);
export default ChevronLeft;
