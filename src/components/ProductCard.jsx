import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({ products, categories }) => {
	const [activeCategory, setActiveCategory] = useState(0);
	const categoryRef = useRef(null);

	const scrollCategory = (direction) => {
		if (categoryRef.current) {
			const scrollAmount = direction === "left" ? -200 : 200;
			categoryRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	const allCategories = [
		{ title: "Recommended", icon: <Gift /> },
		...categories,
	];

	// Inside your ProductCard component
	const filteredProducts =
		activeCategory === 0
			? products
			: products.filter(
					(p) => p.category === allCategories[activeCategory].title
			  );

	return (
		<div className="max-w-screen mx-auto bg-gray-50 text-gray-800">
			{/* Categories Horizontal Scroll */}
			<div className="relative px-2 py-4 bg-white">
				<h2 className="text-lg font-bold px-2 mb-2">Categories</h2>
				<div className="relative">
					<button
						onClick={() => scrollCategory("left")}
						className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full shadow-md p-1"
					>
						<ChevronLeft size={20} />
					</button>

					<div
						ref={categoryRef}
						className="flex overflow-x-auto scrollbar-hide py-2 px-1 scroll-smooth"
						style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
					>
						{allCategories.map((category, index) => (
							<div
								key={index}
								className={`flex flex-col items-center justify-center min-w-16 p-2 mx-2 rounded-lg cursor-pointer ${
									activeCategory === index
										? "bg-red-100 text-red-500"
										: "bg-gray-50"
								}`}
								onClick={() => setActiveCategory(index)}
							>
								<span className="text-xs text-center">{category.title}</span>
							</div>
						))}
					</div>

					<button
						onClick={() => scrollCategory("right")}
						className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full shadow-md p-1"
					>
						<ChevronRight size={20} />
					</button>
				</div>
			</div>

			{/* Products in Grid Layout */}
			<div className="mt-4 pb-20 bg-white">
				<div className="flex items-center justify-between px-4 py-2">
					<h2 className="text-lg font-bold">
						{allCategories[activeCategory].title}
					</h2>
					<Link to="/products" className="text-sm text-red-500 cursor-pointer">
						View All
					</Link>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
					{filteredProducts.map((product) => (
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
									<span className="ml-2 text-gray-400">
										{product.sales} sold
									</span>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
