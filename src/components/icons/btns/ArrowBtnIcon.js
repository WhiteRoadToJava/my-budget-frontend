import * as React from "react";
const ArrowBtnIcon = ({ width = 10, height = 10, className, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 9 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.65 1C1.65 0.585786 1.98579 0.25 2.4 0.25H8C8.41421 0.25 8.75 0.585786 8.75 1V6.6C8.75 7.01421 8.41421 7.35 8 7.35C7.58579 7.35 7.25 7.01421 7.25 6.6V2.81066L1.53033 8.53033C1.23744 8.82322 0.762563 8.82322 0.46967 8.53033C0.176777 8.23744 0.176777 7.76256 0.46967 7.46967L6.18934 1.75H2.4C1.98579 1.75 1.65 1.41421 1.65 1Z"
      fill={color}
    />
  </svg>
);
export default ArrowBtnIcon;
