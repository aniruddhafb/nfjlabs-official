import React, { useEffect, useRef, useState } from "react";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import { Link, useParams } from "react-router-dom";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Tabs } from "antd";
import useDocumentTitle from "../../../components/useDocumentTitle";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { truncateAddress } from "../../../utils/service";
import { useWeb3React } from "@web3-react/core";
import { ChainsInfo } from "../../../config/config-chains";
import { AJNFTABI, AJNFTMARKETPLACEABI, WETHABI } from "../../../config/abi";
import { WETH } from "../../../config/contract";
import Web3 from "web3";
import Loading from "../../../components/Loading/Loading";
import Swal from "sweetalert2";
import moment from "moment";
import CounterComponent from "../../../components/CountDown/Counter";
import { connectors } from "../../../utils/connectors";
import useAuth from "../../../hooks/useAuth";
// Random component

const priceCalculator = (price, percent) => {
  let per = price * (percent / 100);
  return per + parseFloat(price);
};
const ItemDetails = () => {
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const ref = useRef();
  const closeTooltip = () => ref.current.close();
  const [isLoading, setIsLoading] = useState(true);
  const [NFTData, setNFTData] = useState({});
  const [NftHistory, setNftHistory] = useState([]);
  const [ContractNftData, setContractNftData] = useState(null);
  const [HighetBid, setHighetBid] = useState(0);
  const { id, tokenId } = useParams();
  const [DateTime, setDate] = useState(null);
  const [usdPrice, setUsdPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [NFTOwner, setNftOwner] = useState(ZERO_ADDRESS);
  const [NFTSeller, setNftSeller] = useState(ZERO_ADDRESS);
  const [NFTAuction, setNftAuction] = useState(ZERO_ADDRESS);
  const [RemainingTime, setRemainingTime] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const { account, active, library, chainId } = useWeb3React();
  const { login } = useAuth();
  const [isTransactionCompleted, setIsTransactionCompleted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const API_ENDPOINT = "http://3.82.138.126:8000";
  console.log(API_ENDPOINT);
  useEffect(() => {
    fetch(API_ENDPOINT + "/nft/assets/" + id)
      .then((res) => res.json())
      .then((data) => {
        getUserInfo(data.nft.ownerAddress, data.nft.chainID);
        setNFTData(data.nft);
      })
      .catch((err) => console.log(err));
    console.log(ChainsInfo[chainId]?.CURRENCY_SYMBOL);
    fetch(API_ENDPOINT + "/trans/" + id)
      .then((res) => res.json())
      .then((data) => {
        setNftHistory(data);
      })
      .catch((err) => console.log(err));
  }, [isTransactionCompleted, chainId, tokenId]);

  const getUserInfo = (account, chainId) => {
    fetch(API_ENDPOINT + "/users/" + account)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.user);
        setUserInfo(data.user);
      });
    fetch(
      "https://cex.io/api/last_price/" +
        ChainsInfo[chainId]?.CURRENCY_SYMBOL +
        "/USD"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUsdPrice(data);
      })
      .catch((err) => console.log(err));
  };
  const UpdateContractNFTData = async () => {
    setIsLoading(true);
    var web3 = new Web3(
      new Web3.providers.HttpProvider(ChainsInfo[chainId]?.RPC_PROVIDER_URL)
    );
    console.log(ChainsInfo[chainId]?.RPC_PROVIDER_URL);

    new web3.eth.Contract(AJNFTABI, ChainsInfo[chainId]?.NFT_ADDRESS).methods
      .storeData(tokenId)
      .call()
      .then((res) => {
        console.log(JSON.parse(res.jsonData));
        setContractNftData(JSON.parse(res.jsonData));
      });

    // // Get Owner of NFT
    new web3.eth.Contract(AJNFTABI, ChainsInfo[chainId]?.NFT_ADDRESS).methods
      .ownerOf(tokenId)
      .call()
      .then((res) => {
        // console.log(res);
        setNftOwner(res);
      });
    new web3.eth.Contract(
      AJNFTMARKETPLACEABI,
      ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS
    ).methods
      .items(tokenId)
      .call()
      .then((res) => {
        console.log(res);
        setNftSeller(res.seller);
      });

    new web3.eth.Contract(
      AJNFTMARKETPLACEABI,
      ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS
    ).methods
      .AuctionDataset(tokenId)
      .call()
      .then((res) => {
        console.log(res);
        setNftAuction(res.seller);
      });

    new web3.eth.Contract(
      AJNFTMARKETPLACEABI,
      ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS
    ).methods
      .AuctionDataset(tokenId)
      .call()
      .then(async (res) => {
        let _data = await new web3.eth.Contract(
          AJNFTMARKETPLACEABI,
          ChainsInfo[chainId]?.NFT_ADDRESS
        ).methods
          .getNFTFinalRate(parseFloat(res.highestBid).toString(), tokenId)
          .call();
        setHighetBid(parseInt(_data) / Math.pow(10, 18));
        setHighetBid(parseFloat(res.highestBid).toFixed(2) / Math.pow(10, 18));
      });

    new web3.eth.Contract(
      AJNFTMARKETPLACEABI,
      ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS
    ).methods
      .AuctionRemainingTime(tokenId)
      .call()
      .then((res) => {
        console.log(parseInt(res));
        setRemainingTime(parseInt(res));
      });
    setIsLoading(false);
  };

  useEffect(() => {
    if (active) {
      if (chainId === 80001 || chainId === 5 || chainId === 97) {
        setIsLoading(true);
        UpdateContractNFTData();
        setIsLoading(false);
      } else {
        console.log("Choose network ETH opr POLYgon");
      }
    }
    setIsLoading(false);
  }, [library, account, tokenId]);

  console.log(NFTData);

  const BuyTransaction = async () => {
    if (active) {
      setIsLoading(true);
      let web3 = new Web3(library.provider);

      console.log(library.provider);

      if (!NFTData.isAuction) {
        if (parseFloat(price) > 0) {
          await new web3.eth.Contract(
            AJNFTABI,
            ChainsInfo[chainId]?.NFT_ADDRESS
          ).methods
            .setApprovalForAll(
              ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS,
              true
            )
            .send({
              from: account,
            })
            .then(async (res) => {
              await new web3.eth.Contract(
                AJNFTMARKETPLACEABI,
                ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS
              ).methods
                .putOnSale(tokenId, web3.utils.toWei(price.toString(), "ether"))
                .send({
                  from: account,
                })
                .then((res) => {
                  fetch(API_ENDPOINT + "/nft/" + id, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      price: price,
                    }),
                  });
                  fetch(API_ENDPOINT + "/trans/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      amount: price,
                      transHash: res.transactionHash,
                      event: "putOnSale",
                      nftassets: id,
                    }),
                  });

                  fetch(API_ENDPOINT + "/nft/put-on-sale", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      id: id,
                      isMarketplace: true,
                    }),
                  });
                })
                .catch((err) => {
                  setIsLoading(false);
                });
            })
            .catch((err) => {
              setIsLoading(false);
            });

          await UpdateContractNFTData();
          setIsTransactionCompleted(!isTransactionCompleted);
          setIsLoading(false);
        } else {
          Swal.fire("Warning", "Please enter correct price.", "warning");
        }
      } else {
        await putNftOnAuctionMarketplace();
      }
    }
    setIsLoading(false);
  };

  const RemoveTransaction = async () => {
    if (active) {
      let web3 = new Web3(library.provider);
      setIsLoading(true);
      await new web3.eth.Contract(
        AJNFTMARKETPLACEABI,
        ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS
      ).methods
        .removeFromSale(tokenId)
        .send({
          from: account,
        })
        .then((res) => {
          fetch(API_ENDPOINT + "/nft/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              price: price,
            }),
          });
          fetch(API_ENDPOINT + "/trans/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: price,
              transHash: res.transactionHash,
              event: "removeFromSale",
              nftassets: id,
            }),
          });
          fetch(API_ENDPOINT + "/nft/put-on-sale", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: id,
              isMarketplace: false,
            }),
          });
        })
        .catch((err) => {
          setIsLoading(false);
        });
      await UpdateContractNFTData();
      setIsTransactionCompleted(!isTransactionCompleted);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const PurchaseNFT = async () => {
    console.log(price);
    if (active) {
      setIsLoading(true);
      var web3 = new Web3(library.provider);
      await new web3.eth.Contract(
        AJNFTMARKETPLACEABI,
        ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS
      ).methods
        .getNFTFinalRate(
          web3.utils.toWei(NFTData?.price.toString(), "ether"),
          tokenId
        )
        .call()

        .then(async (data) => {
          await new web3.eth.Contract(
            AJNFTMARKETPLACEABI,
            ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS
          ).methods
            .purchaseNFT(tokenId)
            .send({
              from: account,
              value: data,
            })
            .then((res) => {
              fetch(API_ENDPOINT + "/nft/" + id, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ownerAddress: account,
                }),
              });
              fetch(API_ENDPOINT + "/trans/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  amount: NFTData?.price,
                  transHash: res.transactionHash,
                  event: "buy",
                  nftassets: id,
                }),
              });
              fetch(API_ENDPOINT + "/nft/put-on-sale", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: id,
                  isMarketplace: false,
                }),
              });
            })
            .catch((err) => {
              setIsLoading(false);
            });
        })
        .catch((err) => {
          setIsLoading(false);
        });

      await UpdateContractNFTData();
      setIsTransactionCompleted(!isTransactionCompleted);
    }

    setIsLoading(false);
  };

  useDocumentTitle("Item Details");

  // For Auction
  const putNftOnAuctionMarketplace = async () => {
    if (active) {
      setIsLoading(true);
      let web3 = new Web3(library.provider);

      console.log(NFTData.isAuction);

      if (parseFloat(price) > 0) {
        let balance = await new web3.eth.Contract(WETHABI, WETH).methods
          .balanceOf(account)
          .call();

        // if (parseInt(balance) / Math.pow(10, 18) >= price) {
        await new web3.eth.Contract(
          AJNFTABI,
          ChainsInfo[chainId]?.NFT_ADDRESS
        ).methods
          .setApprovalForAll(ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS, true)
          .send({
            from: account,
          })
          .then(async (res) => {
            console.log(new Date(DateTime).getTime() / 1000);
            await new web3.eth.Contract(
              AJNFTMARKETPLACEABI,
              ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS
            ).methods
              .putOnAuction(
                tokenId,
                web3.utils.toWei(price.toString(), "ether"),
                new Date(DateTime).getTime() / 1000
              )
              .send({
                from: account,
              })
              .then((res) => {
                fetch(API_ENDPOINT + "/nft/" + id, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    price: price,
                    ownerAddress: account,
                  }),
                });
                fetch(API_ENDPOINT + "/trans/create", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    amount: price,
                    transHash: res.transactionHash,
                    event: "putOnAuction",
                    nftassets: id,
                  }),
                });
                fetch(API_ENDPOINT + "/nft/put-on-sale", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    id: id,
                    isMarketplace: true,
                  }),
                });
              })
              .catch((err) => {
                setIsLoading(false);
              });
          })
          .catch((err) => {
            setIsLoading(false);
            console.log(err);
          });

        await UpdateContractNFTData();
        setIsTransactionCompleted(!isTransactionCompleted);
        setIsLoading(false);
        // } else {
        //   Swal.fire("Warning", "You don't have sufficent fund", "warning");
        // }
      } else {
        Swal.fire("Warning", "Please enter correct price.", "warning");
      }
    }
    setIsLoading(false);
  };

  const transferNftOnAuction = async () => {
    if (active) {
      let web3 = new Web3(library.provider);
      setIsLoading(true);
      let atEnd = await new web3.eth.Contract(
        AJNFTMARKETPLACEABI,
        ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS
      ).methods
        .AuctionRemainingTime(tokenId)
        .call();

      if (parseInt(atEnd) < parseInt(new Date().getTime() / 1000)) {
        await new web3.eth.Contract(
          AJNFTMARKETPLACEABI,
          ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS
        ).methods
          .transferToHigherBidder(tokenId)
          .send({
            from: account,
          })
          .then((res) => {
            fetch(API_ENDPOINT + "/nft/" + id, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                price: price,
              }),
            });
            fetch(API_ENDPOINT + "/trans/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: price,
                transHash: res.transactionHash,
                event: "removeFromAuctionSale",
                nftassets: id,
              }),
            });
            fetch(API_ENDPOINT + "/nft/put-on-sale", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: id,
                isMarketplace: false,
              }),
            });
          })
          .catch((err) => {
            setIsLoading(false);
          });
        await UpdateContractNFTData();
        setIsTransactionCompleted(!isTransactionCompleted);
        setIsLoading(false);
      } else {
        Swal.fire("Warning", "Auction is not ended.", "warning");
      }
    }
    setIsLoading(false);
  };

  const purchaseNftOnAuctionMarketplace = async () => {
    if (active) {
      setIsLoading(true);
      var web3 = new Web3(library.provider);
      let auctionData = await new web3.eth.Contract(
        AJNFTMARKETPLACEABI,
        ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS
      ).methods
        .AuctionDataset(tokenId)
        .call();

      let auctionBids = await new web3.eth.Contract(
        AJNFTMARKETPLACEABI,
        ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS
      ).methods
        .bids(tokenId, account)
        .call();
      console.log(auctionBids);
      if (parseInt(auctionBids) === 0) {
        let balance = await new web3.eth.Contract(WETHABI, WETH).methods
          .balanceOf(account)
          .call();

        if (parseInt(balance) / Math.pow(10, 18) >= price) {
          await new web3.eth.Contract(WETHABI, WETH).methods
            .approve(
              ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS,
              web3.utils.toWei(price.toString(), "ether")
            )
            .send({
              from: account,
            });
          await new web3.eth.Contract(
            AJNFTMARKETPLACEABI,
            ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS
          ).methods
            .bid(tokenId, web3.utils.toWei(price.toString(), "ether"))
            .send({
              from: account,
            })
            .then((res) => {
              fetch(API_ENDPOINT + "/trans/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  amount: NFTData?.price,
                  transHash: res.transactionHash,
                  event: "buy",
                  nftassets: id,
                }),
              });
            })
            .catch((err) => {
              setIsLoading(false);
            });
        } else {
          Swal.fire("Warning", "You don't have sufficent fund", "warning");
        }
      } else {
        alert("Youu have already bid");
      }
      await UpdateContractNFTData();
      setIsTransactionCompleted(!isTransactionCompleted);
    }

    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (NFTOwner === ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS) {
      if (NFTData.isAuction) {
        if (NFTAuction === account) {
          transferNftOnAuction();
        } else {
          var web3 = new Web3(library.provider);
          let _price = await new web3.eth.Contract(
            AJNFTMARKETPLACEABI,
            ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS
          ).methods
            .getNFTFinalRate(
              web3.utils.toWei(price.toString(), "ether"),
              tokenId
            )
            .call();

          if (HighetBid < price) {
            purchaseNftOnAuctionMarketplace();
          } else {
            Swal.fire("warning", "Please put Highest Bid", "warning");
          }
        }
      } else if (NFTSeller === account) {
        RemoveTransaction();
      } else {
        PurchaseNFT();
      }
    } else {
      if (NFTOwner === account) {
        BuyTransaction();
      }
      if (!active) {
        login(connectors.injected);
      } else {
        console.log("Not Listed ");
      }
    }
  };
  const TabPanelFrom = () => {
    return (
      <>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: `Offers`,
              key: "1",
              children: `No Offers`,
            },
            {
              label: `History`,
              key: "2",
              children: (
                <>
                  <div>
                    {NftHistory.map((value, data) => (
                      <div className="d-flex  align-center my-4">
                        <div className="ml-2">
                          <div>
                            <span style={{ fontWeight: "bold" }}>
                              {value.event.toLowerCase()}{" "}
                            </span>
                            Trans hash{" "}
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={
                                "https://ropsten.etherscan.io/tx/" +
                                value.transHash
                              }
                            >
                              <span style={{ fontWeight: "bold" }}>
                                {truncateAddress(value.transHash)}
                              </span>
                            </a>
                          </div>
                          <div style={{ fontWeight: "bold" }}>
                            {moment(value.updatedAt).format("MMMM Do YYYY")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ),
            },
            {
              label: `Properties`,
              key: "3",
              children: (
                <>
                  <div>
                    {ContractNftData?.properties && (
                      <>
                        <div className="d-flex gap-3 flex-wrap ">
                          {ContractNftData?.properties.map((items, value) => (
                            <>
                              <div
                                className="border py-3 px-4  border-primary rounded min-w-10"
                                style={{
                                  background: "#15b2e50f",
                                  border: "1px solid rgb(21, 178, 229)",
                                  textAlign: "center",
                                }}
                              >
                                <div
                                  style={{
                                    color: "#15b2e5",
                                    fontSize: "16px",
                                  }}
                                >
                                  {items.name}
                                </div>
                                <div style={{ color: "#353840" }}>
                                  {items.value}
                                </div>
                              </div>
                            </>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </>
              ),
            },
          ]}
        />
      </>
    );
  };

  return (
    <div style={{ background: "white" }}>
      <Header />
      <div className="container">
        <Link to="/explore" className="btn btn-white btn-sm my-40">
          Back to home
        </Link>
        {isLoading ? (
          <div>
            <Loading />
          </div>
        ) : (
          <div className="item_details my-10 ">
            <div
              className="row sm:space-y-20"
              style={{ justifyContent: "center", gap: "25px" }}
            >
              <div className="col-md-4">
                <div>
                  <div className="shadow-lg item_img p-3">
                    <img
                      className="item_img"
                      src={`https://ipfs.io/ipfs/${NFTData?.image}`}
                      alt="ImgPreview"
                    />
                  </div>
                  <div className="my-4">
                    <div>
                      <h3>Description:</h3>
                      <p>{NFTData?.des}</p>
                    </div>
                    <div className="my-4">
                      <ul style={{ fontWeight: "500", color: "#766767" }}>
                        <li>
                          Contract Address:{" "}
                          {truncateAddress(ChainsInfo[chainId]?.NFT_ADDRESS)}
                        </li>
                        <li>TokenID: {tokenId}</li>
                        <li>Token Standard: ERC-721</li>
                        <li>Blockchain: {NFTData?.network}</li>
                        {/* <li>Metadata: Centerlized</li> */}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="space-y-20">
                  <h3>{NFTData?.nftName}</h3>

                  {/* <p>{NFTData?.des}</p> */}
                  <div>
                    {" "}
                    {!NFTData?.isAuction && (
                      <p className="">
                        Price:
                        <br />
                        <span style={{ color: "#1B9F07" }}>
                          {NFTData?.price}{" "}
                          {ChainsInfo[NFTData?.chainID]?.CURRENCY_SYMBOL}
                        </span>
                        <br />
                        <span style={{ color: "#606c82" }}>
                          $
                          {parseFloat(usdPrice.lprice * NFTData?.price).toFixed(
                            2
                          )}{" "}
                          USD
                        </span>
                      </p>
                    )}
                  </div>

                  {NFTData?.isAuction && (
                    <>
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <p className="">
                          Price:
                          <br />
                          <span style={{ color: "#1B9F07" }}>
                            {HighetBid.toFixed(5)}{" "}
                            {ChainsInfo[NFTData?.chainID]?.CURRENCY_SYMBOL}
                          </span>
                          <br />
                          <span style={{ color: "#606c82" }}>
                            $
                            {parseFloat(
                              usdPrice.lprice * NFTData?.price
                            ).toFixed(2)}
                          </span>
                        </p>
                        <p style={{ textAlign: "end" }}>
                          <div
                            style={{
                              alignItems: "center",
                              display: "flex",
                              justifyContent: "end",
                              marginBottom: "10px",
                            }}
                          >
                            <i class="ri-timer-fill"></i>
                            <span>Auction ending in:</span>
                          </div>{" "}
                          <CounterComponent endDate={RemainingTime} />
                        </p>
                      </div>
                    </>
                  )}

                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {" "}
                    <div className="avatars space-x-5">
                      <div className="media">
                        <div className="badge">
                          <img
                            className="badge"
                            src="img/icons/Badge.svg"
                            alt="ImgPreview"
                          />
                        </div>

                        <Link to={"/profile/" + userInfo?.wallet}>
                          <img
                            src={userInfo?.avatar_url}
                            alt="Avatar"
                            className="avatar avatar-sm"
                            width={20}
                          />
                        </Link>
                      </div>
                      <div>
                        <Link to={"/profile/" + userInfo?.wallet}>
                          <div>
                            <p
                              className="avatars_name color_black"
                              style={{ margin: 0 }}
                            >
                              Owner
                            </p>
                            <p
                              className="avatars_name"
                              style={{ margin: 0, color: "#707070" }}
                            >
                              @{userInfo?.username}
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <a href={NFTData.unLockableContent}>Unlockable Content</a>

                  <div className="d-flex justify-content-between">
                    <a
                      href={`https://ipfs.io/ipfs/${NFTData?.image}`}
                      target="_blank"
                      style={{
                        border: "1px solid black",
                        padding: "10px",
                        borderRadius: "999px",
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <img
                          width={40}
                          src={
                            process.env.PUBLIC_URL + "/img/icons/ipfs-share.svg"
                          }
                          alt="dashghg"
                        />
                      </div>
                      <div style={{ fontBold: "10px", color: "black" }}>
                        View on IPFS
                      </div>
                    </a>

                    <div className="d-flex space-x-20">
                      {active ? (
                        NFTOwner ===
                        ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS ? (
                          NFTData.isAuction ? (
                            NFTAuction === account ? null : null
                          ) : NFTSeller === account ? null : null
                        ) : NFTOwner === account ? null : ( // <div>{"Not Listed"}</div>
                          <button className="btn btn-lg  btn-grad">
                            <div>Not Listed</div>
                          </button>
                        )
                      ) : null}
                      <Popup
                        className="custom"
                        ref={ref}
                        trigger={
                          <div>
                            {active ? (
                              NFTOwner ===
                              ChainsInfo[chainId]?.NFT_MARKETPLACE_ADDRESS ? (
                                NFTData.isAuction ? (
                                  NFTAuction === account ? (
                                    <button className="btn btn-lg  btn-grad">
                                      <div>Transfer NFT</div>
                                    </button>
                                  ) : (
                                    <button className="btn btn-lg  btn-grad">
                                      <div>Place Bid</div>
                                    </button>
                                  )
                                ) : NFTSeller === account ? (
                                  <button className="btn btn-lg  btn-grad">
                                    {" "}
                                    <div>Remove Sale</div>
                                  </button>
                                ) : (
                                  <button className="btn btn-lg  btn-grad">
                                    <div>Buy Now</div>
                                  </button>
                                )
                              ) : NFTOwner === account ? (
                                <button className="btn btn-lg  btn-grad">
                                  <div>
                                    {NFTData.isAuction
                                      ? "Put On Auction"
                                      : "Put on Sale"}
                                  </div>
                                </button>
                              ) : // <div>{"Not Listed"}</div>
                              undefined
                            ) : (
                              <button className="btn btn-lg  btn-grad">
                                <div>Connect Wallet</div>
                              </button>
                            )}
                          </div>
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
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleSubmit();
                                }}
                              >
                                <div className="space-y-20">
                                  <h3>Checkout</h3>

                                  {active ? (
                                    NFTOwner ===
                                    ChainsInfo[chainId]
                                      ?.NFT_MARKETPLACE_ADDRESS ? (
                                      NFTData.isAuction ? (
                                        NFTAuction === account ? (
                                          <>
                                            <p>
                                              You can transfer nft to higher
                                              bidder{" "}
                                              {/* <span className="color_black">
                                                {NFTData?.nftName}{" "}
                                              </span>
                                              from{" "}
                                              <span className="color_black">
                                                {truncateAddress(
                                                  NFTData?.ownerAddress
                                                )} */}
                                              {/* </span> */}
                                            </p>
                                          </>
                                        ) : (
                                          <>
                                            <p>
                                              You are about to bid on{" "}
                                              <span className="color_black">
                                                {NFTData?.nftName}{" "}
                                              </span>
                                              from{" "}
                                              <span className="color_black">
                                                {truncateAddress(
                                                  NFTData?.ownerAddress
                                                )}
                                              </span>
                                            </p>
                                            <div className="space-y-10">
                                              <p>Set minimum bid value</p>
                                              <input
                                                type="text"
                                                min={NFTData?.price}
                                                className="form-control"
                                                defaultValue={
                                                  NFTData?.price || null
                                                }
                                                onChange={(e) => {
                                                  setPrice(e.target.value);
                                                }}
                                                placeholder="00.00 ETH"
                                              />
                                            </div>
                                          </>
                                        )
                                      ) : NFTSeller === account ? (
                                        <>
                                          <p>
                                            Click on Remove on auction button
                                            for remove{" "}
                                            <span className="color_black">
                                              {NFTData?.nftName}{" "}
                                            </span>
                                            from{" "}
                                            <span className="color_black">
                                              {truncateAddress(
                                                NFTData?.ownerAddress
                                              )}
                                            </span>
                                          </p>
                                        </>
                                      ) : (
                                        <p>
                                          Click on Buy Now on auction button for
                                          remove{" "}
                                          <span className="color_black">
                                            {NFTData?.nftName}{" "}
                                          </span>
                                          from{" "}
                                          <span className="color_black">
                                            {truncateAddress(
                                              NFTData?.ownerAddress
                                            )}
                                          </span>
                                        </p>
                                      )
                                    ) : NFTOwner === account ? (
                                      NFTData.isAuction ? (
                                        <>
                                          <p>
                                            You are about to put on auction{" "}
                                            <span className="color_black">
                                              {NFTData?.nftName}{" "}
                                            </span>
                                            from{" "}
                                            <span className="color_black">
                                              {truncateAddress(
                                                NFTData?.ownerAddress
                                              )}
                                            </span>
                                          </p>
                                          <div className="space-y-10">
                                            <p>Set minimum bid value</p>
                                            <input
                                              type="number"
                                              className="form-control"
                                              defaultValue={price || null}
                                              step="0.0000001"
                                              onChange={(e) => {
                                                setPrice(e.target.value);
                                              }}
                                              placeholder="00.00 ETH"
                                            />
                                            <input
                                              type="date"
                                              className="form-control"
                                              defaultValue={DateTime || null}
                                              onChange={(e) => {
                                                setDate(e.target.value);
                                              }}
                                              placeholder="Date"
                                            />
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <p>
                                            You are about to put on sale{" "}
                                            <span className="color_black">
                                              {NFTData?.nftName}
                                            </span>
                                            from{" "}
                                            <span className="color_black">
                                              {truncateAddress(
                                                NFTData?.ownerAddress
                                              )}
                                            </span>
                                          </p>
                                          <div className="space-y-10">
                                            <p>You pay</p>
                                            <input
                                              type="text"
                                              className="form-control"
                                              defaultValue={price || null}
                                              onChange={(e) => {
                                                setPrice(e.target.value);
                                              }}
                                              placeholder="00.00 ETH"
                                            />
                                          </div>

                                          <div className="hr" />
                                          <div className="d-flex justify-content-between">
                                            <p> You must bid at least:</p>
                                            <p className="text-right color_black txt _bold">
                                              {price} ETH
                                            </p>
                                          </div>
                                          <div className="d-flex justify-content-between">
                                            <p> service free:</p>
                                            <p className="text-right color_black txt _bold">
                                              {price} ETH /
                                            </p>
                                            <span className="color-grey">
                                              {" "}
                                              $
                                              {parseFloat(
                                                price * usdPrice.lprice
                                              ).toFixed(2)}
                                            </span>
                                          </div>
                                          <div className="d-flex justify-content-between">
                                            <p> Total bid amount:</p>
                                            <p className="text-right color_black txt _bold">
                                              {parseFloat(
                                                priceCalculator(price, 2.5)
                                              )}{" "}
                                              ETH
                                            </p>
                                          </div>
                                        </>
                                      )
                                    ) : (
                                      <p>
                                        NFT is not listed by owner{" "}
                                        <span className="color_black">
                                          {truncateAddress(
                                            NFTData?.ownerAddress
                                          )}
                                        </span>
                                        .
                                      </p>
                                    )
                                  ) : (
                                    <p>Please Connect to wallet.</p>
                                  )}
                                  <button
                                    type="submit"
                                    className="btn w-full btn-grad"
                                    aria-label="Close"
                                  >
                                    {active ? (
                                      NFTOwner ===
                                      ChainsInfo[chainId]
                                        ?.NFT_MARKETPLACE_ADDRESS ? (
                                        NFTData.isAuction ? (
                                          NFTAuction === account ? (
                                            <div>
                                              Transfer NFT to Higher Bidder
                                            </div>
                                          ) : (
                                            <div>Place Bid</div>
                                          )
                                        ) : NFTSeller === account ? (
                                          <div>Remove Sale</div>
                                        ) : (
                                          <div>Buy Now</div>
                                        )
                                      ) : NFTOwner === account ? (
                                        <div>
                                          {NFTData.isAuction
                                            ? "Put On Auction"
                                            : "Put on Sale"}
                                        </div>
                                      ) : (
                                        <div>{"Not Listed"}</div>
                                      )
                                    ) : (
                                      "Connect Wallet"
                                    )}
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </div>
                  </div>
                  <div style={{ marginTop: "80px" }}>
                    <TabPanelFrom />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ItemDetails;
