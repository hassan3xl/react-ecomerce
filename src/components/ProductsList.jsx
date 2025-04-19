import React, { useState, useEffect } from "react";
import { getCategories, getProducts } from "../services/apiService";
import Products from "./Products";
import ProductCard from "./ProductCard";
ProductCard;

const ProductsList = () => {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
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
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				setLoading(true);
				const data = await getCategories();
				// getProducts already handles returning an empty array if needed
				setCategories(data);
				setLoading(false);
			} catch (err) {
				setError("Failed to load products");
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

	if (loading)
		return <div className="text-center p-4">Loading products...</div>;
	if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
	if (!products.length)
		return <div className="text-center p-4">No products found</div>;

	return <ProductCard products={products} categories={categories} />;
};

export default ProductsList;
