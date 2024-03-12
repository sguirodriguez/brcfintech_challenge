import "./styles/fonts.scss";
import "./styles/global.scss";
import Routes from "./routes";
import { AuthProvider } from "./context/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <Routes />
      <ToastContainer autoClose={2000} />
    </AuthProvider>
  );
}

export default App;
