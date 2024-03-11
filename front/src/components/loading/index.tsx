import { CSSProperties } from "react";

const LoadingComponent = ({ style }: { style?: CSSProperties }) => {
  return (
    <div
      className="d-flex w-100 justify-content-center align-items-center"
      style={{ padding: "40px 0px", ...style }}
    >
      <div
        className="spinner-border"
        role="status"
        style={{ width: 22, height: 22 }}
      />
    </div>
  );
};

export default LoadingComponent;
