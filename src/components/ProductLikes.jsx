import React, { useState, useEffect } from "react";
import { API } from "../services/apiService";

const ProductLikes = ({ productId }) => {
	const [likes, setLikes] = useState(0);
	const [userLiked, setUserLiked] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchLikes = async () => {
			try {
				setLoading(true);
				const response = await API.get(`shop/products/${productId}/likes/`);

				setLikes(response.data.likes);
				setUserLiked(response.data.user_liked);
			} catch (err) {
				setError("Failed to load likes");
			} finally {
				setLoading(false);
			}
		};

		if (productId) {
			fetchLikes();
		}
	}, [productId]);

	const handleLikeToggle = async () => {
		try {
			const response = await API.post(`api/products/${productId}/likes/`);

			setLikes(response.data.likes);
			setUserLiked(response.data.user_liked);
		} catch (err) {
			if (err.response?.status === 401) {
				alert("Please log in to like products");
			} else {
				console.error("Error toggling like:", err);
			}
		}
	};

	return (
		<div className="flex items-center">
			<button
				onClick={handleLikeToggle}
				disabled={loading}
				className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
					userLiked
						? "bg-red-100 text-red-600 hover:bg-red-200"
						: "bg-gray-100 hover:bg-gray-200"
				}`}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className={`h-5 w-5 ${userLiked ? "text-red-600" : "text-gray-600"}`}
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
						clipRule="evenodd"
					/>
				</svg>
				<span>{loading ? "..." : likes}</span>
			</button>

			{error && <span className="text-red-500 text-sm ml-2">{error}</span>}
		</div>
	);
};

export default ProductLikes;
