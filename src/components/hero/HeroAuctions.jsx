import React from "react";

import "reactjs-popup/dist/index.css";
const HeroAuctions = () => {
  return (
    <div className="hero_Live_Auctions" style={{ padding: "50px" }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5 col-md-12 col-sm-12 space-y-10 left_content">
            <img
              className="img-fluid"
              src="img/icons/bid-grad.png"
              alt="bid icon"
            />
            <h1 className="text-left">Live Auctions</h1>
            <p>
              Sign up to receive our monthly newsletter, featuring updates from
              the team, new decentralized applications and NFT projects, and
              trends we’re seeing in the space.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroAuctions;
