import * as React from "react";
const ArrowRightLong = ({
  width = 22,
  height = 15,
  className,
  color,
  props,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.7095 0.731492C13.1 0.340968 13.7332 0.340968 14.1237 0.731492L18.7227 5.33049C19.1133 5.72101 19.1133 6.35418 18.7227 6.7447L14.1237 11.3437C13.7332 11.7342 13.1 11.7342 12.7095 11.3437C12.319 10.9532 12.319 10.32 12.7095 9.92949L15.6014 7.0376H1.45923C0.906944 7.0376 0.459229 6.58988 0.459229 6.0376C0.459229 5.48531 0.906944 5.0376 1.45923 5.0376H15.6014L12.7095 2.14571C12.319 1.75518 12.319 1.12202 12.7095 0.731492Z"
      fill={color}
    />
  </svg>
);
export default ArrowRightLong;
