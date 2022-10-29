import "./assets/css/plugins/bootstrap.min.css";
import "remixicon/fonts/remixicon.css";
// import "./assets/scss/style.scss";
import "./App.css";

import Router from "./Router/routes";
import { useEffect } from "react";
import useAuth from "./hooks/useAuth";
import { connectors } from "./utils/connectors";
function App() {
  const { login } = useAuth();
  useEffect(() => {
    if (localStorage.getItem("walletConnect") != null) {
      let data = JSON.parse(localStorage.getItem("walletConnect"));
      console.log("walletConnect", data.isConnect);
      login(connectors.injected);
    }
  }, []);
  return (
    <div className="App overflow-hidden">
      <Router />
    </div>
  );
}

export default App;
