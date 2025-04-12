import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function GoogleSignIn() {
	const handleLogin = async (credentialResponse) => {
		try {
			const { credential } = credentialResponse;

			const response = await axios.post(
				"http://localhost:8000/api/auth/social/google/",
				{
					access_token: credential,
				}
			);

			const { access_token, refresh_token } = response.data;
			localStorage.setItem("access", access_token);
			localStorage.setItem("refresh", refresh_token);

			// You're now authenticated
		} catch (error) {
			console.error("Login failed", error);
		}
	};

	return (
		<GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
			<GoogleLogin
				onSuccess={handleLogin}
				onError={() => console.log("Login Failed")}
			/>
		</GoogleOAuthProvider>
	);
}
// src/services/apiService.js
// A utility to handle CSRF tokens with your requests

// Function to get CSRF token from cookies
function getCsrfToken() {
	const name = "csrftoken=";
	const decodedCookie = decodeURIComponent(document.cookie);
	const cookieArray = decodedCookie.split(";");

	for (let i = 0; i < cookieArray.length; i++) {
		let cookie = cookieArray[i].trim();
		if (cookie.indexOf(name) === 0) {
			return cookie.substring(name.length, cookie.length);
		}
	}
	return null;
}

// Basic fetch wrapper that includes CSRF token
export const apiRequest = async (url, options = {}) => {
	const csrfToken = getCsrfToken();

	const defaultOptions = {
		credentials: "include", // Always include cookies
		headers: {
			"Content-Type": "application/json",
			// Include auth token if available
			...(localStorage.getItem("authToken")
				? {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				  }
				: {}),
			// Include CSRF token for POST/PUT/DELETE/PATCH requests
			...(csrfToken &&
			["POST", "PUT", "DELETE", "PATCH"].includes(options.method || "GET")
				? {
						"X-CSRFToken": csrfToken,
				  }
				: {}),
		},
		...options,
		// Merge provided headers with defaults
		headers: {
			...options.headers,
			...(options.headers || {}),
		},
	};

	const response = await fetch(url, defaultOptions);

	if (!response.ok) {
		// Handle different error status codes appropriately
		if (response.status === 401) {
			// Unauthorized - clear auth state
			localStorage.removeItem("isAuthenticated");
			localStorage.removeItem("authToken");
			// You might want to redirect to login page here
		}

		const errorText = await response.text();
		throw new Error(`API Error (${response.status}): ${errorText}`);
	}

	// Check if response is JSON
	const contentType = response.headers.get("content-type");
	if (contentType && contentType.includes("application/json")) {
		return response.json();
	}

	return response.text();
};
