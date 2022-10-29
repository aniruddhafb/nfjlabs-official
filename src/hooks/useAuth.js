import { useWeb3React } from "@web3-react/core";
import { ConnectWallet } from "../Redux/actions";
export const useAuth = () => {
  const { activate, deactivate } = useWeb3React();
  const login = (connectors) => {
    activate(connectors).then(() => ConnectWallet());
  };

  const logout = async () => {
    // refreshState();
    deactivate();
  };
  return { login, logout };
};

export default useAuth;
