import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../services/apiService";

const EmailVerify = () => {
	const { key } = useParams(); // from route `/verify-email/:key`
	const [status, setStatus] = useState("Verifying...");

	useEffect(() => {
		const verifyEmail = async () => {
			try {
				await API.post("/shop/auth/registration/verify-email/", { key });
				setStatus("Email verified! You can now log in.");
			} catch (error) {
				setStatus(
					"Verification failed. The link may have expired or is invalid."
				);
			}
		};

		verifyEmail();
	}, [key]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<p className="text-lg font-semibold">{status}</p>
		</div>
	);
};

export default EmailVerify;
