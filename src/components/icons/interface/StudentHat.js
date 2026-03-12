import * as React from "react";
const StudentHat = ({ width = 22, height = 18, className, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 22 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M11 0L0 6L4 8.18V14.18L11 18L18 14.18V8.18L20 7.09V14H22V6L11 0ZM17.82 6L11 9.72L4.18 6L11 2.28L17.82 6ZM16 12.99L11 15.72L6 12.99V9.27L11 12L16 9.27V12.99Z"
      fill={color}
    />
  </svg>
);
export default StudentHat;
