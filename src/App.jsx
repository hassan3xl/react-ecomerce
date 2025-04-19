import React from "react";
import Login from "./Auth/Login";
import UserProfile from "./Auth/UserProfile";

// accounts
import Dashboard from "./account/Dashboard";
import {
	BrowserRouter as Router,
	Routes,
	Navigate,
	Route,
} from "react-router-dom";
import HomePage from "./components/HomePage";
// import ProductDetailss from "./components/ZProductsDetails";
import ProductDetails from "./components/ProductDetails";

import ProductsList from "./components/ProductsList";
import Merchantstore from "./components/MerchantStore";
import Navbar from "./components/Navbar";

import Orders from "./account/Orders";
import EmailVerify from "./Auth/EmailVerify";
import MerchantStorefront from "./merchants/MerchantStorefront";
import AllMerchants from "./merchants/AllMerchants";

const App = () => {
	return (
		<div>
			<Router>
				<Navbar />
				{/* <GoogleAuthNav /> */}
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<Login />}></Route>
					<Route path="/verify-email/:key" element={<EmailVerify />} />

					<Route path="/products" element={<ProductsList />}></Route>
					<Route path="/profile" element={<UserProfile />}></Route>

					{/* oACCOUNT AND ORDERS? */}
					<Route path="/account" element={<Dashboard />}></Route>
					<Route path="/account/orders/" element={<Orders />}></Route>

					<Route path="/products/:productId" element={<ProductDetails />} />

					<Route
						path="/merchants/:merchantId/"
						element={<MerchantStorefront />}
					/>
					<Route path="/merchants/" element={<AllMerchants />}></Route>

					{/* <Route path="/merchant/:merchantId/" element={<MerchantPage />} /> */}
				</Routes>
			</Router>
		</div>
	);
};

export default App;
