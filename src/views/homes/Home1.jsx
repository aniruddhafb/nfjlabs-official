import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import useDocumentTitle from "../../components/useDocumentTitle";
import { getNetworkByChainID } from "../../utils/service";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { ArtisticJeweller } from "../../config/contract";
import { ChainsInfo } from "../../config/config-chains";
import CounterComponent from "../../components/CountDown/Counter";
const settings = {
  dots: false,
  arrow: true,
  infinite: true,
  speed: 700,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: false,
  margin: 20,
  responsive: [
    {
      breakpoint: 4000,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 1100,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};
const API_ENDPOINT = "http://3.82.138.126:8000";
const Marketplace = () => {
  const { chainId } = useWeb3React();
  const [creatorData, setCreatorData] = useState([]);
  useEffect(() => {
    fetch(API_ENDPOINT + "/nft/getCreators")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.nfts);
        setCreatorData(data.nfts);
      });
  }, []);
  const web3React = useWeb3React();

  const [NftsData, setNftsData] = useState([]);
  const [usdPrice, setUsdPrice] = useState(0);
  const [featuredNftsData, setFeaturedNftsData] = useState([]);
  const [singlefeaturedNftsData, setSinglefeaturedNftsData] = useState([]);
  const [TreandingNftsData, setTreandingNftsData] = useState([]);
  useEffect(() => {
    getFeaturedNFTS();
  }, []);
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

  useEffect(() => {
    fetch(API_ENDPOINT + "/nft/getAll")
      .then((res) => {
        return res.json();
      })
      .then((data) => setNftsData(data.nfts))
      .catch((err) => console.log(err));
  }, []);

  useDocumentTitle("NFJ Labs-Marketplace");
  console.log(web3React);

  const getFeaturedNFTS = async () => {
    await axios.get(API_ENDPOINT + "/nft/featured").then((res) => {
      console.log(res.data);
      setFeaturedNftsData(res.data);
    });
    await axios.get(API_ENDPOINT + "/nft/trending").then((res) => {
      console.log(res.data);
      setTreandingNftsData(res.data);
    });
    await axios.get(API_ENDPOINT + "/nft/single-featured").then((res) => {
      console.log(res.data);
      setSinglefeaturedNftsData(res.data);
    });
  };

  return (
    <div>
      <Header />
      {/* //HeaderMarketplace Collection*/}
      <div>
        <>
          <div>
            <div>
              <div className="hero__1 px-2">
                <div className="py-5 container">
                  <div
                    className="row align-items-center justify-content-center md:justify-content-between"
                  // style={{ justifyContent: "space-between" }}
                  >
                    <div className="col-lg-6">
                      <div className="hero__left space-y-20">
                        <h1
                          className="hero__title"
                          style={{ fontWeight: "700" }}
                        >
                          Collect <br></br>Non-Fungible<br></br> Jewellery 💎
                        </h1>
                        <p className="hero__text txt">
                          Artistic Jewellers seeks to establish a bridge between
                          the jewellery industry and the NFT world.
                        </p>
                        <div className="space-x-20 d-flex flex-column flex-md-row sm:space-y-20">
                          <a
                            className="btn btn-grad btn-border"
                            target="_blank"
                            rel="noreferrer"
                            href="https://s3.amazonaws.com/nfjlabs.io/NFJ+Labs+Pitch-Deck+(1).pdf"
                          >
                            Download Pitch-Deck
                          </a>
                        </div>
                        <div>
                          We accept:{" "}
                          <img
                            width={18}
                            src="https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912"
                            alt="matic"
                            style={{ marginLeft: "5px" }}
                          ></img>
                          <img
                            width={18}
                            src="https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/256/Ethereum-ETH-icon.png"
                            alt="eth"
                            style={{ marginLeft: "5px" }}
                          ></img>
                          <img
                            width={18}
                            src="https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/256/Binance-Coin-BNB-icon.png"
                            alt="bnb"
                            style={{ marginLeft: "5px" }}
                          ></img>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-6 align-items-center"
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        maxWidth: "500px",
                      }}
                    >
                      <img
                        className="img-fluid "
                        id="img_js"
                        src="https://ipfs.io/ipfs/QmcggmEKiEsGmj3Pb6J1sxXvCVKSoJA2SjbwHznLTjsqpP"
                        alt="img"
                      // width="400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
        <>
          <>
            <FeaturedNft
              NftsData={singlefeaturedNftsData}
              usdPrice={usdPrice}
            />
          </>
        </>
        {/* //Treandin NFTs */}
        <div
          style={{
            background: "linear-gradient(180deg, #000 60%, #FFF 40%)",
            padding: " 30px 10px",
          }}
        >
          {/* // Treding Colletion */}
          <div>
            <div className=" py-2 " style={{ margin: "0 30px" }}>
              <h3 style={{ color: "#e20ef9" }}>Trending Collections</h3>
              <p style={{ color: "white", marginBottom: "16px" }}>
                These are some of the most trending collections on our NFJ
                marketplace.
              </p>
            </div>
          </div>
          <div>
            <div className="">
              <div>
                <TopNFTList NftsData={TreandingNftsData} usdPrice={usdPrice} />
              </div>
            </div>
          </div>
        </div>
        {/* //Top Artist */}
        <div
          style={{
            background: "linear-gradient(180deg, #fff 50%, #000 50%)",
            padding: " 30px 10px",
          }}
        >
          {/* // Treding Colletion */}
          <div>
            <div
              className=" py-5"
              style={{ textAlign: "end", margin: "0 30px" }}
            >
              <h3 style={{ color: "#000", fontWeight: "bold" }}>Top Artists</h3>
              <p style={{ color: "#000000ab", fontWeight: "bold" }}>
                The best artists in the world in one place, handpicked and{" "}
                <br></br> curated pieces just the way our clients like it.
              </p>
            </div>
          </div>
          {/* Artists Artist Collection*/}
          <div>
            <div className="">
              <div>
                {/* <PopularCreators creatorData={creatorData} /> */}
                <TopArtistList NftsData={creatorData} />
              </div>
            </div>
          </div>
        </div>
        {/* //Feature NFT  */}
        <div
          style={{
            background: "linear-gradient(180deg, #000 60%, #FFF 40%)",
            padding: "30px 0",
            paddingBottom: "80px",
          }}
        >
          <div>
            <div className="py-2 mb-2" style={{ margin: "0 30px" }}>
              <h3 style={{ color: "#e20ef9" }}>Featured NFTs</h3>
              <p style={{ color: "white" }}>
                These are some of the most trending collections on our NFJ
                marketplace.
              </p>
            </div>
          </div>
          <div>
            <div className="">
              <div>
                <TopFeaturedList
                  NftsData={featuredNftsData}
                  usdPrice={usdPrice}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

function TopArtistList({ NftsData }) {
  const [creatorData, setCreatorData] = useState([]);
  const [following, setFollowing] = useState([]);
  const [stateupdate, setstateupdate] = useState(false);
  const { account, active } = useWeb3React();
  useEffect(() => {
    fetch(API_ENDPOINT + "/nft/getCreators")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.nfts);
        setCreatorData(data.nfts);
      });
  }, []);
  useEffect(() => {
    if (active) {
      getData();
    }
  }, [active, stateupdate]);

  const getData = () => {
    fetch(API_ENDPOINT + "/users/" + account)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.user);
        setFollowing(data.user);
      });
  };
  const handlefollow = (followedId, followerId) => {
    if (active) {
      fetch(API_ENDPOINT + "/users/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followerId: followerId,
          followedId: followedId,
        }),
      }).then(() => setstateupdate(!stateupdate));
    }
  };
  // const handleStateUpdate = () => {
  //   setSateupdates(!sateupdates);
  // };
  const handleUnfollow = (followedId, followerId) => {
    if (active) {
      fetch(API_ENDPOINT + "/users/unfollow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followerId: followerId,
          followedId: followedId,
        }),
      })
        .then(() => setstateupdate(!stateupdate))
        .catch((err) => console.log(err));
    }
  };
  return (
    <div className="section__artists">
      <div className="">
        <div className="">
          <div className="section_body swiper_artists">
            <Slider {...settings}>
              {NftsData.map((val, index) => (
                <div
                  className="col-xl-3 col-lg-4 col-md-4 col-sm-6 mb-20"
                  key={index}
                >
                  <div className="" key={index} style={{ cursor: "pointer" }}>
                    <div
                      className="card__item 
                   "
                      style={{ padding: "20px" }}
                    >
                      <div className="card_body space-y-10">
                        <div style={{ position: "relative" }}>
                          <Link to={"/profile/" + val._id.address}>
                            <div style={{ height: "100px" }}>
                              <img
                                src={val._id.image}
                                alt="dasd"
                                width={"100%"}
                                height={"120px"}
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "10px",
                                }}
                              ></img>
                            </div>
                          </Link>

                          <div
                            style={{
                              height: "100px",
                              width: "100px",
                              margin: "0px auto",
                              position: "relative",
                              // right: "calc(20px + 31%)",
                              top: "-22px",
                              border: "4px solid white",
                              borderRadius: "999px",
                            }}
                          >
                            <img
                              src={val?._id?.image}
                              alt="dasd"
                              width={"100%"}
                              height={"100%"}
                              style={{
                                objectFit: "cover",
                                borderRadius: "999px",
                              }}
                            ></img>
                          </div>
                        </div>
                        <div
                          style={{ textAlign: "center", marginTop: "-10px" }}
                        >
                          <>
                            <Link to={"/profile/" + val?._id?.address}>
                              <div
                                style={{ fontWeight: "bolder", color: "black" }}
                              >
                                {val?._id.firstname === undefined
                                  ? "Popular"
                                  : val?._id?.firstname}{" "}
                                {val?._id?.lastname === undefined
                                  ? "Artist"
                                  : val?._id?.lastname}
                              </div>
                              <div
                                style={{
                                  color: "#828282",
                                  margin: "5px",
                                  marginBottom: "20px",
                                }}
                              >
                                @{val?._id?.username}
                              </div>
                              <div
                                className="d-flex justify-content-between py-2"
                                style={{ fontSize: "10px", color: "black" }}
                              >
                                <span>
                                  {" "}
                                  <span style={{ fontWeight: "bold" }}>
                                    {val.totalAssets}
                                  </span>{" "}
                                  NFTs
                                </span>
                                <span>
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {val?._id?.followers === undefined
                                      ? 0
                                      : val?._id.followers?.length}
                                  </span>{" "}
                                  followers
                                </span>
                              </div>
                            </Link>
                          </>
                          <div
                            onClick={() =>
                              following?.following?.includes(val?._id?.id)
                                ? handleUnfollow(val?._id?.id, following._id)
                                : handlefollow(val?._id?.id, following._id)
                            }
                            className="btn-grad btn-border "
                            style={{
                              width: "100%",
                              borderRadius: "10px",
                              padding: "10px",
                              // background: "#0a64bc",
                            }}
                          >
                            {following?.following?.includes(val?._id?.id)
                              ? "Unfollow"
                              : "Follow"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopFeaturedList({ NftsData, usdPrice }) {
  const { active } = useWeb3React();
  const settings = {
    dots: false,
    arrow: true,
    infinite: true,
    speed: 700,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: false,
    margin: 20,
    responsive: [
      {
        breakpoint: 4000,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="section__artists">
      <div className="">
        <div className="">
          <div className="section_body swiper_artists">
            <Slider {...settings}>
              {NftsData.map((val, i) => (
                <>
                  {" "}
                  {val.isHotNft && val.isApproved && (
                    <div className="" style={{ cursor: "pointer" }} key={i}>
                      <div className="card__item four">
                        <div className="card_body space-y-10">
                          <div className="card_head">
                            <div style={{ width: "100%", height: "100%" }}>
                              <img
                                src={`https://ipfs.io/ipfs/${val.image}`}
                                alt="nftimage"
                              />
                            </div>
                            {/*
                             */}
                          </div>
                          {/* =============== */}
                          <Link
                            // to="/item/eth/0x416167a30a35c59548189CCb7CeC2a2573aADE27/63185f41f36d8e5e08d7949b/0"
                            to={`/item/${getNetworkByChainID(
                              val.chainID
                            )}/${ArtisticJeweller}/${val._id}/${val.nftToken}`}
                          >
                            <h6
                              className="card_title"
                              style={{ marginTop: "1rem" }}
                            >
                              {val.nftName}
                            </h6>
                          </Link>
                          <h6
                            style={{
                              fontSize: "10px",
                              marginTop: "0.2rem",
                              color: "#0a64bc",
                            }}
                          >
                            {val?.userInfo[0]?.firstname}
                          </h6>
                          <div className="card_footer d-block space-y-10">
                            <div className="card_footer justify-content-between">
                              <div className="">
                                <p
                                  className=" d-flex flex-column"
                                  style={{ marginBottom: 0 }}
                                >
                                  <span
                                    style={{
                                      color: "#000",
                                      fontSize: "12px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Price:
                                  </span>
                                  <span
                                    className="
                                       txt_sm"
                                    style={{
                                      color: "#000",
                                      fontSize: "10px",
                                    }}
                                  >
                                    {val.price} ETH
                                    {active && (
                                      <span
                                        style={{
                                          color: "#606c82",
                                          fontSize: "10px",
                                        }}
                                      >
                                        {" "}
                                        (
                                        {parseFloat(
                                          usdPrice?.lprice * val.price
                                        ).toFixed(2)}{" "}
                                        USD )
                                      </span>
                                    )}
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
                                      src={val?.userInfo[0]?.avatar_url}
                                      alt=""
                                      width="40px"
                                      height="40px"
                                      style={{
                                        borderRadius: "9999px",
                                        objectFit: "cover",
                                      }}
                                    ></img>
                                  </div>

                                  <Link
                                    to={"/profile/" + val?.userInfo[0]?.wallet}
                                  >
                                    <div>
                                      <div
                                        style={{
                                          color: "#000",
                                          fontSize: "12px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Artist
                                      </div>
                                      <div
                                        style={{
                                          color: "#373737",
                                          fontSize: "10px",
                                        }}
                                      >
                                        @{val?.userInfo[0]?.username}
                                      </div>
                                    </div>
                                  </Link>
                                </div>
                              </div>
                            </div>
                            {/* <div className="hr" /> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopNFTList({ NftsData, usdPrice }) {
  const { active } = useWeb3React();
  const settings = {
    dots: false,
    arrow: true,
    infinite: true,
    speed: 700,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: false,
    margin: 20,
    responsive: [
      {
        breakpoint: 4000,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="section__artists">
      <div className="">
        <div className="">
          <div className="section_body swiper_artists">
            <Slider {...settings}>
              {NftsData.map((val, i) => (
                <>
                  {" "}
                  <>
                    {" "}
                    {val.isTopNft && val.isApproved && (
                      <div className="" style={{ cursor: "pointer" }} key={i}>
                        <div className="card__item four">
                          <div className="card_body space-y-10">
                            <div className="card_head">
                              <div style={{ width: "100%", height: "100%" }}>
                                <img
                                  src={`https://ipfs.io/ipfs/${val.image}`}
                                  alt="nftimage"
                                />
                              </div>
                              {/*
                               */}
                            </div>
                            {/* =============== */}
                            <Link
                              // to="/item/eth/0x416167a30a35c59548189CCb7CeC2a2573aADE27/63185f41f36d8e5e08d7949b/0"
                              to={`/item/${getNetworkByChainID(
                                val.chainID
                              )}/${ArtisticJeweller}/${val._id}/${val.nftToken
                                }`}
                            >
                              <h6
                                className="card_title"
                                style={{ marginTop: "1rem" }}
                              >
                                {val.nftName}
                              </h6>
                            </Link>
                            <h6
                              style={{
                                fontSize: "10px",
                                marginTop: "0.2rem",
                                color: "#0a64bc",
                              }}
                            >
                              {val?.userInfo[0]?.firstname}
                            </h6>
                            <div className="card_footer d-block space-y-10">
                              <div className="card_footer justify-content-between">
                                <div className="">
                                  <p
                                    className=" d-flex flex-column"
                                    style={{ marginBottom: 0 }}
                                  >
                                    <span
                                      style={{
                                        color: "#000",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Price:
                                    </span>
                                    <span
                                      className="
                                           txt_sm"
                                      style={{
                                        color: "#000",
                                        fontSize: "10px",
                                      }}
                                    >
                                      {val.price} ETH
                                      {active && (
                                        <span
                                          style={{
                                            color: "#606c82",
                                            fontSize: "10px",
                                          }}
                                        >
                                          {" "}
                                          (
                                          {parseFloat(
                                            usdPrice?.lprice * val.price
                                          ).toFixed(2)}{" "}
                                          USD )
                                        </span>
                                      )}
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
                                        src={val?.userInfo[0]?.avatar_url}
                                        alt=""
                                        width="40px"
                                        height="40px"
                                        style={{
                                          borderRadius: "9999px",
                                          objectFit: "cover",
                                        }}
                                      ></img>
                                    </div>

                                    <Link
                                      to={
                                        "/profile/" + val?.userInfo[0]?.wallet
                                      }
                                    >
                                      <div>
                                        <div
                                          style={{
                                            color: "#000",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Artist
                                        </div>
                                        <div
                                          style={{
                                            color: "#373737",
                                            fontSize: "10px",
                                          }}
                                        >
                                          @{val?.userInfo[0]?.username}
                                        </div>
                                      </div>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                              {/* <div className="hr" /> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                </>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}
const FeaturedNft = ({ NftsData, usdPrice }) => {
  console.log(NftsData[0]);
  return (
    <>
      <div className="">
        {" "}
        <div
          className="container d-none d-md-none  d-lg-flex flex-md-row"
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: "100px 50px",
            flexDirection: "column-reverse",
          }}
        >
          <div
            className=" top-home"
            style={{
              boxShadow:
                "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
              filter:
                "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));",
              backgroundColor: "white",
              borderRadius: "30px",
              width: "400px",
              height: "100%",
              Zindex: "100",
              position: "relative",
              marginRight: "-36px",
              border: "1px solid #0000000d",
              padding: "2.5rem",
            }}
          >
            <div>
              <h3>{NftsData[0]?.nftName}</h3>
            </div>
            <div>
              <>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <p className="">
                    <div
                      className="py-2 d-flex gap-2"
                      style={{ alignItems: "center" }}
                    >
                      <div>
                        <img
                          src="https://ipfs.io/ipfs/QmcggmEKiEsGmj3Pb6J1sxXvCVKSoJA2SjbwHznLTjsqpP"
                          alt=""
                          width="50px"
                          style={{ borderRadius: "999px" }}
                        ></img>
                      </div>

                      <div>
                        <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                          Founding Director
                        </div>
                        <div style={{ fontSize: "10px" }}>Ritik Chhipa</div>
                      </div>
                    </div>
                    {/* <div className="d-md-block d-lg-none">
                      <img
                        src={"https://ipfs.io/ipfs/" + NftsData[0]?.image}
                        alt=""
                        style={{ borderRadius: "999px" }}
                        width="100%"
                      ></img>
                    </div> */}
                    <br />
                    <span
                      className=""
                      style={{
                        border: "1px solid #E20EF9",
                        padding: "12px 20px",
                        paddingRight: "10px",
                        borderRadius: "5px",
                        fontSize: "20px",
                      }}
                    >
                      <span style={{ color: "#1B9F07" }}>
                        {NftsData[0]?.price}{" "}
                        {ChainsInfo[NftsData[0]?.chainID]?.CURRENCY_SYMBOL} { }{" "}
                      </span>
                      <span style={{ color: "#606c82", fontSize: "10px" }}>
                        {" "}
                        (
                        {parseFloat(
                          usdPrice?.lprice * NftsData[0]?.price
                        ).toFixed(2)}
                        ) USD
                      </span>
                    </span>
                    <div
                      style={{
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "start",
                        margin: "20px 0",
                      }}
                    >
                      <span className="">
                        <i
                          class="ri-timer-fill"
                          style={{ marginTop: "2px" }}
                        ></i>
                      </span>

                      <span>Auction ending in:</span>
                    </div>{" "}
                    <div
                      style={{
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "start",
                        marginBottom: "10px",
                      }}
                    >
                      <CounterComponent endDate={1663856616} />
                    </div>
                  </p>
                </div>
              </>
              <div
                className="d-flex gap-2 my-2"
                style={{ justifyContent: "space-between" }}
              >
                <Link
                  to={`/item/${getNetworkByChainID(
                    NftsData[0]?.chainID
                  )}/${ArtisticJeweller}/${NftsData[0]?._id}/${NftsData[0]?.nftToken
                    }`}
                >
                  <button className="btn btn-grad btn-border">Buy Now</button>
                </Link>
              </div>
            </div>
          </div>
          <div
            className="d-lg-block  p-64rem"
            style={{
              filter:
                "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));",
              boxShadow:
                "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
              borderRadius: "50px",
              height: "100%",
              backgroundColor: "white",
              border: "1px solid #0000000d",
              padding: "64px 2.5rem",
              position: "relative",
            }}
          >
            <img
              src={"https://ipfs.io/ipfs/" + NftsData[0]?.image}
              style={{ borderRadius: "12px" }}
              alt=""
              width="355px"
            ></img>
          </div>
        </div>
      </div>
    </>
  );
};
// const followUnfollowBtn = () => {};/
export default Marketplace;
