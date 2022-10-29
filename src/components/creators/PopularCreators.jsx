import { useWeb3React } from "@web3-react/core";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
const API_ENDPOINT = "http://3.82.138.126:8000";

function PopularCreators() {
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
    window.scrollTo(0, 0);
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
    <div className="section__creators my-100">
      <div className="container">
        <div className="">
          <div className="section_head mb-30">
            <h2 className="section__title text-center">Popular Artist</h2>
          </div>
          <div className="section__body">
            <div className="row mb-20_reset justify-content-start">
              {creatorData.map((val, index) => (
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
                        <Link to={"/profile/" + val._id.address}>
                          <div style={{ position: "relative" }}>
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
                                src={val._id.image}
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
                        </Link>
                        <div
                          style={{ textAlign: "center", marginTop: "-10px" }}
                        >
                          <>
                            <Link to={"/profile/" + val._id.address}>
                              <div
                                style={{ fontWeight: "bolder", color: "black" }}
                              >
                                {val._id.firstname === undefined
                                  ? "Popular"
                                  : val._id.firstname}{" "}
                                {val._id.lastname === undefined
                                  ? "Artist"
                                  : val._id.lastname}
                              </div>
                              <div
                                style={{
                                  color: "#828282",
                                  margin: "5px",
                                  marginBottom: "20px",
                                }}
                              >
                                @{val._id.username}
                              </div>
                            </Link>
                          </>
                          <div
                            className="d-flex justify-content-between py-2"
                            style={{ fontSize: "10px" }}
                          >
                            <span>
                              {" "}
                              <span style={{ fontWeight: "bold" }}>
                                {val.totalAssets}
                              </span>{" "}
                              NFTs
                            </span>
                            <span>
                              <span style={{ fontWeight: "bold" }}>
                                {val._id.followers === undefined
                                  ? 0
                                  : val._id.followers.length}
                              </span>{" "}
                              followers
                            </span>
                          </div>
                          <div
                            onClick={() =>
                              following.following?.includes(val._id.id)
                                ? handleUnfollow(val._id.id, following._id)
                                : handlefollow(val._id.id, following._id)
                            }
                            className="btn-grad btn-border "
                            style={{
                              width: "100%",
                              borderRadius: "10px",
                              padding: "10px",
                              // background: "#0a64bc",
                            }}
                          >
                            {following.following?.includes(val._id.id)
                              ? "Unfollow"
                              : "Follow"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopularCreators;
