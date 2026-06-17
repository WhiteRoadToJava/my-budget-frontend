import * as React from 'react';

const Message = ({ width = 25, height = 15, className, color = "currentColor", ...props }) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 21 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0H21V11H12L10.5 14L9 11H0V0ZM2 2V9H10.08L10.5 9.84L10.92 9H19V2H2ZM4 4H17V6H4V4ZM4 7H13V9H4V7Z"
        fill={color}
      />
    </svg>
  );
};

export default Message;