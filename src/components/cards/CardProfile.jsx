import React from "react";
import { Link } from "react-router-dom";
import "reactjs-popup/dist/index.css";
import { ChainsInfo } from "../../config/config-chains";
import { ArtisticJeweller } from "../../config/contract";
import { getNetworkByChainID } from "../../utils/service";

const CardProfile = ({ creatorData }) => {
  console.log(creatorData);

  return (
    <div className="row mb-30_reset">
      {creatorData.map(
        (val, i) =>
          val.isApproved && (
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
                                {ChainsInfo[val?.chainID]?.CURRENCY_SYMBOL}
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
                                  src={val.userInfo[0].avatar_url}
                                  alt=""
                                  width="40px"
                                  height="40px"
                                  style={{
                                    borderRadius: "9999px",
                                    objectFit: "cover",
                                  }}
                                ></img>
                              </div>

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
                            </div>
                          </div>
                        </div>
                        {/* <div className="hr" /> */}
                      </div>
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

export default CardProfile;
