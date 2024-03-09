import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { sidebarOptions } from "../layout";
import TextComponent from "../text";
import "./styles.scss";
import { SlMenu, SlUser } from "react-icons/sl";

const Header = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="container-header-default">
      <div className="left">
        <div className="dropdown">
          <button
            className="btn btn-secondary"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <SlMenu />
          </button>
          <ul className="dropdown-menu">
            {sidebarOptions?.map((item, index) => {
              return (
                <li key={item?.title + index}>
                  <button
                    className="dropdown-item d-flex flex-row gap-2 align-items-center justify-content-center"
                    type="button"
                  >
                    {item?.icon}
                    <TextComponent>{item?.title}</TextComponent>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="right d-flex align-items-center gap-3">
        <TextComponent>Olá, {user?.username}</TextComponent>
        <div className="dropdown">
          <button
            className="btn btn-secondary bg-transparent"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <SlUser color="gray" />
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => {
                  signOut();
                  navigate("/login");
                }}
              >
                <TextComponent>Sair</TextComponent>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
