const LoadingComponent = () => {
  return (
    <div
      className="d-flex w-100 justify-content-center align-items-center"
      style={{ padding: "40px 0px" }}
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
