import * as React from "react";
const CancelIcon = ({ width = 10, height = 10, className, color }) => (
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
      d= "M7.53033 1.46967C7.82322 1.17678 8.29811 1.17678 8.591 1.46967C8.88389 1.76256 8.88389 2.23744 8.591 2.53033L2.87134 8.25H6.66C7.07421 8.25 7.41 8.58579 7.41 9C7.41 9.41421 7.07421 9.75 6.66 9.75H1.06C0.645786 9.75 0.31 9.41421 0.31 9C0.31 8.58579 0.645786 8.25 1.06 8.25H4.84866L-0.871338 2.53033C-1.16422 2.23744 -1.16422 1.76256 -0.871338 1.46967C-0.578447 1.17678 -0.103563 1.17678 0.18933 1.46967L5.90934 7.18934L7.53033 1.46967Z"
      fill={color}
    />
  </svg>
);
export default CancelIcon;