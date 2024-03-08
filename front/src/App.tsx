import React from "react";
import "./styles/fonts.scss";
import "./styles/global.scss";
import Routes from "./routes";
import { AuthProvider } from "./context/auth";

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
