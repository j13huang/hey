import * as React from "react";

export const UpArrow: React.FC<any> = function ({ voted }) {
  return (
    <svg height="50px" width="50px" fill={voted ? "#000000" : "#ff00ff"} version="1.1" x="0px" y="0px" viewBox="0 0 100 100">
      <g>
        <polygon points="36.05,57.95 63.95,57.95 50,44.07  "></polygon>
        <path d="M71.27,19H28.73C21.71,19,16,24.71,16,31.73v42.55C16,81.29,21.71,87,28.73,87h42.55C78.29,87,84,81.29,84,74.27V31.73   C84,24.71,78.29,19,71.27,19z M80,74.27c0,4.81-3.91,8.73-8.73,8.73H28.73C23.91,83,20,79.09,20,74.27V31.73   c0-4.81,3.91-8.73,8.73-8.73h42.55c4.81,0,8.73,3.91,8.73,8.73V74.27z"></path>
      </g>
    </svg>
  );
};
