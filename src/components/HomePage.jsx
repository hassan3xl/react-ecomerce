import React, { useState, useEffect } from "react";
import {
	Home,
	Tag,
	Gift,
	Heart,
	User,
	Search,
	ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard"; // Import your ProductCard component
import { getCategories, getProducts } from "../services/apiService"; // Import your API services
// Banner Carousel Component
import img1 from "../assets/new_user_deal.png";
import img2 from "../assets/flash_sale.png";
import img3 from "../assets/seasonal_promotion.png";

const BannerCarousel = ({ banners }) => {
	const [currentBanner, setCurrentBanner] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentBanner((prev) => (prev + 1) % banners.length);
		}, 3000);
		return () => clearInterval(interval);
	}, [banners.length]);

	return (
		<div className="relative w-full h-40 md:h-64 overflow-hidden">
			{banners.map((banner, index) => (
				<div
					key={banner.id}
					className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
						index === currentBanner ? "opacity-100" : "opacity-0"
					}`}
				>
					<img
						src={banner.id === 1 ? img1 : banner.id === 2 ? img2 : img3}
						alt={banner.alt}
						className="w-full h-full object-cover"
					/>
				</div>
			))}
			<div className="absolute bottom-2 left-0 right-0 flex justify-center">
				{banners.map((_, index) => (
					<div
						key={index}
						className={`w-2 h-2 mx-1 rounded-full ${
							index === currentBanner ? "bg-white" : "bg-gray-400 bg-opacity-50"
						}`}
					/>
				))}
			</div>
		</div>
	);
};

// Category Pills Component
const CategoryPills = () => {
	const categories = [
		"New User",
		"Daily Deals",
		"Clearance",
		"Electronics",
		"Home",
		"Fashion",
		"Beauty",
		"Sports",
	];

	return (
		<div className="flex overflow-x-auto py-3 px-2 bg-white scrollbar-hide">
			{categories.map((category, index) => (
				<div
					key={index}
					className="flex-shrink-0 px-3 py-1 bg-gray-100 rounded-full mr-2 text-xs font-medium"
				>
					{category}
				</div>
			))}
		</div>
	);
};

// Flash Sale Products Component
const FlashSaleSection = ({ products }) => {
	return (
		<div className="mt-3 px-3">
			<div className="grid grid-cols-2 gap-2">
				<div className="flex items-center">
					<h2 className="font-bold text-red-500">Flash Sale</h2>
					<div className="ml-2 bg-red-100 text-red-500 text-xs px-2 py-0.5 rounded">
						04:32:17
					</div>
				</div>
				<Link to="/falsh-sale" className="text-xs text-gray-500">
					View All
				</Link>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
				{products.slice(0, 4).map((product) => (
					<Link
						to={`/products/${product.id}`}
						className="bg-white rounded-lg shadow-sm overflow-hidden"
						key={product.id}
					>
						<div className="relative">
							<img
								src={product.image.image_url}
								alt={product.name}
								className="w-full aspect-square object-cover"
							/>
							<div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded">
								-{product.discount}
							</div>
						</div>
						<div className="p-2">
							<h3 className="text-sm truncate">{product.name}</h3>
							<div className="flex items-baseline mt-1">
								<span className="text-red-500 font-bold">
									${product.sale_price}
								</span>
								<span className="ml-1 text-xs text-gray-400 line-through">
									${product.price}
								</span>
							</div>
							<div className="flex items-center text-xs mt-1">
								<span className="text-yellow-500">★</span>
								<span className="ml-1">{product.rating}</span>
								<span className="ml-2 text-gray-400">{product.sales} sold</span>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

// Main HomePage Component
const HomePage = () => {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Sample banner data - replace with your actual banners
	const banners = [
		{
			id: 1,
			image: { img1 },
			alt: "New User Deals",
		},
		{
			id: 2,
			image: { img2 },
			alt: "Flash Sale",
		},
		{
			id: 3,
			image: { img3 },
			alt: "Seasonal Promotion",
		},
	];

	// Fetch products and categories
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				// Fetch products and categories in parallel
				const [productsData, categoriesData] = await Promise.all([
					getProducts(),
					getCategories(),
				]);

				setProducts(productsData);
				setCategories(categoriesData);
				setLoading(false);
			} catch (err) {
				setError("Failed to load data");
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) return <div className="text-center p-4">Loading...</div>;
	if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
	if (!products.length)
		return <div className="text-center p-4">No products found</div>;

	return (
		<main className="max-w-screen mx-auto bg-gray-50 text-gray-800 pb-16">
			{/* Banner Carousel */}
			<BannerCarousel banners={banners} />

			{/* Category Pills */}
			<CategoryPills />

			{/* Flash Sale Section */}
			<FlashSaleSection products={products} />

			{/* Main Product Section with Categories */}
			<div className="mt-4">
				<ProductCard products={products} categories={categories} />
			</div>
		</main>
	);
};

export default HomePage;
