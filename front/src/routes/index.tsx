import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";

const RouterRoot = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path={"/dashboard/:username/:token"} element={<Home />} />
        <Route path={"/login"} element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterRoot;
