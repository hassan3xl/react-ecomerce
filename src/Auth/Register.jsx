import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/apiService";

const Register = () => {
	const [formData, setFormData] = useState({
		email: "",
		password1: "",
		password2: "",
	});
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null); // clear previous errors
		try {
			await register(formData);
			navigate("/login");
		} catch (err) {
			const errorData = err.response?.data;
			if (typeof errorData === "object") {
				const firstKey = Object.keys(errorData)[0];
				setError(`${firstKey}: ${errorData[firstKey][0]}`);
			} else {
				setError("Registration failed: Unknown error");
			}
		}
	};

	return (
		<div className="flex justify-center items-center h-screen bg-gray-100">
			<form
				className="bg-white p-6 rounded shadow-md w-full max-w-sm"
				onSubmit={handleSubmit}
			>
				<h2 className="text-xl font-bold mb-4">Register</h2>
				{error && <p className="text-red-500 text-sm mb-4">{error}</p>}

				<input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					placeholder="Email"
					className="w-full p-2 border rounded mb-4"
					required
				/>

				<input
					type="password"
					name="password1"
					value={formData.password1}
					onChange={handleChange}
					placeholder="Password"
					className="w-full p-2 border rounded mb-4"
					required
				/>

				<input
					type="password"
					name="password2"
					value={formData.password2}
					onChange={handleChange}
					placeholder="Confirm Password"
					className="w-full p-2 border rounded mb-4"
					required
				/>

				<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full">
					Register
				</button>

				<p className="mt-4 text-sm text-gray-600 text-center">
					Already have an account?{" "}
					<Link
						to="/login"
						className="text-blue-500 hover:text-blue-700 font-semibold"
					>
						Login here
					</Link>
				</p>
			</form>
		</div>
	);
};

export default Register;
