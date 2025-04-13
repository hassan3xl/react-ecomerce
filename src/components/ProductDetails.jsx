import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
	Star,
	Heart,
	ShoppingCart,
	Store,
	ChevronRight,
	MapPin,
	Globe,
	Phone,
	Mail,
} from "lucide-react";
import { getProductById } from "../services/apiService";
import Loader from "./Loader";

const ProductDetails = () => {
	const { productId } = useParams();
	const [productData, setProductData] = useState({
		product: null,
		merchant: null,
		category: null,
		images: [],
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeImage, setActiveImage] = useState(0);
	const [activeTab, setActiveTab] = useState("description");
	const [liked, setLiked] = useState(false);
	const [reviewsCount, setReviewsCount] = useState(0);
	const [averageRating, setAverageRating] = useState(0);

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				setLoading(true);
				const data = await getProductById(productId);

				if (data.success) {
					setProductData({
						product: data.product || {},
						merchant: data.merchant || {},
						category: data.category || {},
						images: Array.isArray(data.images) ? data.images : [],
					});

					// Sample data for demo purposes
					setReviewsCount(data.reviewsCount || 24);
					setAverageRating(data.averageRating || 4.2);
				} else {
					setProductData({
						product: data || {},
						merchant: data.merchant || {},
						category: data.category || {},
						images: Array.isArray(data.images) ? data.images : [],
					});

					// Sample data for demo purposes
					setReviewsCount(data.reviewsCount || 24);
					setAverageRating(data.averageRating || 4.2);
				}

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

	const toggleLike = () => {
		setLiked(!liked);
	};

	const { product, merchant, category, images } = productData;

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

	return (
		<div className="max-w-6xl mx-auto p-4">
			{/* Breadcrumb */}
			<div className="flex items-center text-sm text-gray-500 mb-6">
				<Link to="/" className="hover:text-blue-600">
					Home
				</Link>
				<ChevronRight size={16} className="mx-1" />
				<Link to="/products" className="hover:text-blue-600">
					Products
				</Link>
				<ChevronRight size={16} className="mx-1" />
				{category?.name && (
					<>
						<Link
							to={`/category/${category.id}`}
							className="hover:text-blue-600"
						>
							{category.name}
						</Link>
						<ChevronRight size={16} className="mx-1" />
					</>
				)}
				<span className="text-gray-700 font-medium truncate">
					{product.name}
				</span>
			</div>

			<div className="bg-white rounded-lg shadow-sm p-6 mb-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Product Images */}
					<div>
						<div className="border rounded-lg overflow-hidden mb-4 bg-gray-50">
							{images.length > 0 ? (
								<img
									src={images[activeImage]?.image}
									alt={product.name}
									className="w-full h-80 object-contain"
								/>
							) : (
								<div className="w-full h-80 bg-gray-100 flex items-center justify-center">
									<span>No image available</span>
								</div>
							)}
						</div>

						{/* Thumbnails */}
						{images.length > 1 && (
							<div className="flex gap-3 overflow-x-auto pb-2">
								{images.map((img, index) => (
									<div
										key={index}
										onClick={() => setActiveImage(index)}
										className={`w-20 h-20 border rounded-md cursor-pointer overflow-hidden ${
											activeImage === index
												? "border-blue-500 ring-2 ring-blue-200"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<img
											src={img.image}
											alt=""
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
							<h1 className="text-2xl font-bold text-gray-800">
								{product.name}
							</h1>
							<button
								onClick={toggleLike}
								className={`p-2 rounded-full ${
									liked
										? "text-red-500 bg-red-50"
										: "text-gray-400 hover:bg-gray-100"
								}`}
							>
								<Heart className={liked ? "fill-red-500" : ""} size={20} />
							</button>
						</div>

						{/* Ratings */}
						<div className="flex items-center mt-2">
							<div className="flex mr-2">{renderStars(averageRating)}</div>
							<span className="text-sm text-gray-500">
								({averageRating}) · {reviewsCount} reviews
							</span>
						</div>

						{/* Price */}
						<div className="mt-4">
							<p className="text-3xl font-bold text-blue-600">
								${product.price}
							</p>
							{product.originalPrice && (
								<div className="flex items-center mt-1">
									<p className="text-sm text-gray-500 line-through mr-2">
										${product.originalPrice}
									</p>
									<span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
										Save ${(product.originalPrice - product.price).toFixed(2)}
									</span>
								</div>
							)}
						</div>

						{/* Categories */}
						{category?.name && (
							<div className="mt-4">
								<span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
									{category.name}
								</span>
							</div>
						)}

						{/* Merchant Preview */}
						{merchant?.name && (
							<div className="mt-6 flex items-center p-3 border rounded-lg bg-gray-50">
								{merchant.logo ? (
									<img
										src={merchant.logo}
										alt={merchant.name}
										className="w-12 h-12 rounded-full object-cover mr-3"
									/>
								) : (
									<div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
										<Store size={24} className="text-gray-500" />
									</div>
								)}
								<div className="flex-1">
									<p className="font-medium text-gray-800">{merchant.name}</p>
									<Link
										to={`/merchant/${merchant.id}`}
										className="text-blue-600 hover:underline text-sm flex items-center mt-1"
									>
										View store <ChevronRight size={16} className="ml-1" />
									</Link>
								</div>
							</div>
						)}

						{/* Add to Cart */}
						<div className="mt-6">
							<button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center font-medium">
								<ShoppingCart size={18} className="mr-2" />
								Add to Cart
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Product Details Tabs */}
			<div className="bg-white rounded-lg shadow-sm p-6 mb-8">
				<div className="border-b mb-6">
					<div className="flex">
						<button
							className={`py-3 px-6 font-medium ${
								activeTab === "description"
									? "border-b-2 border-blue-600 text-blue-600"
									: "text-gray-600 hover:text-gray-800"
							}`}
							onClick={() => setActiveTab("description")}
						>
							Description
						</button>
						<button
							className={`py-3 px-6 font-medium ${
								activeTab === "specs"
									? "border-b-2 border-blue-600 text-blue-600"
									: "text-gray-600 hover:text-gray-800"
							}`}
							onClick={() => setActiveTab("specs")}
						>
							Specifications
						</button>
						<button
							className={`py-3 px-6 font-medium ${
								activeTab === "reviews"
									? "border-b-2 border-blue-600 text-blue-600"
									: "text-gray-600 hover:text-gray-800"
							}`}
							onClick={() => setActiveTab("reviews")}
						>
							Reviews ({reviewsCount})
						</button>
					</div>
				</div>

				{/* Tab Content */}
				<div className="min-h-40">
					{activeTab === "description" && (
						<div className="prose max-w-none">
							<p className="text-gray-700 leading-relaxed">
								{product.description}
							</p>
						</div>
					)}

					{activeTab === "specs" && (
						<div>
							<dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
								{product.specifications ? (
									Object.entries(product.specifications).map(([key, value]) => (
										<div key={key} className="border-b border-gray-100 pb-3">
											<dt className="font-medium text-gray-600 mb-1">{key}</dt>
											<dd className="text-gray-800">{value}</dd>
										</div>
									))
								) : (
									<p className="col-span-2 text-gray-500">
										No specifications available
									</p>
								)}
							</dl>
						</div>
					)}

					{activeTab === "reviews" && (
						<div>
							{/* This would be replaced with actual ProductReviews component */}
							<div className="text-center py-6">
								<h3 className="text-lg font-medium text-gray-700 mb-4">
									Product Reviews
								</h3>
								<p className="text-gray-500">Loading reviews...</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Related Products Placeholder */}
			<div className="bg-white rounded-lg shadow-sm p-6">
				<h2 className="text-xl font-bold mb-4">You May Also Like</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{[1, 2, 3, 4].map((item) => (
						<div
							key={item}
							className="border rounded-lg p-3 hover:shadow-md transition-shadow"
						>
							<div className="bg-gray-100 h-32 rounded mb-2"></div>
							<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
							<div className="h-4 bg-gray-300 rounded w-1/2"></div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
