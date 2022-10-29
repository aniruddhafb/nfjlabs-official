import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import useDocumentTitle from "../../../components/useDocumentTitle";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import useAuth from "./../../../hooks/useAuth";
import { connectors } from "../../../utils/connectors";
import { useHistory } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
const ConnectWalllet = () => {
  const ref = useRef();
  const closeTooltip = () => ref.current.close();
  const { login, logout } = useAuth();
  const { account, active, chainId } = useWeb3React();
  const navigate = useHistory();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useDocumentTitle("NFJ Labs-Marketplace");
  console.log(account, active, chainId);
  const wallets = [
    {
      title: "Metamask",
      p: "A browser extension with great flexibility. The web's popular wallet",
      popup: "error",
      connect: async () => {
        login(connectors.injected);
        console.log("dashfhgjsd", account, active, chainId);
        navigate.goBack();
        // if (chainId === 3) {
        //   navigate.goBack();
        // } else {
        //   Swal.fire("Warning", "Connect ETH or Polygon Network", "warning");
        // }

        // navigate.push("/");
      },
      disconnect: () => logout(),
    },
  ];

  return (
    <div className="effect">
      <Header />
      <div className="container">
        <div>
          <Link to="/" className="btn btn-white btn-sm mt-20">
            Back to home
          </Link>
        </div>

        <div className="row justify-content-center my-50">
          <div className="col-lg-9">
            <div className="wallets">
              <div className="row mb-20_reset">
                {wallets.map((val, i) => (
                  <div className="col-lg-4" key={i}>
                    <Popup
                      className="custom"
                      ref={ref}
                      trigger={
                        <button className="box in__wallet space-y-10">
                          <div className="logo">
                            <img
                              src={`https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/512px-MetaMask_Fox.svg.png?20220831120339`}
                              alt="logo_community"
                              width={50}
                            />
                          </div>
                          <h5 className="text-center">{val.title}</h5>
                          <p className="text-center">{val.p}</p>
                        </button>
                      }
                      position="bottom center"
                    >
                      <div>
                        <div
                          className="popup"
                          id="popup_bid"
                          tabIndex={-1}
                          role="dialog"
                          aria-hidden="true"
                        >
                          <div>
                            <button
                              type="button"
                              className="button close"
                              data-dismiss="modal"
                              aria-label="Close"
                              onClick={closeTooltip}
                            >
                              <span aria-hidden="true">×</span>
                            </button>

                            <div className="space-y-20">
                              <h3 className="text-center">
                                {account
                                  ? "Wallet Connected!"
                                  : "Connect to Wallet...!"}
                              </h3>
                              <p className="text-center">
                                {account
                                  ? " You have sucessfully connected your wallet, now you can start bidding or upload your own art!"
                                  : "Connect to wallet first , then you can buy or sell nft on our platform."}
                              </p>
                              <div className="d-flex justify-content-center space-x-20">
                                <div
                                  onClick={() =>
                                    !active ? val.connect() : val.disconnect()
                                  }
                                  className="btn  btn-grad"
                                >
                                  {!account ? "Connect" : "Disconnect"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
// const mapStateToProps = (state) => {
//   return {
//     Provider: state.provider,
//   };
// };
export default ConnectWalllet;
