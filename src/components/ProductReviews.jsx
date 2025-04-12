import React, { useState, useEffect } from "react";
import StarRating from "./StarRating"; // We'll create this as well
import { API } from "../services/apiService";

const ProductReviews = ({ productId }) => {
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [newReview, setNewReview] = useState({
		rating: 5,
		comment: "",
	});
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState(null);

	// Fetch reviews for the product
	useEffect(() => {
		const fetchReviews = async () => {
			try {
				setLoading(true);
				const response = await API.get(`api/products/${productId}/reviews/`);

				// Handle potential different response formats
				if (Array.isArray(response.data)) {
					setReviews(response.data);
				} else if (response.data && Array.isArray(response.data.data)) {
					setReviews(response.data.data);
				} else if (response.data && Array.isArray(response.data.reviews)) {
					setReviews(response.data.reviews);
				} else {
					setReviews([]);
				}

				setLoading(false);
			} catch (err) {
				setError("Failed to load reviews");
				setLoading(false);
			}
		};

		if (productId) {
			fetchReviews();
		}
	}, [productId]);

	// Handle input changes for new review
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewReview((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Handle rating change
	const handleRatingChange = (rating) => {
		setNewReview((prev) => ({
			...prev,
			rating,
		}));
	};

	// Submit new review
	const handleSubmitReview = async (e) => {
		e.preventDefault();

		if (!newReview.comment.trim()) {
			setSubmitError("Please enter a comment");
			return;
		}

		try {
			setSubmitting(true);
			setSubmitError(null);

			const response = await API.post(
				`api/products/${productId}/reviews/add/`,
				newReview
			);

			// Add the new review to the list
			if (response.data) {
				setReviews((prevReviews) => [response.data, ...prevReviews]);
				// Reset form
				setNewReview({
					rating: 5,
					comment: "",
				});
			}

			setSubmitting(false);
		} catch (err) {
			setSubmitError(err.response?.data?.message || "Failed to submit review");
			setSubmitting(false);
		}
	};

	return (
		<div className="mt-8">
			<h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

			{/* Review Form */}
			<div className="bg-gray-50 p-4 rounded-lg mb-6">
				<h3 className="font-medium mb-3">Write a Review</h3>

				<form onSubmit={handleSubmitReview}>
					<div className="mb-3">
						<label className="block text-sm mb-1">Rating</label>
						<StarRating
							rating={newReview.rating}
							onRatingChange={handleRatingChange}
						/>
					</div>

					<div className="mb-3">
						<label htmlFor="comment" className="block text-sm mb-1">
							Your Review
						</label>
						<textarea
							id="comment"
							name="comment"
							value={newReview.comment}
							onChange={handleInputChange}
							className="w-full border rounded p-2"
							rows="3"
							placeholder="Share your experience with this product..."
						></textarea>
					</div>

					{submitError && (
						<p className="text-red-500 text-sm mb-3">{submitError}</p>
					)}

					<button
						type="submit"
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
						disabled={submitting}
					>
						{submitting ? "Submitting..." : "Submit Review"}
					</button>
				</form>
			</div>

			{/* Reviews List */}
			{loading ? (
				<p className="text-gray-500">Loading reviews...</p>
			) : error ? (
				<p className="text-red-500">{error}</p>
			) : reviews.length === 0 ? (
				<p className="text-gray-500">
					No reviews yet. Be the first to review this product!
				</p>
			) : (
				<div className="space-y-4">
					{reviews.map((review) => (
						<div key={review.id} className="border-b pb-4">
							<div className="flex justify-between items-start">
								<div>
									<div className="flex items-center">
										<StarRating rating={review.rating} readOnly />
										<span className="ml-2 text-sm text-gray-600">
											{new Date(review.created_at).toLocaleDateString()}
										</span>
									</div>
									<p className="font-medium mt-1">
										{review.user || "Anonymous"}
									</p>
								</div>
							</div>
							<p className="mt-2 text-gray-700">{review.comment}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ProductReviews;
