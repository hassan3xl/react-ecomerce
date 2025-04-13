// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import {
// 	MapPin,
// 	Globe,
// 	Phone,
// 	Mail,
// 	Star,
// 	Search,
// 	Filter,
// 	ChevronDown,
// 	Grid,
// 	List,
// 	ShoppingBag,
// 	MessageSquare,
// } from "lucide-react";
// import Loader from "./Loader";
// import { getMerchantById, getMerchantProducts } from "../services/apiService";

// const MerchantPage = () => {
// 	const { merchantId } = useParams();
// 	const [merchant, setMerchant] = useState(null);
// 	const [products, setProducts] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState(null);
// 	const [activeTab, setActiveTab] = useState("products");
// 	const [viewMode, setViewMode] = useState("grid");
// 	const [searchQuery, setSearchQuery] = useState("");
// 	const [selectedCategory, setSelectedCategory] = useState("all");
// 	const [sortBy, setSortBy] = useState("popular");

// 	useEffect(() => {
// 		const fetchMerchantData = async () => {
// 			try {
// 				setLoading(true);
// 				const merchantData = await getMerchantById(merchantId);
// 				const productsData = await getMerchantProducts(merchantId);

// 				setMerchant(merchantData);
// 				setProducts(productsData?.products || []);
// 				setLoading(false);
// 			} catch (err) {
// 				setError("Failed to load merchant information");
// 				setLoading(false);
// 			}
// 		};

// 		if (merchantId) {
// 			fetchMerchantData();
// 		}
// 	}, [merchantId]);

// 	const handleSearch = (e) => {
// 		setSearchQuery(e.target.value);
// 	};

// 	const filteredProducts = products.filter(
// 		(product) =>
// 			product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
// 			(selectedCategory === "all" || product.category === selectedCategory)
// 	);

// 	const sortedProducts = [...filteredProducts].sort((a, b) => {
// 		switch (sortBy) {
// 			case "price-low":
// 				return a.price - b.price;
// 			case "price-high":
// 				return b.price - a.price;
// 			case "newest":
// 				return new Date(b.createdAt) - new Date(a.createdAt);
// 			case "popular":
// 			default:
// 				return b.popularity - a.popularity;
// 		}
// 	});

// 	// Extract unique categories from products
// 	const categories = [
// 		"all",
// 		...new Set(products.map((product) => product.category)),
// 	];

// 	if (loading) return <Loader />;
// 	if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
// 	if (!merchant)
// 		return <div className="text-center p-6">Merchant not found</div>;

// 	return (
// 		<div className="max-w-6xl mx-auto p-4">
// 			{/* Merchant Header */}
// 			<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// 				<div className="flex flex-col md:flex-row items-start md:items-center">
// 					<div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
// 						{merchant.logo ? (
// 							<img
// 								src={merchant.logo}
// 								alt={merchant.name}
// 								className="w-24 h-24 object-cover rounded-lg border"
// 							/>
// 						) : (
// 							<div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
// 								<ShoppingBag size={36} className="text-blue-500" />
// 							</div>
// 						)}
// 					</div>

// 					<div className="flex-grow">
// 						<h1 className="text-2xl font-bold text-gray-800">
// 							{merchant.name}
// 						</h1>

// 						<div className="flex items-center mt-2 text-sm text-gray-600">
// 							{merchant.rating && (
// 								<div className="flex items-center mr-4">
// 									<div className="flex text-yellow-400 mr-1">
// 										{[...Array(5)].map((_, i) => (
// 											<Star
// 												key={i}
// 												size={16}
// 												className={
// 													i < Math.floor(merchant.rating)
// 														? "fill-yellow-400"
// 														: "text-gray-300"
// 												}
// 											/>
// 										))}
// 									</div>
// 									<span>
// 										{merchant.rating} ({merchant.reviewCount || 0} reviews)
// 									</span>
// 								</div>
// 							)}

// 							{merchant.productCount && (
// 								<span className="mr-4">{merchant.productCount} products</span>
// 							)}

// 							{merchant.since && <span>Since {merchant.since}</span>}
// 						</div>

// 						{merchant.description && (
// 							<p className="mt-3 text-gray-600 max-w-2xl">
// 								{merchant.description}
// 							</p>
// 						)}
// 					</div>

// 					<div className="mt-4 md:mt-0">
// 						{merchant.website && (
// 							<a
// 								href={merchant.website}
// 								target="_blank"
// 								rel="noopener noreferrer"
// 								className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg inline-flex items-center hover:bg-blue-100"
// 							>
// 								<Globe size={16} className="mr-2" />
// 								Visit Website
// 							</a>
// 						)}
// 					</div>
// 				</div>

// 				{/* Contact & Location Info */}
// 				<div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
// 					{merchant.address && (
// 						<div className="flex items-start">
// 							<MapPin size={18} className="text-gray-500 mt-1 mr-2" />
// 							<div>
// 								<h3 className="font-medium text-gray-700">Location</h3>
// 								<p className="text-gray-600">{merchant.address}</p>
// 							</div>
// 						</div>
// 					)}

// 					{merchant.phone && (
// 						<div className="flex items-start">
// 							<Phone size={18} className="text-gray-500 mt-1 mr-2" />
// 							<div>
// 								<h3 className="font-medium text-gray-700">Phone</h3>
// 								<p className="text-gray-600">{merchant.phone}</p>
// 							</div>
// 						</div>
// 					)}

// 					{merchant.email && (
// 						<div className="flex items-start">
// 							<Mail size={18} className="text-gray-500 mt-1 mr-2" />
// 							<div>
// 								<h3 className="font-medium text-gray-700">Email</h3>
// 								<p className="text-gray-600">{merchant.email}</p>
// 							</div>
// 						</div>
// 					)}
// 				</div>
// 			</div>

// 			{/* Tabs Navigation */}
// 			<div className="bg-white rounded-lg shadow-sm mb-6">
// 				<div className="flex border-b">
// 					<button
// 						className={`py-4 px-6 font-medium ${
// 							activeTab === "products"
// 								? "border-b-2 border-blue-600 text-blue-600"
// 								: "text-gray-600 hover:text-gray-800"
// 						}`}
// 						onClick={() => setActiveTab("products")}
// 					>
// 						Products
// 					</button>
// 					<button
// 						className={`py-4 px-6 font-medium ${
// 							activeTab === "about"
// 								? "border-b-2 border-blue-600 text-blue-600"
// 								: "text-gray-600 hover:text-gray-800"
// 						}`}
// 						onClick={() => setActiveTab("about")}
// 					>
// 						About
// 					</button>
// 					<button
// 						className={`py-4 px-6 font-medium ${
// 							activeTab === "reviews"
// 								? "border-b-2 border-blue-600 text-blue-600"
// 								: "text-gray-600 hover:text-gray-800"
// 						}`}
// 						onClick={() => setActiveTab("reviews")}
// 					>
// 						Reviews
// 					</button>
// 				</div>
// 			</div>

// 			{/* Tab Content */}
// 			{activeTab === "products" && (
// 				<div className="bg-white rounded-lg shadow-sm p-6">
// 					{/* Search and Filter Bar */}
// 					<div className="flex flex-col md:flex-row gap-4 mb-6">
// 						<div className="relative flex-grow">
// 							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
// 								<Search size={18} className="text-gray-400" />
// 							</div>
// 							<input
// 								type="text"
// 								placeholder="Search products..."
// 								className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
// 								value={searchQuery}
// 								onChange={handleSearch}
// 							/>
// 						</div>

// 						<div className="flex gap-3">
// 							<div className="relative">
// 								<select
// 									className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-blue-500 focus:border-blue-500"
// 									value={selectedCategory}
// 									onChange={(e) => setSelectedCategory(e.target.value)}
// 								>
// 									{categories.map((category) => (
// 										<option key={category} value={category}>
// 											{category === "all" ? "All Categories" : category}
// 										</option>
// 									))}
// 								</select>
// 								<ChevronDown
// 									size={16}
// 									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
// 								/>
// 							</div>

// 							<div className="relative">
// 								<select
// 									className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-blue-500 focus:border-blue-500"
// 									value={sortBy}
// 									onChange={(e) => setSortBy(e.target.value)}
// 								>
// 									<option value="popular">Most Popular</option>
// 									<option value="newest">Newest</option>
// 									<option value="price-low">Price: Low to High</option>
// 									<option value="price-high">Price: High to Low</option>
// 								</select>
// 								<ChevronDown
// 									size={16}
// 									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
// 								/>
// 							</div>

// 							<div className="flex border border-gray-300 rounded-lg overflow-hidden">
// 								<button
// 									className={`p-2 ${
// 										viewMode === "grid" ? "bg-gray-100" : "bg-white"
// 									}`}
// 									onClick={() => setViewMode("grid")}
// 								>
// 									<Grid size={18} className="text-gray-600" />
// 								</button>
// 								<button
// 									className={`p-2 ${
// 										viewMode === "list" ? "bg-gray-100" : "bg-white"
// 									}`}
// 									onClick={() => setViewMode("list")}
// 								>
// 									<List size={18} className="text-gray-600" />
// 								</button>
// 							</div>
// 						</div>
// 					</div>

// 					{/* Products Display */}
// 					{sortedProducts.length === 0 ? (
// 						<div className="text-center py-12">
// 							<p className="text-gray-500">No products found.</p>
// 						</div>
// 					) : viewMode === "grid" ? (
// 						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
// 							{sortedProducts.map((product) => (
// 								<Link
// 									to={`/product/${product.id}`}
// 									key={product.id}
// 									className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
// 								>
// 									<div className="h-48 bg-gray-100">
// 										{product.image ? (
// 											<img
// 												src={product.image}
// 												alt={product.name}
// 												className="w-full h-full object-cover"
// 											/>
// 										) : (
// 											<div className="w-full h-full flex items-center justify-center">
// 												<span className="text-gray-400">No image</span>
// 											</div>
// 										)}
// 									</div>
// 									<div className="p-3">
// 										<h3 className="font-medium text-gray-800 truncate">
// 											{product.name}
// 										</h3>
// 										<p className="text-blue-600 font-bold mt-1">
// 											${product.price}
// 										</p>
// 										{product.rating && (
// 											<div className="flex items-center mt-2">
// 												<Star
// 													size={14}
// 													className="text-yellow-400 fill-yellow-400"
// 												/>
// 												<span className="text-xs text-gray-500 ml-1">
// 													{product.rating}
// 												</span>
// 											</div>
// 										)}
// 									</div>
// 								</Link>
// 							))}
// 						</div>
// 					) : (
// 						<div className="space-y-4">
// 							{sortedProducts.map((product) => (
// 								<Link
// 									to={`/product/${product.id}`}
// 									key={product.id}
// 									className="flex border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white p-4"
// 								>
// 									<div className="w-24 h-24 bg-gray-100 flex-shrink-0">
// 										{product.image ? (
// 											<img
// 												src={product.image}
// 												alt={product.name}
// 												className="w-full h-full object-cover"
// 											/>
// 										) : (
// 											<div className="w-full h-full flex items-center justify-center">
// 												<span className="text-gray-400">No image</span>
// 											</div>
// 										)}
// 									</div>
// 									<div className="ml-4 flex-grow">
// 										<h3 className="font-medium text-gray-800">
// 											{product.name}
// 										</h3>
// 										<p className="text-sm text-gray-600 mt-1">
// 											{product.shortDescription || "No description available"}
// 										</p>
// 										<div className="flex items-center justify-between mt-2">
// 											<p className="text-blue-600 font-bold">
// 												${product.price}
// 											</p>
// 											{product.rating && (
// 												<div className="flex items-center">
// 													<Star
// 														size={14}
// 														className="text-yellow-400 fill-yellow-400"
// 													/>
// 													<span className="text-xs text-gray-500 ml-1">
// 														{product.rating}
// 													</span>
// 												</div>
// 											)}
// 										</div>
// 									</div>
// 								</Link>
// 							))}
// 						</div>
// 					)}

// 					{/* Pagination */}
// 					{sortedProducts.length > 0 && (
// 						<div className="flex justify-center mt-8">
// 							<nav className="flex items-center">
// 								<button className="px-3 py-1 border rounded-l-lg bg-gray-50 text-gray-500 hover:bg-gray-100">
// 									Previous
// 								</button>
// 								<button className="px-3 py-1 border-t border-b bg-blue-50 text-blue-600">
// 									1
// 								</button>
// 								<button className="px-3 py-1 border-t border-b text-gray-700 hover:bg-gray-50">
// 									2
// 								</button>
// 								<button className="px-3 py-1 border-t border-b text-gray-700 hover:bg-gray-50">
// 									3
// 								</button>
// 								<button className="px-3 py-1 border rounded-r-lg bg-gray-50 text-gray-700 hover:bg-gray-100">
// 									Next
// 								</button>
// 							</nav>
// 						</div>
// 					)}
// 				</div>
// 			)}

// 			{activeTab === "about" && (
// 				<div className="bg-white rounded-lg shadow-sm p-6">
// 					<h2 className="text-xl font-bold mb-4">About {merchant.name}</h2>

// 					{merchant.fullDescription && (
// 						<div className="prose max-w-none mb-6">
// 							<p className="text-gray-700">{merchant.fullDescription}</p>
// 						</div>
// 					)}

// 					{/* Business Hours */}
// 					{merchant.businessHours && (
// 						<div className="mb-6">
// 							<h3 className="text-lg font-medium mb-3">Business Hours</h3>
// 							<ul className="space-y-2">
// 								{Object.entries(merchant.businessHours).map(([day, hours]) => (
// 									<li key={day} className="flex justify-between">
// 										<span className="font-medium text-gray-700">{day}</span>
// 										<span className="text-gray-600">{hours}</span>
// 									</li>
// 								))}
// 							</ul>
// 						</div>
// 					)}

// 					{/* Policies */}
// 					{merchant.policies && (
// 						<div className="mb-6">
// 							<h3 className="text-lg font-medium mb-3">Store Policies</h3>
// 							<div className="space-y-4">
// 								{Object.entries(merchant.policies).map(
// 									([policyType, policy]) => (
// 										<div key={policyType}>
// 											<h4 className="font-medium text-gray-700 mb-1">
// 												{policyType.charAt(0).toUpperCase() +
// 													policyType.slice(1)}
// 											</h4>
// 											<p className="text-gray-600">{policy}</p>
// 										</div>
// 									)
// 								)}
// 							</div>
// 						</div>
// 					)}

// 					{/* Store Features or Badges */}
// 					{merchant.features && merchant.features.length > 0 && (
// 						<div>
// 							<h3 className="text-lg font-medium mb-3">Features</h3>
// 							<div className="flex flex-wrap gap-2">
// 								{merchant.features.map((feature, index) => (
// 									<span
// 										key={index}
// 										className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
// 									>
// 										{feature}
// 									</span>
// 								))}
// 							</div>
// 						</div>
// 					)}

// 					{/* Store Location Map Placeholder */}
// 					{merchant.address && (
// 						<div className="mt-8">
// 							<h3 className="text-lg font-medium mb-3">Our Location</h3>
// 							<div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
// 								<span className="text-gray-500">
// 									Map would be displayed here
// 								</span>
// 							</div>
// 							<p className="mt-2 text-gray-600">{merchant.address}</p>
// 						</div>
// 					)}
// 				</div>
// 			)}

// 			{activeTab === "reviews" && (
// 				<div className="bg-white rounded-lg shadow-sm p-6">
// 					<h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

// 					{/* Reviews summary */}
// 					<div className="mb-8 flex flex-col md:flex-row items-start bg-gray-50 p-4 rounded-lg">
// 						<div className="flex flex-col items-center mr-8 mb-4 md:mb-0">
// 							<span className="text-4xl font-bold text-gray-800">
// 								{merchant.rating || 0}
// 							</span>
// 							<div className="flex text-yellow-400 my-2">
// 								{[...Array(5)].map((_, i) => (
// 									<Star
// 										key={i}
// 										size={18}
// 										className={
// 											i < Math.floor(merchant.rating || 0)
// 												? "fill-yellow-400"
// 												: "text-gray-300"
// 										}
// 									/>
// 								))}
// 							</div>
// 							<span className="text-sm text-gray-500">
// 								{merchant.reviewCount || 0} reviews
// 							</span>
// 						</div>

// 						{/* Rating breakdown */}
// 						<div className="flex-grow">
// 							{[5, 4, 3, 2, 1].map((star) => (
// 								<div key={star} className="flex items-center mb-2">
// 									<span className="mr-2 w-6 text-right text-sm text-gray-600">
// 										{star}
// 									</span>
// 									<Star
// 										size={14}
// 										className="text-yellow-400 fill-yellow-400 mr-2"
// 									/>
// 									<div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
// 										<div
// 											className="h-full bg-yellow-400 rounded-full"
// 											style={{ width: `${Math.random() * 100}%` }} // Simulated data
// 										></div>
// 									</div>
// 								</div>
// 							))}
// 						</div>
// 					</div>

// 					{/* Review form button */}
// 					<div className="mb-8 text-center">
// 						<button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center">
// 							<MessageSquare size={18} className="mr-2" />
// 							Write a Review
// 						</button>
// 					</div>

// 					{/* Sample reviews */}
// 					<div className="space-y-6">
// 						{[1, 2, 3].map((reviewId) => (
// 							<div key={reviewId} className="border-b pb-6">
// 								<div className="flex justify-between mb-2">
// 									<div>
// 										<h3 className="font-medium">Customer {reviewId}</h3>
// 										<div className="flex text-yellow-400 mt-1">
// 											{[...Array(5)].map((_, i) => (
// 												<Star
// 													key={i}
// 													size={14}
// 													className={
// 														i < 4 ? "fill-yellow-400" : "text-gray-300"
// 													}
// 												/>
// 											))}
// 										</div>
// 									</div>
// 									<span className="text-sm text-gray-500">
// 										January 1{reviewId}, 2025
// 									</span>
// 								</div>
// 								<p className="text-gray-700 mt-2">
// 									This is a sample review of the merchant. The customer shares
// 									their experience shopping with this merchant. The service was
// 									excellent and the products were high quality. I would
// 									definitely shop here again.
// 								</p>
// 								<div className="flex mt-3">
// 									<button className="text-sm text-blue-600 hover:underline mr-4">
// 										Helpful
// 									</button>
// 									<button className="text-sm text-gray-500 hover:underline">
// 										Report
// 									</button>
// 								</div>
// 							</div>
// 						))}
// 					</div>

// 					{/* Load more reviews button */}
// 					<div className="mt-8 text-center">
// 						<button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50">
// 							Load More Reviews
// 						</button>
// 					</div>
// 				</div>
// 			)}
// 		</div>
// 	);
// };

// export default MerchantPage;

import React from "react";

const MerchantPage = () => {
	return (
		<div>
			<h1>hi</h1>
		</div>
	);
};

export default MerchantPage;
