import React from "react";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import HeroPrivacy from "../../../components/hero/HeroPrivacy";
import useDocumentTitle from "../../../components/useDocumentTitle";

const PrivacyPolicy = () => {
  useDocumentTitle("Privacy Policy");
  return (
    <div>
      <Header />
      <HeroPrivacy />
      <div className="privacy__page">
        <div className="container">
          <div className="box space-y-30 my-5" style={{ padding: "60px 30px" }}>
            <div className="space-y-20">
              <h3>What information do we collect?</h3>
              <p>
                We collect information from you when you register on our site
                and gather data when you participate in the forum by reading,
                writing, and evaluating the content shared here.
                <br />
                When registering on our site, you may be asked to enter your
                name and e-mail address. You may, however, visit our site
                without registering. Your e-mail address will be verified by an
                email containing a unique link. If that link is visited, we know
                that you control the e-mail address.
                <br />
                When registered and posting, we record the IP address that the
                post originated from. We also may retain server logs which
                include the IP address of every request to our server.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
