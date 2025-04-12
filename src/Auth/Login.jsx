// components/Login.jsx
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import React from "react";
import { API } from "../services/apiService";

const Login = () => {
	const { login } = useAuth();

	const handleGoogleLogin = async (response) => {
		try {
			const { credential } = response;
			const backendResponse = await API.post("api/auth/social/google/", {
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

	return (
		<div>
			<h2>Login</h2>
			<GoogleLogin
				onSuccess={handleGoogleLogin}
				onError={() => console.log("Login Failed")}
			/>
		</div>
	);
};

export default Login;
