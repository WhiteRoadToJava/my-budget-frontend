import * as React from "react";

const Plus = ({ width = 10, height = 10, className, color, props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 0.5C5.27614 0.5 5.5 0.723858 5.5 1V4.5H9C9.27614 4.5 9.5 4.72386 9.5 5C9.5 5.27614 9.27614 5.5 9 5.5H5.5V9C5.5 9.27614 5.27614 9.5 5 9.5C4.72386 9.5 4.5 9.27614 4.5 9V5.5H1C0.723858 5.5 0.5 5.27614 0.5 5C0.5 4.72386 0.723858 4.5 1 4.5H4.5V1C4.5 0.723858 4.72386 0.5 5 0.5Z"
      fill={color}
    />
  </svg>
);

export default Plus;
