import React from "react";
import { truncateAddress } from "../../utils/service";

const HeroProfile = ({ address, userProfile }) => {
  console.log(userProfile);

  return (
    <div className="mb-100">
      <div className="hero__profile">
        <div className="cover">
          <img src={userProfile.user?.bg_image} alt="ImgPreview" />
        </div>
        <div className="infos">
          <div className="container">
            <div className="row flex-wrap align-items-center justify-content-between sm:space-y-50">
              <div className="col-md-auto mr-20">
                <div className="avatars d-flex space-x-20 align-items-center">
                  <div className="avatar_wrap">
                    <img
                      className="avatar avatar-lg"
                      src={userProfile.user?.avatar_url}
                      alt="avatar"
                    />
                  </div>
                  <h5>@{userProfile.user?.username}</h5>
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

export default HeroProfile;
