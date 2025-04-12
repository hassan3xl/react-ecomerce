import React from "react";
import { Link } from "react-router-dom";

const accountLinks = () => {
	return (
		<div>
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold mb-4">Account Links</h2>
				<Link to="/account/orders" className="text-blue-500 hover:underline">
					View Orders
				</Link>
			</div>
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold mb-4">Account Links</h2>
				<Link to="/account/orders" className="text-blue-500 hover:underline">
					Coupons
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Link
					to="/account/transactions"
					className="bg-white p-4 rounded shadow hover:shadow-lg transition duration-200"
				>
					Transactions
				</Link>
				<Link
					to="/account/settings"
					className="bg-white p-4 rounded shadow hover:shadow-lg transition duration-200"
				>
					Settings
				</Link>
			</div>
		</div>
	);
};

export default accountLinks;
