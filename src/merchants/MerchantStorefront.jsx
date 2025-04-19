import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { API } from "../services/apiService";

const MerchantStorefront = () => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const { merchantId } = useParams();

	const fetchStore = async () => {
		try {
			const res = await API.get(`/shop/merchants/${merchantId}/`);
			setData(res.data);
			console.log(res);
		} catch (err) {
			console.error("Failed to fetch store:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleFollow = async () => {
		try {
			await API.post(`/shop/merchants/${merchantId}/follow/`);
			fetchStore();
		} catch (err) {
			console.error("Error following:", err);
		}
	};

	const handleUnfollow = async () => {
		try {
			await API.post(`/shop/merchants/${merchantId}/unfollow/`);
			fetchStore();
		} catch (err) {
			console.error("Error unfollowing:", err);
		}
	};

	useEffect(() => {
		fetchStore();
	}, []);

	if (loading || !data) return <div className="p-4">Loading...</div>;

	const { merchant, products, reviews, is_following } = data;

	return (
		<div className="max-w-6xl mx-auto p-4">
			{/* Store Header */}
			<div className="flex items-center space-x-6 mb-6">
				<img
					src={merchant.store_logo}
					alt={merchant.store_name}
					className="w-24 h-24 rounded-full object-cover"
				/>
				<div>
					<h1 className="text-2xl font-bold">{merchant.store_name}</h1>
					<p className="text-sm text-gray-500">{merchant.store_description}</p>
					<p className="mt-1 text-gray-600">
						⭐ {merchant.average_rating} ({merchant.rating_count} reviews) •{" "}
						{merchant.follower_count} followers
					</p>
					{is_following ? (
						<button
							onClick={handleUnfollow}
							className="mt-2 px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
						>
							Unfollow
						</button>
					) : (
						<button
							onClick={handleFollow}
							className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
						>
							Follow
						</button>
					)}
				</div>
			</div>

			{/* Products */}
			<h2 className="text-xl font-semibold mb-4">Products</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"></div>

			{/* Reviews */}
			<h2 className="text-xl font-semibold mt-10 mb-4">Customer Reviews</h2>
			<div className="space-y-4"></div>
		</div>
	);
};

export default MerchantStorefront;
