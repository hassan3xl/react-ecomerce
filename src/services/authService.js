// src/services/authService.js
const API_URL = process.env.REACT_APP_API_URL || "";

export const authService = {
	// Get Google auth URL from backend
	getGoogleAuthUrl: async () => {
		const response = await fetch(`${API_URL}/api/auth/google/url/`, {
			credentials: "include", // Important for cookies
		});
		if (!response.ok) throw new Error("Failed to get auth URL");
		const data = await response.json();
		return data.auth_url;
	},

	// Handle Google callback
	handleGoogleCallback: async (code) => {
		const response = await fetch(
			`${API_URL}/api/auth/google/callback/?code=${code}`,
			{
				credentials: "include",
			}
		);
		if (!response.ok) throw new Error("Authentication failed");
		const data = await response.json();

		// Store authentication info in localStorage if needed
		if (data.success) {
			localStorage.setItem("isAuthenticated", "true");
			// If your backend returns a token
			if (data.token) {
				localStorage.setItem("authToken", data.token);
			}
		}

		return data;
	},

	// Get current user session info
	getSessionInfo: async () => {
		const response = await fetch(`${API_URL}/api/auth/session/`, {
			credentials: "include",
			headers: {
				// Include auth token if you're using token-based auth
				...(localStorage.getItem("authToken")
					? {
							Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					  }
					: {}),
			},
		});

		if (!response.ok) {
			// Clear stored auth if session is invalid
			if (response.status === 401) {
				localStorage.removeItem("isAuthenticated");
				localStorage.removeItem("authToken");
			}
			throw new Error("Failed to get session info");
		}

		return response.json();
	},

	// Log out
	logout: async () => {
		const response = await fetch(`${API_URL}/api/auth/logout/`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				...(localStorage.getItem("authToken")
					? {
							Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					  }
					: {}),
			},
		});

		// Clear local storage regardless of server response
		localStorage.removeItem("isAuthenticated");
		localStorage.removeItem("authToken");

		return response.ok;
	},

	// Check if user is authenticated (client-side only)
	isAuthenticated: () => {
		return localStorage.getItem("isAuthenticated") === "true";
	},
};
