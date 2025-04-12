import React, { useState, useEffect } from "react";
import { getProducts } from "../services/apiService";
import Products from "./Products";

const ProductsList = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				const data = await getProducts();
				// getProducts already handles returning an empty array if needed
				setProducts(data);
				setLoading(false);
			} catch (err) {
				setError("Failed to load products");
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	if (loading)
		return <div className="text-center p-4">Loading products...</div>;
	if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
	if (!products.length)
		return <div className="text-center p-4">No products found</div>;

	return (
		<div className="max-w-6xl mx-auto p-4">
			<h1 className="text-xl font-bold mb-4">Products</h1>
			<Products products={products} />
		</div>
	);
};

export default ProductsList;
