import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ProductLikes from "./ProductLikes";
import ProductReviews from "./ProductReviews";
import { getProductById } from "../services/apiService";
import Loader from "./Loader";

const ProductDetail = () => {
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
	const [activeTab, setActiveTab] = useState("description"); // For tab navigation

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				setLoading(true);
				const data = await getProductById(productId);

				// Handle response data structure
				if (data.success) {
					// If using the structure from your Django API
					setProductData({
						product: data.product || {},
						merchant: data.merchant || {},
						category: data.category || {},
						images: Array.isArray(data.images) ? data.images : [],
					});
				} else {
					// If direct product object is returned
					setProductData({
						product: data || {},
						merchant: data.merchant || {},
						category: data.category || {},
						images: Array.isArray(data.images) ? data.images : [],
					});
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

	const { product, merchant, category, images } = productData;

	if (loading) return <Loader />;
	if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
	if (!product) return <div className="text-center p-4">Product not found</div>;

	return (
		<div className="max-w-6xl mx-auto p-4">
			<Link
				to="/products"
				className="text-blue-600 hover:underline mb-4 inline-block"
			>
				&larr; Back to Products
			</Link>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
				{/* Product Images */}
				<div>
					<div className="border rounded overflow-hidden mb-3">
						{images.length > 0 ? (
							<img
								src={images[activeImage]?.image}
								alt={product.name}
								className="w-full h-64 object-contain"
							/>
						) : (
							<div className="w-full h-64 bg-gray-100 flex items-center justify-center">
								<span>No image</span>
							</div>
						)}
					</div>

					{/* Thumbnails */}
					{images.length > 1 && (
						<div className="flex gap-2 overflow-x-auto">
							{images.map((img, index) => (
								<div
									key={index}
									onClick={() => setActiveImage(index)}
									className={`w-16 h-16 border-2 cursor-pointer ${
										activeImage === index
											? "border-blue-500"
											: "border-gray-200"
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
						<h1 className="text-2xl font-bold">{product.name}</h1>
						<ProductLikes productId={productId} />
					</div>

					<p className="text-xl font-bold text-blue-600 my-2">
						${product.price}
					</p>

					{category?.name && (
						<div className="mb-3">
							<span className="bg-gray-100 px-2 py-1 rounded text-sm">
								{category.name}
							</span>
						</div>
					)}

					{/* Tabs for Description and Specifications */}
					<div className="border-b mb-4">
						<div className="flex">
							<button
								className={`py-2 px-4 ${
									activeTab === "description"
										? "border-b-2 border-blue-600 font-medium"
										: "text-gray-600"
								}`}
								onClick={() => setActiveTab("description")}
							>
								Description
							</button>
							<button
								className={`py-2 px-4 ${
									activeTab === "specs"
										? "border-b-2 border-blue-600 font-medium"
										: "text-gray-600"
								}`}
								onClick={() => setActiveTab("specs")}
							>
								Specifications
							</button>
						</div>
					</div>

					{activeTab === "description" && (
						<div className="mb-6">
							<p className="text-gray-700">{product.description}</p>
						</div>
					)}

					{activeTab === "specs" && (
						<div className="mb-6">
							<dl className="grid grid-cols-2 gap-x-4 gap-y-2">
								{product.specifications ? (
									Object.entries(product.specifications).map(([key, value]) => (
										<React.Fragment key={key}>
											<dt className="font-medium text-gray-600">{key}</dt>
											<dd>{value}</dd>
										</React.Fragment>
									))
								) : (
									<p className="col-span-2 text-gray-500">
										No specifications available
									</p>
								)}
							</dl>
						</div>
					)}

					{/* Merchant Info */}
					{merchant?.name && (
						<div className="border-t pt-3 mb-4">
							<img src={merchant.logo} alt="logo" />
							<p className="font-medium">Sold by: {merchant.name}</p>

							{merchant.store_url && (
								<Link
									to={merchant.store_url}
									className="text-blue-600 hover:underline text-sm"
								>
									Visit Store
								</Link>
							)}
						</div>
					)}

					<button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
						Add to Cart
					</button>
				</div>
			</div>

			{/* Product Reviews Section */}
			<div className="mt-8">
				<ProductReviews productId={productId} />
			</div>
		</div>
	);
};

export default ProductDetail;
