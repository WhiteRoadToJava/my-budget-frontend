import * as React from "react";
const OptionDots = ({ width = 16, height = 4, className, color, ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className={className}
  >
    <path
      d="M6.5 2C6.5 2.82843 7.17157 3.5 8 3.5C8.82843 3.5 9.5 2.82843 9.5 2C9.5 1.17157 8.82843 0.5 8 0.5C7.17157 0.5 6.5 1.17157 6.5 2Z"
      fill={color}
    />
    <path
      d="M12.5 2C12.5 2.82843 13.1716 3.5 14 3.5C14.8284 3.5 15.5 2.82843 15.5 2C15.5 1.17157 14.8284 0.500001 14 0.500001C13.1716 0.5 12.5 1.17157 12.5 2Z"
      fill={color}
    />
    <path
      d="M0.5 2C0.5 2.82843 1.17157 3.5 2 3.5C2.82843 3.5 3.5 2.82843 3.5 2C3.5 1.17157 2.82843 0.5 2 0.5C1.17157 0.5 0.5 1.17157 0.5 2Z"
      fill={color}
    />
  </svg>
);
export default OptionDots;
