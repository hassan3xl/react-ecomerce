import React, { useState, useEffect } from "react";
import { API } from "../services/apiService";

const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [expandedOrderId, setExpandedOrderId] = useState(null);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await API.get("/api/orders/");
				setOrders(response.data);
			} catch (err) {
				setError("Failed to load orders. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchOrders();
	}, []);

	const toggleOrderExpansion = (orderId) => {
		setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
				<div className="flex">
					<div className="flex-shrink-0">
						<span className="text-red-400 text-lg">✕</span>
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-red-800">
							Error loading orders
						</h3>
						<div className="mt-2 text-sm text-red-700">{error}</div>
					</div>
				</div>
			</div>
		);
	}

	if (orders.length === 0) {
		return (
			<div className="text-center py-12">
				<div className="mx-auto h-12 w-12 text-gray-400">📦</div>
				<h3 className="mt-2 text-lg font-medium text-gray-900">
					No orders found
				</h3>
				<p className="mt-1 text-sm text-gray-500">
					You haven't placed any orders yet.
				</p>
			</div>
		);
	}

	return (
		<div className="bg-white shadow overflow-hidden sm:rounded-md">
			<div className="px-4 py-5 sm:px-6">
				<h2 className="text-lg font-medium text-gray-900 flex items-center">
					<span className="mr-2">📦</span>
					Your Orders
				</h2>
				<p className="mt-1 text-sm text-gray-500">
					View and manage your order history
				</p>
			</div>

			<ul className="divide-y divide-gray-200">
				{orders.map((order) => (
					<li key={order.id} className="hover:bg-gray-50">
						<div className="px-4 py-4 sm:px-6">
							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<p className="text-sm font-medium text-blue-600 truncate">
										Order #{order.id.substring(0, 8)}
									</p>
									<div className="ml-2">
										{order.is_paid ? (
											<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
												✓ Paid
											</span>
										) : (
											<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
												⏱ Pending
											</span>
										)}
									</div>
								</div>
								<div className="flex items-center">
									<p className="text-sm font-medium text-gray-900">
										${parseFloat(order.total_amount).toFixed(2)}
									</p>
									<button
										onClick={() => toggleOrderExpansion(order.id)}
										className="ml-4 flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
									>
										{expandedOrderId === order.id ? "▲" : "▼"}
									</button>
								</div>
							</div>

							<div className="mt-2 flex justify-between text-sm text-gray-500">
								<div className="flex items-center">
									<span className="mr-1.5 text-gray-400">📅</span>
									{formatDate(order.created_at)}
								</div>
								<div>
									{order.items.length}{" "}
									{order.items.length === 1 ? "item" : "items"}
								</div>
							</div>

							{expandedOrderId === order.id && (
								<div className="mt-4 border-t border-gray-200 pt-4">
									<h4 className="text-sm font-medium text-gray-900">
										Order Items
									</h4>
									<ul className="mt-2 divide-y divide-gray-200">
										{order.items.map((item) => (
											<li key={item.id} className="py-2">
												<div className="flex justify-between">
													<div className="flex items-center">
														<span className="h-5 w-5 text-gray-400 mr-2">
															📦
														</span>
														<span className="text-sm font-medium text-gray-900">
															{item.product_name}
														</span>
													</div>
													<div className="flex items-center space-x-4">
														<span className="text-sm text-gray-500">
															Qty: {item.quantity}
														</span>
														<span className="text-sm font-medium text-gray-900">
															${parseFloat(item.price).toFixed(2)} each
														</span>
													</div>
												</div>
											</li>
										))}
									</ul>

									<div className="mt-4 flex justify-between pt-2 border-t border-gray-200">
										<span className="text-sm font-medium text-gray-900">
											Order Total:
										</span>
										<span className="text-sm font-medium text-gray-900">
											${parseFloat(order.total_amount).toFixed(2)}
										</span>
									</div>
								</div>
							)}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Orders;
