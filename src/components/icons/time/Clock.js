const Clock = ({ width = 13, height = 13, className, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10ZM9 5C9 4.44772 9.44771 4 10 4C10.5523 4 11 4.44772 11 5V9H15C15.5523 9 16 9.44771 16 10C16 10.5523 15.5523 11 15 11H10C9.44771 11 9 10.5523 9 10V5ZM20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10Z"
      fill={color}
    />
  </svg>
);
export default Clock;
