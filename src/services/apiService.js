// src/services/apiService.js
import axios from "axios";

// Create an Axios instance
export const API = axios.create({
	// baseURL: "http://localhost:8000/", //development
	baseURL: "https://prototype-backend-1uqm.onrender.com/", // production
});

// Add JWT token to request headers if available
API.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("access");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Function to refresh token
const refreshToken = async () => {
	try {
		const refresh = localStorage.getItem("refresh");
		if (!refresh) throw new Error("No refresh token found");

		const response = await API.post("auth/token/refresh/", {
			refresh,
		});

		const newAccess = response.data.access;
		localStorage.setItem("access", newAccess);
		return newAccess;
	} catch (error) {
		console.error("Token refresh failed");
		localStorage.removeItem("access");
		localStorage.removeItem("refresh");
		window.location.href = "/login";
		return null;
	}
};

// Retry failed requests with refreshed token
API.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			const newAccessToken = await refreshToken();

			if (newAccessToken) {
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				return API(originalRequest);
			}
		}

		return Promise.reject(error);
	}
);

// Product Endpoints
export const getProducts = async () => {
	try {
		const response = await API.get("shop/products/");

		// Handle the specific response format from your backend
		if (response.data && Array.isArray(response.data.data)) {
			return response.data.data;
		} else if (Array.isArray(response.data)) {
			return response.data;
		} else if (response.data && Array.isArray(response.data.results)) {
			return response.data.results; // For paginated responses
		} else {
			console.error("Unexpected response format:", response.data);
			return []; // Return empty array to prevent .map errors
		}
	} catch (error) {
		console.error("Error fetching products:", error);
		return [];
	}
};

export const getProductById = async (productId) => {
	try {
		const response = await API.get(`shop/products/${productId}/`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching product ${productId}:`, error);
		throw error;
	}
};

export const getProductsByCategory = async (categoryId, params = {}) => {
	const queryParams = new URLSearchParams();

	// Add optional params
	if (params.limit) queryParams.append("limit", params.limit);
	if (params.page) queryParams.append("page", params.page);
	if (params.sort) queryParams.append("sort", params.sort);
	if (params.order) queryParams.append("order", params.order);

	const queryString = queryParams.toString()
		? `?${queryParams.toString()}`
		: "";

	try {
		const response = await fetch(
			`shop/products/category/${categoryId}${queryString}`
		);

		if (!response.ok) {
			throw new Error("Failed to fetch products");
		}

		const data = await response.json();
		return data.json();
	} catch (error) {
		console.error("Error fetching category products:", error);
		throw error;
	}
};

export const getCategories = async () => {
	try {
		const response = await API.get("shop/categories/");
		return response.data;
	} catch (error) {
		console.error("Error fetching categories:", error);
		return [];
	}
};

export const getCategoryById = async (categoryId) => {
	try {
		const response = await API.get(`shop/categories/${categoryId}/`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching category ${categoryId}:`, error);
		throw error;
	}
};

export const getUserOrders = async () => {
	try {
		const response = await API.get("shop/orders/");
		return response.data;
	} catch (error) {
		console.error("Error fetching user orders:", error);
		throw error;
	}
};
export const getOrderById = async (orderId) => {
	try {
		const response = await API.get(`shop/orders/${orderId}/`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching order ${orderId}:`, error);
		throw error;
	}
};
export const getUserProfile = async () => {
	try {
		const response = await API.get("shop/auth/profile/");
		return response.data;
	} catch (error) {
		console.error("Error fetching user profile:", error);
		throw error;
	}
};
export const updateUserProfile = async (data) => {
	try {
		const response = await API.put("shop/auth/profile/", data, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data;
	} catch (error) {
		console.error("Error updating user profile:", error);
		throw error;
	}
};
