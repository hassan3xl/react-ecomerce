import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Products from "./Products";
import { API } from "../services/apiService";
import Loader from "./Loader";

const Merchantstore = () => {
	const { merchantId } = useParams();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchMerchantProducts = async () => {
			try {
				const response = await API.get(`/merchant/${merchantId}/store/`);
				if (response.data.success) {
					setProducts(response.data.data);
				} else {
					setError("No products found");
				}
				setLoading(false);
			} catch (err) {
				console.error("Error fetching merchant products:", err);
				setError("Failed to load store");
				setLoading(false);
			}
		};

		if (merchantId) fetchMerchantProducts();
	}, [merchantId]);

	if (loading) return <Loader />;
	if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

	return (
		<div>
			<Products products={products} />
		</div>
	);
};

export default Merchantstore;
