import React, { useEffect, useState } from "react";
import useDocumentTitle from "../../../components/useDocumentTitle";
import Header from "../../../components/header/Header";
import { useWeb3React } from "@web3-react/core";
import { message, Upload } from "antd";
import axios from "axios";
import Web3 from "web3";
import { AJNFTABI } from "../../../config/abi";
import Select from "react-select";
import Swal from "sweetalert2";

import { IoCloseCircleOutline } from "react-icons/io5";
import Loading from "../../../components/Loading/Loading";
import { ChainsInfo } from "../../../config/config-chains";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { connectors } from "../../../utils/connectors";
import useAuth from "../../../hooks/useAuth";
const UploadComponent = () => {
  const { Dragger } = Upload;
  const API_ENDPOINT = "http://3.82.138.126:8000";
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [nftName, setName] = useState("");
  const { login } = useAuth();
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [isAuction, setIsAuction] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { active, library, account, chainId } = useWeb3React();
  const [categoryData, setCategoryData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [unlocakable, setUnlocakable] = useState("");
  const [formFields, setFormFields] = useState([{ name: "", value: "" }]);
  useDocumentTitle("NFJ Labs-Marketplace");
  useEffect(async () => {
    let data = await fetch(API_ENDPOINT + "/category")
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch((error) => console.error(error));
    console.log(data);
    let options = [];
    data.map((data) =>
      options.push({ value: data.categoryName, label: data.categoryName })
    );
    setCategoryData(options);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  console.log(active, chainId);
  console.log();
  const beforeUpload = (file, fileList) => {
    setFile(file);
    setPreviewURL(URL.createObjectURL(file));
    console.log(file);
    return false;
  };

  const removeUpload = (file, fileList) => {
    setFile(null);
    setPreviewURL(null);
  };

  const mintNft = async (e) => {
    e.preventDefault();
    console.log("Uploading to nft.storage...");
    let imageFormObj = new FormData();
    imageFormObj.append("image", file);
    console.log(file);

    if (selectedOption?.value && file && price > 0) {
      setIsLoading(true);
      var data = await axios
        .post(`http://3.82.138.126:3000/api/upload`, imageFormObj)
        .then((response) => {
          console.log("Image has been successfully uploaded using multer");
          return response.data;
        })
        .catch((err) => {
          console.log("Error while uploading image using multer");
        });

      const metadata = {
        title: nftName,
        description: description,
        // price: price,
        // royalties: royalties,
        image: "https://ipfs.io/" + data,
        properties: formFields,
      };
      console.log(metadata);

      // console.log(res);

      if (active) {
        var web3 = new Web3(library.provider);
        console.log(web3, ChainsInfo[chainId].NFT_ADDRESS);
        let total_price = await new web3.eth.Contract(
          AJNFTABI,
          // ArtisticJeweller
          ChainsInfo[chainId].NFT_ADDRESS
        ).methods
          .getTotalPrice(web3.utils.toWei(price.toString(), "ether"), 5)
          .call();
        console.log(total_price);
        await new web3.eth.Contract(
          AJNFTABI,
          //  ArtisticJeweller
          ChainsInfo[chainId].NFT_ADDRESS
        ).methods
          .mintNFT(
            account,
            JSON.stringify(metadata),
            web3.utils.toWei(price.toString(), "ether"),
            5,
            "0xb4D0F045EAfb4a8fD9d69E6bbde296f070512085"
          )
          .send({
            from: account,
            value: total_price,
          })
          .then(async (res) => {
            console.log(res);
            let count = await new web3.eth.Contract(
              AJNFTABI,
              // ArtisticJeweller
              ChainsInfo[chainId].NFT_ADDRESS
            ).methods
              .getTotalNFTCount()
              .call();
            fetch(API_ENDPOINT + "/nft/create", {
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                creatorAddress: account,
                ownerAddress: account,
                chainID: ChainsInfo[chainId].CHAIN_ID,
                network: ChainsInfo[chainId].CURRENCY_SYMBOL.toLowerCase(),
                image: data.cid,
                nftName: nftName,
                des: description,
                price: price,
                category: selectedOption.value,
                nftToken: parseInt(count) - 1,
                isAuction: isAuction,
                unLockableContent: unlocakable,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
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
                          <a href="">
                            <div className="btn btn-grad btn-border">
                              Mint More
                            </div>
                          </a>

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
                console.log(data);
              })
              .catch((err) => console.log(err));
            // console.log(res);
            resetValue();
          })
          .catch((err) => {
            console.log(err);
          });
      }
      setIsLoading(false);
    } else {
      Swal.fire("Warning!", "Please fill correct values .", "warning");
    }
  };

  const resetValue = () => {
    setFile(null);
    setName("");
    setDescription("");
    setPreviewURL(null);
    setPrice(0);
    setIsLoading(false);
    setSelectedOption(null);
  };
  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  };

  const submit = (e) => {
    e.preventDefault();
    console.log(formFields);
  };

  const addFields = () => {
    let object = {
      name: "",
      value: "",
    };

    setFormFields([...formFields, object]);
  };

  const removeFields = (index) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };
  return (
    <>
      {isLoading ? (
        <div className="">
          <div className="container">
            <Loading />
          </div>
        </div>
      ) : (
        <>
          <Header />
          <div className="hero__upload">
            <div className="container">
              <div className="space-y-20">
                <div
                  // to="upload-type"
                  className="btn btn-white btn-sm
                    switch"
                >
                  Create NFT
                </div>
                <h1 className="title">Create single NFT</h1>
              </div>
            </div>
          </div>
          {active ? (
            <form onSubmit={mintNft}>
              <div
                className=""
                style={{ maxWidth: "1200px", margin: "0 auto " }}
              >
                <div className="box in__upload mb-120">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="left__part space-y-40 md:mb-20 upload_file">
                        {file == null && (
                          <Dragger
                            beforeUpload={beforeUpload}
                            accept="image/png, image/gif, image/jpeg"
                          >
                            <div className="space-y-20">
                              <img
                                className="icon"
                                src={`img/icons/upload.svg`}
                                alt="upload"
                              />
                              <h5>Drag and drop your file</h5>
                              <p className="color_text">PNG, GIF, JPEG.</p>
                            </div>
                            <div className="space-y-20">
                              <p className="color_text">or choose a file</p>
                              <div to="#" className="btn btn-white">
                                Browse files
                              </div>
                            </div>
                          </Dragger>
                        )}
                        {previewURL ? (
                          <div>
                            <img src={previewURL} width="100%" alt="dasd" />
                            <button
                              onClick={removeUpload}
                              className="btn btn-dark others_btn"
                              style={{ marginTop: 20 }}
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div />
                        )}
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group space-y-10">
                        <div className="space-y-20">
                          <div className="space-y-10">
                            <span className="nameInput">Title</span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e. g. `Artistic design art`"
                              required={true}
                              defaultValue={nftName}
                              onChange={(e) => {
                                setName(e.target.value);
                              }}
                            />
                          </div>
                          <div className="space-y-10">
                            <span className="nameInput">
                              Description
                              <span className="color_text"> (optional) </span>
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e. g. `Artistic design art`"
                              maxLength="200"
                              required={false}
                              defaultValue={description}
                              onChange={(e) => {
                                setDescription(e.target.value);
                              }}
                            />
                          </div>
                          <div className="space-y-10">
                            <span className="nameInput">
                              Unlockable Content (Link or Text)
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e. g. www.example.com"
                              required={true}
                              defaultValue={unlocakable}
                              onChange={(e) => {
                                setUnlocakable(e.target.value);
                              }}
                            />
                          </div>

                          <div className="space-y-10">
                            <span className="nameInput">Price</span>
                            <input
                              type="number"
                              min={0}
                              step={0.0000001}
                              required={true}
                              className="form-control"
                              placeholder="e. g. `Price 1.25`"
                              defaultValue={price || null}
                              onChange={(e) => {
                                setPrice(e.target.value);
                              }}
                            />
                          </div>
                          <div
                            className="space-y-10"
                            style={{
                              display: "flex",
                              gap: "10px",
                              alignItems: "center",
                            }}
                          >
                            <span className="nameInput">Enable Auction</span>
                            <input
                              type="checkbox"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                margin: "0",
                              }}
                              onChange={(e) => {
                                setIsAuction(e.target.checked);
                              }}
                            />
                          </div>

                          {setIsAuction}
                          {/* <div className="space-y-10">
                            <span className="nameInput">Royalties</span>
                            <input
                              type="number"
                              disabled={true}
                              required={true}
                              className="form-control"
                              placeholder="e. g. `Royalties is 5%`"
                            />
                          </div> */}
                          <div className="space-y-10">
                            <span className="nameInput">Network</span>
                            <input
                              type="text"
                              disabled={true}
                              required={true}
                              className="form-control"
                              placeholder={ChainsInfo[chainId]?.CHAIN_NAME}
                            />
                          </div>
                          {formFields.map((form, index) => (
                            <PropertiesComp
                              form={form}
                              index={index}
                              handleFormChange={handleFormChange}
                              removeFields={removeFields}
                            />
                          ))}
                          <button
                            className="btn btn-grad
					btn_create"
                            onClick={addFields}
                          >
                            Add More..
                          </button>
                          <div className="space-y-10">
                            <span className="nameInput">Category</span>
                            <Select
                              isSearchable={false}
                              placeholder="Category"
                              options={categoryData}
                              onChange={setSelectedOption}
                              required={true}
                              defaultValue={selectedOption}
                            />
                          </div>
                          <div className="space-y-10">
                            <span className="variationInput">Collection</span>
                            <div className="d-flex flex-column flex-md-row">
                              <div className="choose_collection bg_black  ">
                                <img
                                  src={process.env.PUBLIC_URL + "logo.svg"}
                                  alt="raroin_icon"
                                  width="40px"
                                  height="40px"
                                />

                                <span className="color_white ml-10">
                                  Artistic Jewellery Collection
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <p className="color_black">
                        <span className="color_text text-bold">
                          {" "}
                          Plateform fee :{" "}
                        </span>
                        2.5%
                      </p>
                      <p className="color_black">
                        <span className="color_text text-bold ">
                          You will receive :{" "}
                          <span className="color_green">
                            {price - (price * 2.5) / 100} ETH
                          </span>
                        </span>
                      </p> */}
                      <p></p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="fixed_row bottom-0 left-0 right-0">
                <div className="container">
                  <div className="row content justify-content-between mb-20_reset">
                    <div className="col-md-auto col-12 mb-20"></div>
                    <div className="col-md-auto col-12 mb-20">
                      <button
                        to="item-details"
                        className="btn btn-grad
					btn_create"
                        type="submit"
                      >
                        Create item
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="container">
              <div>
                <div className="box edit_box ">
                  <h3 className="mb-20 text-center">
                    Please Connect to Wallet
                  </h3>
                  <div className="text-center">
                    <div
                      onClick={() => login(connectors.injected)}
                      className="text-center"
                    // onClick={update}
                    >
                      <div className="btn  btn-grad">Connect Wallet</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

const PropertiesComp = ({ form, index, handleFormChange, removeFields }) => {
  return (
    <>
      <div key={index} className="d-flex gap-4">
        <div className="space-y-10">
          <span className="nameInput">Properties</span>
          <input
            name="name"
            className="form-control"
            placeholder="Name"
            onChange={(event) => handleFormChange(event, index)}
            value={form.name}
          />
        </div>
        <div className="space-y-10">
          <span className="nameInput" style={{ color: "white" }}>
            Value
          </span>
          <input
            name="value"
            placeholder="value"
            className="form-control"
            onChange={(event) => handleFormChange(event, index)}
            value={form.value}
          />
        </div>
        <div
          onClick={() => removeFields(index)}
          style={{ alignItems: "center", cursor: "pointer" }}
        >
          <IoCloseCircleOutline size={30} />
        </div>
      </div>
    </>
  );
};
export default UploadComponent;
