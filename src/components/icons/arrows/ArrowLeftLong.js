import * as React from "react";
const ArrowLeftLong = ({
  width = 22,
  height = 15,
  className,
  color,
  props,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 19 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.70271 0.731492C7.09324 1.12202 7.09324 1.75518 6.70271 2.14571L3.81082 5.0376H17.953C18.5053 5.0376 18.953 5.48531 18.953 6.0376C18.953 6.58988 18.5053 7.0376 17.953 7.0376H3.81082L6.70271 9.92949C7.09324 10.32 7.09324 10.9532 6.70271 11.3437C6.31219 11.7342 5.67902 11.7342 5.2885 11.3437L0.6895 6.7447C0.298975 6.35418 0.298975 5.72101 0.6895 5.33049L5.2885 0.731492C5.67902 0.340968 6.31219 0.340968 6.70271 0.731492Z"
      fill={color}
    />
  </svg>
);
export default ArrowLeftLong;
