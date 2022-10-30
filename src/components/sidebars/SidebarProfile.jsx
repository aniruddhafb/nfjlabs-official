import React from "react";

const SidebarProfile = ({ creatorData, userProfile }) => {
  return (
    <div className="profile__sidebar">
      <div className="space-y-40">
        <div className="space-y-10">
          <h5>About me</h5>
          <div className="box space-y-20">
            <p>{userProfile.user?.about_details}</p>
            <div className="row">
              <div className="col-6">
                <span className="txt_sm color_text">Creations</span>
                <h4>{creatorData?.length}</h4>
              </div>{" "}
              <div className="col-6">
                <span className="txt_sm color_text">Follower</span>
                <h4>
                  {console.log(userProfile?.user)}
                  {userProfile?.user === undefined
                    ? 0
                    : userProfile?.user.followers.length}
                </h4>
              </div>{" "}
              <div className="col-6">
                <span className="txt_sm color_text">Following</span>
                <h4>
                  {console.log(userProfile?.user)}
                  {userProfile?.user === undefined
                    ? 0
                    : userProfile?.user.following.length}
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
                    <i className="ri-twitter-line" />
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

export default SidebarProfile;
