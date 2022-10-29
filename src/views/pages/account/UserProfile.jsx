import React, { useEffect, useState } from "react";
import CardProfile from "../../../components/cards/CardProfile";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import HeroProfile from "../../../components/hero/HeroProfile";
import SidebarProfile from "../../../components/sidebars/SidebarProfile";
import { Tabs } from "react-tabs";
import useDocumentTitle from "../../../components/useDocumentTitle";
import { useWeb3React } from "@web3-react/core";
import { connectors } from "../../../utils/connectors";
import useAuth from "../../../hooks/useAuth";

const UserProfile = () => {
  useDocumentTitle("NFJ Labs-Marketplace");
  const API_ENDPOINT = "http://3.82.138.126:8000";
  const [creatorData, setCreatorData] = useState([]);
  const [profile, setProfile] = useState([]);
  const { account, active } = useWeb3React();
  const { login } = useAuth();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (active) {
      fetch(API_ENDPOINT + "/nft/get/" + account)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setCreatorData(data);
        })
        .catch((err) => console.log(err));
      fetch(API_ENDPOINT + "/users/" + account)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          console.log(account);
          // setCreatorData(data.nfts);
          setProfile(data);
        })
        .catch((err) => console.log(err));
    }
  }, [active, account]);

  return (
    <div>
      <Header />
      {active ? (
        <>
          {" "}
          <HeroProfile address={account} userProfile={profile} />
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-3 col-md-7 order-md-0 order-1">
                <SidebarProfile
                  creatorData={creatorData}
                  userProfile={profile}
                />
              </div>
              <div className="col-lg-9 col-md-12 order-md-1 order-0">
                <div className="profile__content">
                  <div className="d-flex justify-content-between">
                    <Tabs className="space-x-10">
                      <div className="d-flex justify-content-between"></div>
                      <div className="tab-content">
                        <CardProfile creatorData={creatorData} />
                      </div>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="container mt-80">
          <div>
            <div className="box edit_box ">
              <h3 className="mb-20 text-center">Please Connect to Wallet</h3>
              <div className="text-center">
                <div
                  onClick={() => login(connectors.injected)}
                  className="text-center"
                  // onClick={update}
                >
                  <div className="btn btn-dark">Connect Wallet</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default UserProfile;
