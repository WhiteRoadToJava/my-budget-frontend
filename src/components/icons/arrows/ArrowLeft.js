import * as React from "react";
const ArrowLeft = ({ width = 14, height = 12, className, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.06066 0.93934C9.64645 1.52513 9.64645 2.47487 9.06066 3.06066L5.62132 6.5H16C16.8284 6.5 17.5 7.17157 17.5 8C17.5 8.82843 16.8284 9.5 16 9.5H5.62132L9.06066 12.9393C9.64645 13.5251 9.64645 14.4749 9.06066 15.0607C8.47487 15.6464 7.52513 15.6464 6.93934 15.0607L0.93934 9.06066C0.353553 8.47487 0.353553 7.52513 0.93934 6.93934L6.93934 0.93934C7.52513 0.353553 8.47487 0.353553 9.06066 0.93934Z"
      fill={color}
    />
  </svg>
);
export default ArrowLeft;
