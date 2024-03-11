/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect, useState } from "react";
import "./styles.scss";
import Header from "../header";
import { SlGrid } from "react-icons/sl";
import TextComponent from "../text";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "context/auth";

export const sidebarOptions = [
  {
    title: "Dashboard",
    icon: <SlGrid />,
    routePath: "/dashboard",
  },
];

const Layout = ({ children }: { children?: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigation = useNavigate();
  const { socketInstance, signIn, initializeSocket } = useAuth();
  const { username } = useParams();

  const verifyUserIsLogged = async () => {
    if (location.pathname.includes("dashboard") && !username) {
      setLoading(false);
      return navigation("/login");
    }

    if (!socketInstance) {
      const { data, error } = await signIn(username);
      if (error) return navigation("/login");

      initializeSocket(`Bearer ${data?.token}`);
      return setLoading(false);
    }
    setLoading(false);
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

        <div className="content-layout-default">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center w-100 h-50">
              <div
                className="spinner-border"
                role="status"
                style={{ width: 30, height: 30 }}
              />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
