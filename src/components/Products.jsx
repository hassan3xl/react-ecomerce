import React from "react";
import { Link } from "react-router-dom";
import ProductLikes from "./ProductLikes";

const Products = ({ products }) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{products.map((product) => (
				<div
					key={product.id}
					className="border rounded shadow-sm hover:shadow-md transition-shadow"
				>
					<div className="h-40 bg-gray-100">
						{product.image ? (
							<img
								src={product.image}
								alt={product.name}
								className="w-full h-full object-cover"
							/>
						) : product.images && product.images.length > 0 ? (
							<img
								src={product.images[0].image}
								alt={product.name}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center">
								<span className="text-gray-400">No image</span>
							</div>
						)}
					</div>
					<ProductLikes productId={product.id} />

					<div className="p-3">
						<h2 className="font-medium mb-1 truncate">{product.name}</h2>
						<p className="text-gray-600 text-sm mb-2 line-clamp-2">
							{product.description}
						</p>

						<div className="flex justify-between items-center">
							<span className="font-bold">${product.price}</span>
							<Link
								to={`/products/${product.id}`}
								className="bg-blue-600 text-white text-sm px-3 py-1 rounded"
							>
								Details
							</Link>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default Products;
