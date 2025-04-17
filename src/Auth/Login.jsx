// components/Login.jsx
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";
import { API } from "../services/apiService";

const Login = () => {
	const { login } = useAuth();
	const [isLoginMode, setIsLoginMode] = useState(true);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			if (isLoginMode) {
				// Login
				const response = await API.post("shop/auth/login/", {
					email: formData.email,
					password: formData.password,
				});

				const { access, refresh } = response.data;
				login(access, refresh);
				window.location.href = "/";
			} else {
				// Register
				if (formData.password !== formData.confirmPassword) {
					setError("Passwords don't match");
					setLoading(false);
					return;
				}

				await API.post("shop/auth/registration/", {
					email: formData.email,
					password1: formData.password,
					password2: formData.confirmPassword,
				});

				// Auto login after registration
				const loginRes = await API.post("shop/auth/login/", {
					email: formData.email,
					password: formData.password,
				});
				const { access, refresh } = loginRes.data;
				login(access, refresh);
				window.location.href = "/";
			}
		} catch (error) {
			console.error("Auth error:", error);
			setError(
				error.response?.data?.email?.[0] ||
					error.response?.data?.non_field_errors?.[0] ||
					error.response?.data?.detail ||
					"Something went wrong."
			);
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = async (response) => {
		try {
			const { credential } = response;
			const backendResponse = await API.post("shop/auth/social/google/", {
				access_token: credential,
			});

			const { access, refresh } = backendResponse.data;
			login(access, refresh); // Save to localStorage + context

			// Optional redirect
			window.location.href = "/";
		} catch (error) {
			console.error("Google login error:", error);
		}
	};

	const toggleMode = () => {
		setIsLoginMode(!isLoginMode);
		setError("");
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-50">
			<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
				<h2 className="text-2xl font-bold text-center mb-6">
					{isLoginMode ? "Sign In" : "Create Account"}
				</h2>

				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-gray-700 mb-1" htmlFor="email">
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-gray-700 mb-1" htmlFor="password">
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					{!isLoginMode && (
						<div>
							<label
								className="block text-gray-700 mb-1"
								htmlFor="confirmPassword"
							>
								Confirm Password
							</label>
							<input
								type="password"
								id="confirmPassword"
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>
					)}

					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
						disabled={loading}
					>
						{loading
							? "Processing..."
							: isLoginMode
							? "Sign In"
							: "Create Account"}
					</button>
				</form>

				<div className="my-6 flex items-center">
					<div className="flex-grow border-t border-gray-300"></div>
					<span className="px-4 text-gray-500 text-sm">OR</span>
					<div className="flex-grow border-t border-gray-300"></div>
				</div>

				<div className="flex justify-center">
					<GoogleLogin
						onSuccess={handleGoogleLogin}
						onError={() => setError("Google login failed")}
						shape="rectangular"
						text="continue_with"
						logo_alignment="center"
						theme="filled_blue"
						size="large"
						width="100%"
					/>
				</div>

				<div className="mt-6 text-center">
					<button
						onClick={toggleMode}
						className="text-blue-600 hover:underline font-medium"
						type="button"
					>
						{isLoginMode
							? "Don't have an account? Sign up"
							: "Already have an account? Sign in"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Login;
