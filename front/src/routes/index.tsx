import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ControllerLogin from "pages/login/controller";
import ControllerHome from "pages/home/controller";

const RouterRoot = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path={"/dashboard/:username/:token"}
          element={<ControllerHome />}
        />
        <Route path={"/login"} element={<ControllerLogin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterRoot;
