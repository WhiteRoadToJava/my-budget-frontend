const SmallChevronLeft = ({ width = 6, height = 10, className, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 6 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M4.29289 0.29297C4.68342 -0.0975548 5.31643 -0.0975548 5.70696 0.29297C6.09748 0.683494 6.09748 1.31651 5.70696 1.70703L2.41399 5L5.70696 8.29297L5.77532 8.36914C6.09567 8.76192 6.07307 9.34092 5.70696 9.70703C5.34084 10.0731 4.76184 10.0957 4.36907 9.77539L4.29289 9.70703L0.292893 5.70703C-0.0976311 5.31651 -0.0976311 4.68349 0.292893 4.29297L4.29289 0.29297Z"
      fill={color}
    />
  </svg>
);
export default SmallChevronLeft;
