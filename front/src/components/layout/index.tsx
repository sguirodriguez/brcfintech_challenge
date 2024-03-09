/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect } from "react";
import "./styles.scss";
import Header from "../header";
import { SlGrid } from "react-icons/sl";
import TextComponent from "../text";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

export const sidebarOptions = [
  {
    title: "Dashboard",
    icon: <SlGrid />,
    routePath: "/dashboard",
  },
];

const Layout = ({ children }: { children?: ReactNode }) => {
  const location = useLocation();
  const navigation = useNavigate();
  const { user, signOut } = useAuth();

  const verifyUserIsLogged = () => {
    if (location.pathname.includes("dashboard") && !user) {
      signOut();
      return navigation("/login");
    }
  };

  useEffect(() => {
    if (location.pathname.includes("/dashboard")) {
      verifyUserIsLogged();
    }
  }, [location.pathname]);

  return (
    <div className="container-layout-default">
      <Header />
      <div className="main-layout-default">
        <div className="sidebar-layout-default">
          {sidebarOptions?.map((item) => (
            <div
              className="sidebar-option d-flex align-items-center"
              key={item.title}
            >
              <div>{item?.icon}</div>
              <TextComponent>{item?.title}</TextComponent>
            </div>
          ))}
        </div>
        <div className="content-layout-default">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
