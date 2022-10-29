import React, { useEffect, useState } from "react";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import { Tabs } from "react-tabs";
import useDocumentTitle from "../../../components/useDocumentTitle";
import { Link, useParams } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { getNetworkByChainID, truncateAddress } from "../../../utils/service";
import { ArtisticJeweller } from "../../../config/contract";
import { ChainsInfo } from "../../../config/config-chains";

const Profile = () => {
  useDocumentTitle("NFJ Labs-Marketplace");
  const [creatorData, setCreatorData] = useState([]);
  const { account } = useWeb3React();
  const [profile, setProfile] = useState([]);

  const { address } = useParams();
  const API_ENDPOINT = "http://3.82.138.126:8000";
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    fetch(API_ENDPOINT + "/nft/get/" + address)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCreatorData(data);
      })
      .catch((err) => console.log(err));
    fetch(API_ENDPOINT + "/users/" + address)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.user);
        console.log(account);
        setProfile(data.user);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <Header />
      <>
        <HeroProfile address={address} userProfile={profile} />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-3 col-md-7 order-md-0 order-1">
              <SidebarProfile creatorData={creatorData} userProfile={profile} />
            </div>
            <div className="col-lg-9 col-md-12 order-md-1 order-0">
              <div className="profile__content">
                <div className="d-flex justify-content-between">
                  <Tabs className="space-x-10">
                    <div className="d-flex  justify-content-between"></div>
                    <div className="mt-4  tab-content">
                      <CardProfile
                        creatorData={creatorData}
                        chainID={creatorData.chainID}
                      />
                    </div>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>

      <Footer />
    </div>
  );
};
const HeroProfile = ({ address, userProfile }) => {
  console.log(userProfile);

  return (
    <div className="mb-100">
      <div className="hero__profile">
        <div className="cover">
          <img src={userProfile?.bg_image} alt="ImgPreview" />
        </div>
        <div className="infos">
          <div className="container">
            <div className="row flex-wrap align-items-center justify-content-between sm:space-y-50">
              <div className="col-md-auto mr-20">
                <div className="avatars d-flex space-x-20 align-items-center">
                  <div className="avatar_wrap">
                    <img
                      className="avatar avatar-lg"
                      src={userProfile?.avatar_url}
                      alt="avatar"
                    />
                  </div>
                  <h5>@{userProfile?.username}</h5>
                </div>
              </div>
              <div className="col-md-auto">
                <div className="d-sm-flex flex-wrap align-items-center space-x-20 mb-20_reset d-sm-block">
                  <div className="mb-20">
                    <div className="copy">
                      <span className="color_text">
                        {truncateAddress(address)}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap align-items-center space-x-20">
                    <div className="mb-20"></div>
                    <div className="mb-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const SidebarProfile = ({ creatorData, userProfile }) => {
  return (
    <div className="profile__sidebar">
      <div className="space-y-40">
        <div className="space-y-10">
          <h5>About me</h5>
          <div className="box space-y-20">
            <p>{userProfile?.about_details}</p>
            <div className="row">
              <div className="col-6">
                <span className="txt_sm color_text">Creations</span>
                <h4>{creatorData?.length}</h4>
              </div>{" "}
              <div className="col-6">
                <span className="txt_sm color_text">Follower</span>
                <h4>
                  {console.log(userProfile?.followers)}
                  {userProfile?.followers === undefined
                    ? 0
                    : userProfile?.followers.length}
                </h4>
              </div>
              <div className="col-6">
                <span className="txt_sm color_text">Following</span>
                <h4>
                  {userProfile === undefined
                    ? 0
                    : userProfile.following?.length}
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-10">
          <h5>Follow me</h5>
          <div className="box">
            <ul className="social_profile space-y-10 overflow-hidden">
              {userProfile?.user?.facebookUrl.trim() !== "" && (
                <li>
                  <a
                    href={userProfile?.user?.facebookUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <i className="ri-facebook-line" />
                    <span className="color_text">facebook</span>
                  </a>
                </li>
              )}

              {userProfile?.user?.twitterUrl.trim() !== "" && (
                <li>
                  <a
                    href={userProfile?.user?.twitterUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <i className="ri-messenger-line" />
                    <span className="color_text"> Twitter</span>
                  </a>
                </li>
              )}
              {userProfile?.user?.whatsappUrl.trim() !== "" && (
                <li>
                  <a
                    href={userProfile?.user?.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="ri-youtube-line" />
                    <span className="color_text"> Youtube</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const CardProfile = ({ creatorData }) => {
  const [usdPrice, setUsdPrice] = useState(0);
  const { chainId } = useWeb3React();
  useEffect(() => {
    fetch(
      "https://cex.io/api/last_price/" +
        ChainsInfo[chainId]?.CURRENCY_SYMBOL +
        "/USD"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUsdPrice(data);
      });
  }, [chainId]);

  return (
    <div className="row mb-30_reset">
      {creatorData.map(
        (val, i) =>
          val.isApproved &&
          !val.isAuction && (
            <>
              {" "}
              {/* col-lg-4 col-md-6 col-sm-6 */}
              <div
                className="col-lg-3 col-md-6 col-sm-6"
                key={i}
                style={{ maxWidth: "21rem", width: "100%" }}
              >
                <div className="card__item four">
                  <div className="card_body space-y-10">
                    {/* =============== */}

                    <div className="card_head">
                      <Link
                        to={`/item/${getNetworkByChainID(
                          val.chainID
                        )}/${ArtisticJeweller}/${val._id}/${val.nftToken}`}
                      >
                        <img
                          src={`https://ipfs.io/ipfs/${val.image}`}
                          alt="nftimage"
                        />
                      </Link>
                      {/*
                       */}
                    </div>
                    {/* =============== */}
                    <h6 className="card_title">{val.nftName}</h6>
                    <p>
                      {" "}
                      {/* {val.userInfo[0].firstname === undefined
                        ? "No name"
                        : val.userInfo[0].firstname}{" "}
                      {val.userInfo[0].lastname === undefined
                        ? ""
                        : val.userInfo[0].lastname} */}
                    </p>
                    <div className="card_footer d-block space-y-10">
                      <div className="card_footer d-block space-y-10">
                        <div className="card_footer justify-content-between">
                          <div className="">
                            <p className="txt_sm d-flex flex-column">
                              <span
                                style={{
                                  color: "#808080",
                                  fontSize: "12px",
                                }}
                              >
                                Price:
                              </span>
                              <span
                                className="
                                         txt_sm"
                                style={{
                                  color: "#000",
                                  fontSize: "14px",
                                }}
                              >
                                {val.price}{" "}
                                {ChainsInfo[val?.chainID]?.CURRENCY_SYMBOL} ( $
                                {parseFloat(
                                  usdPrice?.lprice * val.price
                                ).toFixed(2)}
                                ) USD
                              </span>
                            </p>
                          </div>
                          <div>
                            <div
                              className="py-2 d-flex gap-2"
                              style={{ alignItems: "center" }}
                            >
                              <div>
                                <img
                                  src={val.userInfo[0]?.avatar_url}
                                  alt=""
                                  width="40px"
                                  height="40px"
                                  style={{
                                    borderRadius: "9999px",
                                    objectFit: "cover",
                                  }}
                                ></img>
                              </div>

                              <Link to={"/profile/" + val.userInfo[0].wallet}>
                                <div>
                                  <div
                                    style={{
                                      color: "#808080",
                                      fontSize: "12px",
                                    }}
                                  >
                                    Artist
                                  </div>
                                  <div
                                    style={{
                                      color: "#000",
                                      fontSize: "10px",
                                    }}
                                  >
                                    @{val.userInfo[0].username}
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                        {/* <div className="hr" /> */}
                      </div>
                      {/* <div className="hr" /> */}
                      {/* <div
                          className="d-flex
           align-items-center
           space-x-10
           justify-content-between"
                        >
                          <Link
                            to={`/item/${getNetworkByChainID(
                              val.chainID
                            )}/${ArtisticJeweller}/${val._id}/${val.nftToken}`}
                          >
                            <div
                              className="btn btn-sm "
                              style={{ backgroundColor: "#4b2be9" }}
                            >
                              Buy NFT
                            </div>
                          </Link>
                        </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
      )}
    </div>
  );
};
export default Profile;
