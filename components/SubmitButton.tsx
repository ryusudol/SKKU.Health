import React from "react";

type PropsType = {
  isLoading: boolean;
  buttonMsg: string;
  loadingMsg: string;
  buttonStyle: string;
  radius: string;
  strokeWidth: string;
};

const SubmitButton = ({
  isLoading,
  buttonMsg,
  loadingMsg,
  buttonStyle,
  radius,
  strokeWidth,
}: PropsType) => {
  return (
    <button disabled={isLoading} className={buttonStyle}>
      {isLoading ? (
        <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 50 50">
          <circle
            style={{ strokeDasharray: 65 }}
            className="stroke-white"
            cx="25"
            cy="25"
            r={radius}
            fill="none"
            stroke-width={strokeWidth}
          ></circle>
        </svg>
      ) : null}
      {isLoading ? loadingMsg : buttonMsg}
    </button>
  );
};

export default SubmitButton;
