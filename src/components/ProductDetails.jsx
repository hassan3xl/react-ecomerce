import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
	Star,
	Heart,
	ShoppingCart,
	Store,
	ChevronRight,
	Send,
	MessageCircle,
} from "lucide-react";
import { getProductById, getProductsByCategory } from "../services/apiService";
import Loader from "./Loader";
import { useAuth } from "../context/AuthContext";
import ProductLikes from "./ProductLikes";

const ProductDetails = () => {
	const { productId } = useParams();
	const [product, setProduct] = useState(null);
	const [relatedProducts, setRelatedProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeImage, setActiveImage] = useState(0);
	const [activeTab, setActiveTab] = useState("description");
	const { user } = useAuth();

	// Review form state
	const [reviewRating, setReviewRating] = useState(5);
	const [reviewComment, setReviewComment] = useState("");
	const [submittingReview, setSubmittingReview] = useState(false);

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				setLoading(true);
				const response = await getProductById(productId);
				setProduct(response);

				// Fetch related products from the same category
				// if (response.category && response.category.id) {
				// 	const relatedItems = await getProductsByCategory(
				// 		response.category.id
				// 	);
				// 	// Filter out the current product
				// 	setRelatedProducts(
				// 		relatedItems.filter((item) => item.id !== response.id).slice(0, 8)
				// 	);
				// }

				setLoading(false);
			} catch (err) {
				setError("Failed to load product");
				setLoading(false);
			}
		};

		if (productId) {
			fetchProduct();
		}
	}, [productId]);

	const handleReviewSubmit = async (e) => {
		e.preventDefault();
		if (!user) {
			alert("Please log in to submit a review");
			return;
		}

		try {
			setSubmittingReview(true);
			// Add your API call to submit review here
			// Example: await submitReview(productId, { rating: reviewRating, comment: reviewComment });

			// Reset form and refresh product data
			setReviewComment("");
			setReviewRating(5);

			// Refetch product to get updated reviews
			const updatedProduct = await getProductById(productId);
			setProduct(updatedProduct);

			setSubmittingReview(false);
		} catch (err) {
			alert("Failed to submit review");
			setSubmittingReview(false);
		}
	};

	if (loading) return <Loader />;
	if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
	if (!product) return <div className="text-center p-4">Product not found</div>;

	const renderStars = (rating) => {
		const stars = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 >= 0.5;

		for (let i = 0; i < 5; i++) {
			if (i < fullStars) {
				stars.push(
					<Star key={i} className="fill-yellow-400 text-yellow-400" size={16} />
				);
			} else if (i === fullStars && hasHalfStar) {
				stars.push(<Star key={i} className="text-yellow-400" size={16} />);
			} else {
				stars.push(<Star key={i} className="text-gray-300" size={16} />);
			}
		}
		return stars;
	};

	// Calculate discount percentage
	const discountPercentage = product.sale_price
		? Math.round(((product.price - product.sale_price) / product.price) * 100)
		: 0;

	return (
		<div className="max-w-6xl mx-auto bg-gray-50">
			{/* Breadcrumb */}
			<div className="flex items-center text-sm p-3 text-gray-500 bg-white border-b">
				<Link to="/" className="hover:text-red-500">
					Home
				</Link>
				<ChevronRight size={14} className="mx-1" />
				{product.category && (
					<>
						<Link
							to={`/category/${product.category.id}`}
							className="hover:text-red-500"
						>
							{product.category.title}
						</Link>
						<ChevronRight size={14} className="mx-1" />
					</>
				)}
				<span className="truncate max-w-xs">{product.name}</span>
			</div>

			<div className="bg-white p-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Product Images */}
					<div>
						<div className="border rounded-lg overflow-hidden mb-4 bg-white">
							{product.images && product.images.length > 0 ? (
								<div className="relative">
									<img
										src={product.images[activeImage]?.image_url}
										alt={product.name}
										className="w-full h-80 object-contain"
									/>
									{product.sale_price && (
										<div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
											-{discountPercentage}%
										</div>
									)}
								</div>
							) : (
								<div className="w-full h-80 bg-gray-100 flex items-center justify-center">
									<span>No image available</span>
								</div>
							)}
						</div>

						{/* Thumbnails */}
						{/* Thumbnails */}
						{product.images && product.images.length > 1 && (
							<div className="mt-2 flex gap-2 overflow-x-auto md:justify-start justify-center">
								{product.images.map((img, index) => (
									<div
										key={index}
										onClick={() => setActiveImage(index)}
										className={`w-16 h-16 border rounded-md cursor-pointer overflow-hidden flex-shrink-0 ${
											activeImage === index
												? "border-red-500 ring-2 ring-red-300"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<img
											src={img.image_url}
											alt={`Thumbnail ${index}`}
											className="w-full h-full object-cover"
										/>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Product Info */}
					<div>
						<div className="flex justify-between items-start">
							<h1 className="text-xl font-bold text-gray-800">
								{product.name}
							</h1>
							<ProductLikes productId={productId} />
						</div>

						{/* Ratings */}
						<div className="flex items-center mt-2">
							<div className="flex mr-2">
								{renderStars(product.average_rating)}
							</div>
							<span className="text-sm text-gray-500">
								({product.average_rating.toFixed(1)}) · {product.review_count}{" "}
								reviews
							</span>
						</div>

						{/* Sales */}
						<div className="mt-1">
							<span className="text-sm text-gray-600">
								{product.formatted_sales} sold
							</span>
						</div>

						{/* Price */}
						<div className="mt-4 bg-red-50 p-3 rounded-lg">
							{product.sale_price ? (
								<>
									<p className="text-3xl font-bold text-red-500">
										N {product.sale_price}
									</p>
									<div className="flex items-center mt-1">
										<p className="text-sm text-gray-500 line-through mr-2">
											N {product.price}
										</p>
										<span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
											Save N {(product.price - product.sale_price).toFixed(2)}
										</span>
									</div>
								</>
							) : (
								<p className="text-3xl font-bold text-red-500">
									N {product.price}
								</p>
							)}
						</div>

						{product.category && (
							<div className="mt-4">
								<span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
									{product.category.title}
								</span>
							</div>
						)}

						{/* Add to Cart */}
						<div className="mt-6">
							<button className="w-full bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 flex items-center justify-center font-medium">
								<ShoppingCart size={18} className="mr-2" />
								Add to Cart
							</button>
						</div>

						{/* Merchant Store Card */}
						<div className="mt-4 border rounded-lg p-3 bg-white shadow-sm">
							<div className="flex items-center">
								<div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border">
									{product.merchant.store_logo ? (
										<img
											src={product.merchant.store_logo}
											alt="Store"
											className="w-full h-full object-cover"
										/>
									) : (
										<Store
											size={24}
											className="w-full h-full p-2 text-gray-400"
										/>
									)}
								</div>
								<div className="ml-3 flex-1">
									<h3 className="font-medium">
										{product.merchant.store_name || "Official Store"}
									</h3>
									<div className="flex items-center text-xs text-gray-500 mt-1">
										<span>{product.store_rating || "4.8"} Rating</span>
										<span className="mx-2">•</span>
										<span>
											{product.merchant.store_followers || "1.2k"} Followers
										</span>
									</div>
								</div>
								<Link
									to={`/merchants/${product.merchant.id}`}
									className="px-3 py-1 border border-red-500 text-red-500 rounded-full text-sm hover:bg-red-50"
								>
									Visit Store
								</Link>
							</div>
						</div>

						{/* Likes count */}
						<div className="mt-4 flex items-center justify-center text-sm text-gray-500">
							<Heart size={16} className="mr-1" />
							<span>{product.total_likes} people like this product</span>
						</div>
					</div>
				</div>
			</div>

			{/* Product Details Tabs */}
			<div className="bg-white rounded-lg mt-3 shadow-sm mb-3">
				<div className="border-b">
					<div className="flex overflow-x-auto scrollbar-hide">
						<button
							className={`py-3 px-6 font-medium whitespace-nowrap ${
								activeTab === "description"
									? "border-b-2 border-red-500 text-red-500"
									: "text-gray-600 hover:text-gray-800"
							}`}
							onClick={() => setActiveTab("description")}
						>
							Description
						</button>
						<button
							className={`py-3 px-6 font-medium whitespace-nowrap ${
								activeTab === "reviews"
									? "border-b-2 border-red-500 text-red-500"
									: "text-gray-600 hover:text-gray-800"
							}`}
							onClick={() => setActiveTab("reviews")}
						>
							Reviews ({product.review_count})
						</button>
						<button
							className={`py-3 px-6 font-medium whitespace-nowrap ${
								activeTab === "specifications"
									? "border-b-2 border-red-500 text-red-500"
									: "text-gray-600 hover:text-gray-800"
							}`}
							onClick={() => setActiveTab("specifications")}
						>
							Specifications
						</button>
					</div>
				</div>

				{/* Tab Content */}
				<div className="p-4">
					{activeTab === "description" && (
						<div className="prose max-w-none">
							<p className="text-gray-700 leading-relaxed">
								{product.description}
							</p>
						</div>
					)}

					{activeTab === "reviews" && (
						<div>
							{/* Review Form */}
							<div className="mb-6 border-b pb-6">
								<h3 className="text-lg font-medium mb-3">Write a Review</h3>
								<form onSubmit={handleReviewSubmit}>
									<div className="mb-3">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Rating
										</label>
										<div className="flex">
											{[1, 2, 3, 4, 5].map((star) => (
												<button
													key={star}
													type="button"
													className="p-1"
													onClick={() => setReviewRating(star)}
												>
													<Star
														size={24}
														className={
															star <= reviewRating
																? "fill-yellow-400 text-yellow-400"
																: "text-gray-300"
														}
													/>
												</button>
											))}
										</div>
									</div>
									<div className="mb-3">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Comment
										</label>
										<textarea
											value={reviewComment}
											onChange={(e) => setReviewComment(e.target.value)}
											className="w-full border border-gray-300 rounded-lg p-2 min-h-20"
											placeholder="Share your experience with this product..."
											required
										/>
									</div>
									<button
										type="submit"
										disabled={submittingReview || !user}
										className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center"
									>
										<Send size={16} className="mr-2" />
										{submittingReview ? "Submitting..." : "Submit Review"}
									</button>
									{!user && (
										<p className="text-sm text-gray-500 mt-2">
											Please{" "}
											<Link to="/login" className="text-blue-500">
												log in
											</Link>{" "}
											to leave a review
										</p>
									)}
								</form>
							</div>

							{/* Existing Reviews */}
							<h3 className="text-lg font-medium mb-3">Customer Reviews</h3>
							{product.reviews && product.reviews.length > 0 ? (
								<div className="space-y-4">
									{product.reviews.map((review, index) => (
										<div key={index} className="border-b pb-4">
											<div className="flex items-center mb-1">
												<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
													{review.user_avatar ? (
														<img
															src={review.user_avatar}
															alt={review.user}
															className="w-full h-full rounded-full object-cover"
														/>
													) : (
														<span className="text-sm font-medium">
															{review.user.charAt(0)}
														</span>
													)}
												</div>
												<div>
													<span className="font-medium">{review.user}</span>
													<div className="flex items-center mt-1">
														<div className="flex mr-2">
															{renderStars(review.rating)}
														</div>
														<span className="text-xs text-gray-500">
															{new Date(review.created_at).toLocaleDateString()}
														</span>
													</div>
												</div>
											</div>
											<p className="text-gray-700 mt-2">{review.comment}</p>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8 bg-gray-50 rounded-lg">
									<MessageCircle
										size={40}
										className="mx-auto text-gray-300 mb-2"
									/>
									<p className="text-gray-500">
										No reviews yet. Be the first to review!
									</p>
								</div>
							)}
						</div>
					)}

					{activeTab === "specifications" && (
						<div className="prose max-w-none">
							<p className="text-gray-700 leading-relaxed">
								{product.specifications || "No specifications available"}
							</p>
						</div>
					)}
				</div>
			</div>

			{/* You May Also Like - Products from same category */}
			<div className="bg-white rounded-lg p-4 mb-8">
				<h2 className="text-xl font-bold mb-4">You May Also Like</h2>

				{relatedProducts.length > 0 ? (
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
						{relatedProducts.map((item) => (
							<Link
								to={`/product/${item.id}`}
								key={item.id}
								className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
							>
								<div className="relative">
									{item.images && item.images.length > 0 ? (
										<img
											src={item.images[0].image}
											alt={item.name}
											className="w-full h-40 object-cover"
										/>
									) : (
										<div className="w-full h-40 bg-gray-100 flex items-center justify-center">
											<span className="text-gray-400 text-sm">No image</span>
										</div>
									)}

									{item.sale_price && (
										<div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-sm">
											-
											{Math.round(
												((item.price - item.sale_price) / item.price) * 100
											)}
											%
										</div>
									)}
								</div>

								<div className="p-2">
									<h3 className="text-sm font-medium text-gray-800 truncate">
										{item.name}
									</h3>
									<div className="mt-1 flex items-baseline">
										<span className="text-red-500 font-bold">
											${item.sale_price || item.price}
										</span>
										{item.sale_price && (
											<span className="ml-1 text-xs text-gray-400 line-through">
												${item.price}
											</span>
										)}
									</div>
									<div className="flex items-center text-xs mt-1">
										<span className="text-yellow-500">★</span>
										<span className="ml-1">
											{item.average_rating?.toFixed(1) || "4.5"}
										</span>
										<span className="ml-2 text-gray-400">
											{item.formatted_sales || "100+"} sold
										</span>
									</div>
								</div>
							</Link>
						))}
					</div>
				) : (
					<div className="text-center py-8 bg-gray-50 rounded-lg">
						<p className="text-gray-500">No related products found</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductDetails;
