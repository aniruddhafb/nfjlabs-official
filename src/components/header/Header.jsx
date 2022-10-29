import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import MobileMenu from "./Menu/MobileMenu";
import logo from "../images/logo.svg";
import MegaMenu from "./Menu/MegaMenu";
import { useWeb3React } from "@web3-react/core";
import { DisconnectWallet } from "../../Redux/actions";
import { ChainsInfo } from "../../config/config-chains";
import { ArtisticJeweller } from "../../config/contract";
import { getNetworkByChainID } from "../../utils/service";
import eth from "../../assets/icon/eth.svg";
import polygon from "../../assets/icon/polygon.png";
import bnb from "../../assets/icon/bnb.svg";
import { connectors } from "../../utils/connectors";
import useAuth from "../../hooks/useAuth";
import SwitchNetwork from "../SwitchNetwork";
const icons = {
  80001: {
    icon: polygon,
    name: "Polygon",
  },
  97: {
    icon: bnb,
    name: "BNB",
  },
  5: {
    icon: eth,
    name: "Eth",
  },
};

const Header = () => {
  const [isActive, setActive] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const API_ENDPOINT = "http://3.82.138.126:8000";

  const Search = (searchQuery) => {
    fetch(API_ENDPOINT + "/nft/search/" + searchQuery)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setSearchData(data);
        console.log(data);
      })

      .catch((err) => console.log(err));
  };
  const toggleClass = () => {
    setActive(!isActive);
  };
  const { active, deactivate, chainId, account } = useWeb3React();
  const [isVisible, setIsVisible] = useState(true);
  const { login } = useAuth();
  const ref = useRef();
  const PagesMenu = [
    {
      title: "Artists",
      link: "/artists",
    },
  ];
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  return (
    <div>
      <header
        className="header__1"
        style={{
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -2px rgb(0 0 0 / 10%)",
          zIndex: 10,
        }}
      >
        <div className="container">
          <div className="wrapper js-header-wrapper">
            <div className="header__logo">
              <Link to="/">
                <img
                  className="header__logo"
                  id="logo_js"
                  src={logo}
                  alt="logo"
                  width={150}
                />
              </Link>
            </div>
            {/* ==================  */}
            <div className="header__menu">
              <ul className="d-flex space-x-20" style={{ marginBottom: "0" }}>
                <li className="has_popup">
                  <Link
                    className="color_black "
                    style={{ fontWeight: "bold" }}
                    to="/explore"
                  >
                    Explore
                  </Link>
                </li>{" "}
                <li className="has_popup">
                  <a
                    className="color_black "
                    href="https://mv.ibentos.com/rnd/artGallary2022/"
                    target="_blank"
                    style={{ fontWeight: "bold" }}
                  >
                    Metaverse
                  </a>
                </li>
                {PagesMenu.map((val, i) => (
                  <li key={i}>
                    <Link
                      className="color_black"
                      style={{ fontWeight: "bold" }}
                      to={val.link}
                    >
                      {val.title}
                    </Link>
                  </li>
                ))}
                <li className="has_popup2">
                  <Link
                    className="color_black is_new hovered"
                    style={{ fontWeight: "bold" }}
                    to="/"
                  >
                    More <i className="ri-more-2-fill" />
                  </Link>
                  <ul
                    className="menu__popup2 space-y-20"
                    style={{ fontWeight: "bold" }}
                  >
                    <MegaMenu />
                  </ul>
                </li>
              </ul>
            </div>
            {/* ================= */}

            <div
              className="d-none  header__search position-relative"
              style={{ display: "flex" }}
            >
              <input
                type="text"
                placeholder="Search"
                style={{
                  border: "2px solid #E20EF9",
                  borderRadius: 0,
                  borderTopLeftRadius: ".375rem",
                  borderBottomLeftRadius: ".375rem",
                  borderRight: 0,
                }}
                onChange={(e) => {
                  setIsVisible(true);
                  console.log(e.target.value);
                  e.target.value.trim() !== ""
                    ? Search(e.target.value)
                    : setSearchData([]);
                }}
                onFocus={() => {
                  setSearchData([]);
                }}
              />

              <div
                className="btn-grad"
                style={{
                  width: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 0,
                  borderTopRightRadius: ".375rem",
                  borderBottomRightRadius: ".375rem",
                }}
              >
                <i className="ri-search-line" />
              </div>

              {isVisible && searchData.length > 0 && (
                <div
                  className="rounded position-absolute p-3 py-2 shadow "
                  style={{ background: "white", width: "100%", top: "50px" }}
                  ref={ref}
                >
                  {searchData.map((item, index) => (
                    <Link
                      to={`/item/${getNetworkByChainID(
                        item.chainID
                      )}/${ArtisticJeweller}/${item._id}/${item.nftToken}`}
                      onClick={() => setSearchData([])}
                    >
                      <div
                        className="d-flex border-bottom py-3"
                        style={{
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>{item.nftName}</div>
                        <div style={{ color: "#707a83", fontSize: "12px" }}>
                          {item.price}{" "}
                          {ChainsInfo[item.chainID].CURRENCY_SYMBOL}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="d-flex" style={{ alignItems: "center", gap: 5 }}>
              <div>
                <SwitchNetwork
                  url={
                    icons[chainId]?.icon ||
                    "https://static.vecteezy.com/system/resources/previews/005/556/550/non_2x/no-wireless-network-sign-symbol-icon-red-color-no-wifi-icon-free-vector.jpg"
                  }
                />
                {/* {active && (
                  <>
                    <img
                      src={
                        icons[chainId]?.icon ||
                        "https://static.vecteezy.com/system/resources/previews/005/556/550/non_2x/no-wireless-network-sign-symbol-icon-red-color-no-wifi-icon-free-vector.jpg"
                      }
                      alt={"fhsdkjfhj"}
                      width="30"
                      style={{ margin: "0 20px" }}
                    />
                  </>
                )} */}
              </div>
              <div className="header__btns">
                {!active ? (
                  <div
                    style={{
                      border: "2px solid #E20EF9",
                      color: "#000",
                      borderRadius: "5px",
                      padding: "10px 15px",
                      display: "block",
                      cursor: "pointer",
                    }}
                    onClick={() => login(connectors.injected)}
                  >
                    Connect wallet
                  </div>
                ) : (
                  <div
                    className=""
                    style={{
                      border: "2px solid #E20EF9",
                      color: "#000",
                      borderRadius: "5px",
                      padding: "10px 15px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                    onClick={
                      () => deactivate()
                      // DisconnectWallet();
                      // localStorage.setItem("bgcolor", "red");
                    }
                  >
                    {/* <i className="ri-wallet-3-line" /> */}
                    Disconnect wallet
                  </div>
                )}
              </div>
            </div>

            <div
              className="header__burger js-header-burger"
              onClick={toggleClass}
            />
            <div
              className={` header__mobile js-header-mobile  ${isActive ? "visible" : null
                } `}
            >
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
