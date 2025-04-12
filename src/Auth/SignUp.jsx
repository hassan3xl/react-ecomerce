// components/Signup.jsx
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Signup = () => {
	const handleGoogleSignup = async (response) => {
		try {
			const { credential } = response;
			const backendResponse = await axios.post(
				"http://localhost:8000/api/auth/social/google/",
				{ access_token: credential }
			);

			const { access, refresh } = backendResponse.data;
			localStorage.setItem("access", access);
			localStorage.setItem("refresh", refresh);

			// Optional: Redirect or update state
			console.log("Signup successful");
		} catch (error) {
			console.error("Google signup error:", error);
		}
	};

	return (
		<div className="flex flex-col items-center gap-4">
			<h2 className="text-xl font-semibold">Sign up with Google</h2>
			<GoogleLogin
				onSuccess={handleGoogleSignup}
				onError={() => console.log("Signup Failed")}
			/>
		</div>
	);
};

export default Signup;
