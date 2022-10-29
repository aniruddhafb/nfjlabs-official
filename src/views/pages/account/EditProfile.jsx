import React, { useEffect, useState } from "react";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import HeroEditProfile from "../../../components/hero/HeroEditProfile";
import axios from "axios";
import useDocumentTitle from "../../../components/useDocumentTitle";
import "reactjs-popup/dist/index.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useWeb3React } from "@web3-react/core";
import Loading from "../../../components/Loading/Loading";
import { message } from "antd";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { connectors } from "../../../utils/connectors";
import useAuth from "../../../hooks/useAuth";

const EditProfile = () => {
  const update = () => toast.success("Your Profile updated");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useDocumentTitle("NFJ Labs-Marketplace");
  const API_ENDPOINT = "http://3.82.138.126:8000";
  const { account, active } = useWeb3React();
  const [creatorData, setCreatorData] = useState([]);
  const [Username, setUsername] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [FacebookUrl, setFacebookUrl] = useState("");
  const [WebsiteUrl, setWebsiteUrl] = useState("");
  const [WhatsappUrl, setWhatsappUrl] = useState("");
  const [TwitterUrl, setTwitterUrl] = useState("");
  const [bg_image, setBGImage] = useState("");
  const [avtar_image, setAvatarImage] = useState("");
  const [About, setAbout] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const { login } = useAuth();
  const [isTransactionCompleted, setIsTransactionCompleted] = useState(true);
  useEffect(() => {
    if (active) {
      fetch(API_ENDPOINT + "/users/" + account)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setStatus(data.status);
          setCreatorData(data.user);
        })
        .catch((err) => console.log(err));
    }
  }, [isTransactionCompleted, account, active, isLoading]);

  const CreateUser = async (e) => {
    e.preventDefault();
    if (active) {
      const data = {
        username: Username,
        about_details: About,
        websiteUrl: WebsiteUrl,
        facebookUrl: FacebookUrl,
        twitterUrl: TwitterUrl,
        whatsappUrl: WhatsappUrl,
        firstname: FirstName,
        lastname: LastName,
        wallet: account,
        bg_image: bg_image,
        avatar_url: avtar_image,
      };
      console.log(data);
      await axios
        .post(API_ENDPOINT + "/users/create", data)
        .then((data) => {
          console.log(data);
          message.success({
            content: (
              <>
                <div>
                  <div style={{ padding: "50px" }}>
                    <BsFillCheckCircleFill color={"#52c41a"} size={100} />
                    <h2 style={{ margin: "10px 0" }}>Success!</h2>
                    <p>
                      Your NFT has been submitted to
                      <br /> the platform and is pending
                      <br /> approval
                    </p>
                    <div className="btn btn-grad">Edit Profile</div>

                    <div className="" style={{ marginTop: "20px" }}>
                      <a href="/">Return Home</a>
                    </div>
                  </div>
                </div>
              </>
            ),
            duration: 0,
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log("in this");
    const data = {
      username: Username || creatorData.username,
      about_details: About || creatorData.about_details,
      websiteUrl: WebsiteUrl || creatorData.websiteUrl,
      facebookUrl: FacebookUrl || creatorData.facebookUrl,
      twitterUrl: TwitterUrl || creatorData.twitterUrl,
      whatsappUrl: WhatsappUrl || creatorData.whatsappUrl,
      firstname: FirstName || creatorData.firstname,
      lastname: LastName || creatorData.lastname,
      bg_image: bg_image || creatorData.bg_image,
      avatar_url: avtar_image || creatorData.avatar_url,
    };
    // console.log(data);
    await axios
      .put(API_ENDPOINT + "/users/" + account, data)
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        update();
        message.success({
          content: (
            <>
              <div>
                <div style={{ padding: "50px" }}>
                  <BsFillCheckCircleFill color={"#52c41a"} size={100} />
                  <h2 style={{ margin: "10px 0" }}>Success!</h2>
                  <p>
                    Your NFT has been submitted to
                    <br /> the platform and is pending
                    <br /> approval
                  </p>
                  <div className="btn btn-grad btn-border">Edit Profile</div>

                  <div className="" style={{ marginTop: "20px" }}>
                    <a href="/">Return Home</a>
                  </div>
                </div>
              </div>
            </>
          ),
          duration: 0,
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  } else {
    return (
      <div className="edit_profile">
        <Header />
        <HeroEditProfile data={creatorData} />

        {active ? (
          <div className="container">
            <div>
              <form
                onSubmit={(e) => {
                  status ? updateProfile(e) : CreateUser(e);
                }}
              >
                <div
                  className="box edit_box col-lg-9 space-y-30"
                  style={{ margin: "0 auto " }}
                >
                  <div className="row sm:space-y-20">
                    <div className="col-lg-6 account-info">
                      <h3 className="mb-20">Account info 💎</h3>
                      <div className="form-group space-y-10 mb-0">
                        <div className="space-y-40">
                          <div className="space-y-10">
                            <span className="nameInput">Username</span>
                            <input
                              id="txtUsername"
                              type="text"
                              className="form-control"
                              placeholder="Username"
                              defaultValue={creatorData?.username}
                              maxLength="20"
                              onChange={(e) => setUsername(e.target.value)}
                            />
                          </div>
                          <div className="space-y-10">
                            <span className="nameInput">First Name</span>
                            <input
                              id="txtFirstname"
                              type="text"
                              className="form-control"
                              placeholder="First Name"
                              defaultValue={creatorData?.firstname}
                              maxLength="20"
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </div>

                          <div className="space-y-10">
                            <span className="nameInput">Cover URL</span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Avatar URL"
                              defaultValue={creatorData?.bg_image}
                              onChange={(e) => setBGImage(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 social-media">
                      <h3 className="mb-20">Your Social media</h3>
                      <div className="form-group space-y-10">
                        <div className="space-y-40">
                          <div className="space-y-10">
                            <span className="nameInput">Avtar URL</span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Avatar URL"
                              defaultValue={creatorData?.avatar_url}
                              onChange={(e) => setAvatarImage(e.target.value)}
                            />
                          </div>
                          <div className="space-y-10">
                            <span className="nameInput">Last Name</span>
                            <input
                              id="textLastname"
                              type="text"
                              className="form-control"
                              placeholder="Last Name"
                              maxLength="20"
                              defaultValue={creatorData?.lastname}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-10">
                    <span className="nameInput">About</span>
                    <textarea
                      style={{ minHeight: 110 }}
                      placeholder="Add your bio"
                      maxLength="150"
                      defaultValue={creatorData?.about_details}
                      onChange={(e) => setAbout(e.target.value)}
                    />
                  </div>
                  <div className="row sm:space-y-20">
                    <div className="col-lg-6 account-info">
                      <h3 className="mb-20">Social Media</h3>
                      <div className="form-group space-y-10 mb-0">
                        <div className="space-y-40">
                          <div className="d-flex flex-column">
                            <span className="nameInput mb-10">Facebook</span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="facebook URL"
                              defaultValue={creatorData?.facebookUrl}
                              onChange={(e) => setFacebookUrl(e.target.value)}
                            />
                          </div>
                          <div className="d-flex flex-column">
                            <span className="nameInput mb-10">Website</span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Website URL"
                              defaultValue={creatorData?.websiteUrl}
                              onChange={(e) => setWebsiteUrl(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 social-media">
                      <h3 className="mb-20" style={{ color: "white" }}>
                        Your Social media
                      </h3>
                      <div className="form-group space-y-10">
                        <div className="space-y-40">
                          <div className="d-flex flex-column">
                            <span className="nameInput mb-10">Twitter</span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Twitter URL"
                              defaultValue={creatorData?.twitterUrl}
                              onChange={(e) => setTwitterUrl(e.target.value)}
                            />
                          </div>
                          <div className="d-flex flex-column">
                            <span className="nameInput mb-10">Youtube</span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Youtube URL"
                              defaultValue={creatorData?.whatsappUrl}
                              onChange={(e) => setWhatsappUrl(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hr" />
                  <p className="color_black">
                    To {status ? "Update" : "Create"} your settings you should
                    through your wallet. Click ' {status ? "Update" : "Create"}{" "}
                    profile' then sign the message.
                  </p>
                  <div>
                    <button type="submit" className="btn btn-grad btn-border">
                      {status ? "Update" : "Create"} Profile
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="container">
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
  }
};

export default EditProfile;
