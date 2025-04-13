import React from "react";
import Navbar from "./components/Navbar";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import UserProfile from "./Auth/UserProfile";

// accounts
import Dashboard from "./account/Dashboard";
import {
	BrowserRouter as Router,
	Routes,
	Navigate,
	Route,
} from "react-router-dom";
import Home from "./components/Home";
// import ProductDetailss from "./components/ZProductsDetails";
import ProductDetails from "./components/ProductDetails";

import ProductsList from "./components/ProductsList";
import Merchantstore from "./components/MerchantStore";
import GoogleAuthNav from "./components/GoogleAuthNav";
import MerchantPage from "./merchants/MerchantPage";
import Orders from "./account/Orders";

const App = () => {
	return (
		<div>
			<Router>
				{/* <Navbar /> */}
				<GoogleAuthNav />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />}></Route>
					<Route path="/register" element={<Register />}></Route>
					<Route path="/products" element={<ProductsList />}></Route>
					<Route path="/profile" element={<UserProfile />}></Route>

					{/* oACCOUNT AND ORDERS? */}
					<Route path="/account" element={<Dashboard />}></Route>
					<Route path="/account/orders/" element={<Orders />}></Route>

					<Route path="/products/:productId" element={<ProductDetails />} />

					<Route
						path="/merchant/:merchantId/store"
						element={<Merchantstore />}
					/>
					{/* <Route path="/merchant/:merchantId/" element={<MerchantPage />} /> */}
				</Routes>
			</Router>
		</div>
	);
};

export default App;
