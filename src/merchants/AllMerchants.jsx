import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // or next/link if you're using Next.js
import { API } from "../services/apiService";

const AllMerchants = () => {
	const [merchants, setMerchants] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchMerchants = async () => {
		try {
			const res = await API.get("/shop/merchants/");
			console.log("API response:", res.data); // 👈 check this!
			setMerchants(res.data.results);
		} catch (err) {
			console.error("Failed to fetch merchants:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMerchants();
	}, []);

	if (loading) return <div className="p-4">Loading merchants...</div>;

	return (
		<div className="max-w-6xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6">All Merchants</h1>
			{merchants.length === 0 ? (
				<p>No merchants found.</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					{merchants.map((merchant) => (
						<Link
							to={`/merchants/${merchant.id}`}
							key={merchant.id}
							className="border rounded-xl p-4 shadow hover:shadow-md transition"
						>
							<div className="flex items-center space-x-4">
								<img
									src={merchant.store_logo || "https://via.placeholder.com/80"}
									alt={merchant.store_name}
									className="w-16 h-16 rounded-full object-cover"
								/>
								<div>
									<h2 className="text-lg font-semibold">
										{merchant.store_name}
									</h2>
									<p className="text-sm text-gray-500">
										{merchant.average_rating}⭐ ({merchant.rating_count}{" "}
										reviews)
									</p>
									<p className="text-sm text-gray-600">
										{merchant.follower_count} followers
									</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default AllMerchants;
