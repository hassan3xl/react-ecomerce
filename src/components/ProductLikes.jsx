import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../services/apiService";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProductLikes = ({ productId }) => {
	const [likes, setLikes] = useState(0);
	const [liked, setLiked] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { user } = useAuth();
	const navigate = useNavigate(); // for redirection

	useEffect(() => {
		const fetchLikes = async () => {
			try {
				setLoading(true);
				const response = await API.get(`shop/products/${productId}/likes/`);
				setLikes(response.data.likes);
				setLiked(response.data.user_liked);
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

	const toggleLike = async () => {
		if (!user) {
			navigate("/login"); // redirect if user not logged in
			return;
		}

		try {
			const response = await API.post(`shop/products/${productId}/likes/`);
			setLikes(response.data.likes);
			setLiked(response.data.user_liked);
		} catch (err) {
			console.error("Error toggling like:", err);
		}
	};

	return (
		<div>
			<button
				onClick={toggleLike}
				className={`p-2 rounded-full ${
					liked ? "text-red-500 bg-red-50" : "text-gray-400 hover:bg-gray-100"
				}`}
			>
				<Heart className={liked ? "fill-red-500" : ""} size={20} />
			</button>
		</div>
	);
};

export default ProductLikes;
