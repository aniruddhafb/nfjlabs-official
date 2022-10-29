import { useWeb3React } from "@web3-react/core";
import { toHex } from "../utils/service";
export const useNetwork = () => {
  const { library } = useWeb3React();
  const changeNetwork = async (network) => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [{ chainId: toHex(80001) }],
          });
        } catch (error) {
          //   setError(error);
        }
      }
    }
  };

  return { changeNetwork };
};

export default useNetwork;
