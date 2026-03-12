import * as React from "react";
const SmallChevronRight = ({ width = 6, height = 10, className, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 6 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M0.292893 0.292971C0.659009 -0.0731451 1.23801 -0.0957389 1.63078 0.224612L1.70696 0.292971L5.70696 4.29297C6.09748 4.6835 6.09748 5.31651 5.70696 5.70703L1.70696 9.70703C1.31643 10.0976 0.683417 10.0976 0.292893 9.70703C-0.0976311 9.31651 -0.0976311 8.68349 0.292893 8.29297L3.58586 5L0.292893 1.70703L0.224534 1.63086C-0.0958165 1.23809 -0.0732228 0.659087 0.292893 0.292971Z"
      fill={color}
    />
  </svg>
);
export default SmallChevronRight;
