import React from "react";
import Home1 from "../views/homes/Home1";
//  Account inner pages
import ConnectWalllet from "../views/pages/account/ConnectWalllet";
import EditProfile from "../views/pages/account/EditProfile";
import Login from "../views/pages/account/Login";
import Profile from "../views/pages/account/Profile";
import Register from "../views/pages/account/Register";

//  Blog inner pages
import Blog from "../views/pages/blog/Blog";
import Article from "../views/pages/blog/Article";

//  item inner pages

import ItemDetails from "../views/pages/item/ItemDetails";
import UploadType from "../views/pages/item/UploadType";

// NftPages
import Creators from "../views/pages/NftPages/Creators";
import LiveAuctions from "../views/pages/NftPages/LiveAuctions";
import Marketplace from "../views/pages/NftPages/Marketplace";
import Ranking from "../views/pages/NftPages/Ranking";
import UpcomingProjects from "../views/pages/NftPages/UpcomingProjects";

// other pages
import Activity from "../views/pages/others/Activity";
import Newsletter from "../views/pages/others/Newsletter";
import NoResults from "../views/pages/others/NoResults";
import PrivacyPolicy from "../views/pages/others/PrivacyPolicy";
import NotFound from "../views/NotFound";
import Chat from "../views/pages/Support/Chat";
import SubmitRequest from "../views/pages/Support/SubmitRequest";
import Faq from "../views/pages/Support/Faq";
import Forum from "../views/pages/forum/Forum";
import PostDetails from "../views/pages/forum/PostDetails";
import Contact from "../views/pages/Support/Contact";

// Route Specific
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import UploadComponent from "../views/pages/item/Upload";
import UserProfile from "../views/pages/account/UserProfile";
import Success from "../views/pages/Success";
const Routes = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Home1} />
          <Route exact path="/explore" component={Marketplace} />
          <Route path="/connect-wallet" component={ConnectWalllet} />
          <Route path="/success" component={Success} />
          <Route path="/login" component={Login} />
          <Route path="/user-profile" component={UserProfile} />
          <Route path="/profile/:address" component={Profile} />
          <Route path="/edit-profile" component={EditProfile} />
          <Route path="/register" component={Register} />
          <Route
            path="/item/:network/:address/:id/:tokenId"
            component={ItemDetails}
          />
          <Route path="/upload" component={UploadComponent} />
          <Route path="/upload-type" component={UploadType} />
          {/* <Route path="/collections" component={Collections} /> */}
          <Route path="/artists" component={Creators} />
          <Route path="/live-auctions" component={LiveAuctions} />
          <Route path="/ranking" component={Ranking} />
          <Route path="/upcoming-projects" component={UpcomingProjects} />
          <Route path="/activity" component={Activity} />

          <Route path="/privacy" component={PrivacyPolicy} />

          <Route path="/contact" component={Contact} />
          <Route path="/faq" component={Faq} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </>
  );
};

export default Routes;
