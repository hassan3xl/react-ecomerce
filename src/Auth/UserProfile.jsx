import React, { useEffect, useState } from "react";
import { API } from "../services/apiService";

const UserProfile = () => {
	const [profile, setProfile] = useState(null);
	const [form, setForm] = useState({
		phone: "",
		dob: "",
		address: "",
		bio: "",
		avatar: null,
	});
	const [editMode, setEditMode] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await API.get("/auth/profile/");
				if (response.data.success) {
					setProfile(response.data.data);
					setForm({
						phone: response.data.data.phone || "",
						dob: response.data.data.dob || "",
						address: response.data.data.address || "",
						bio: response.data.data.bio || "",
						avatar: null,
					});
				} else {
					setError("Failed to fetch profile");
				}
			} catch (err) {
				console.error(err);
				setError("Something went wrong");
			}
		};

		fetchProfile();
	}, []);
	console.log(profile);
	const handleChange = (e) => {
		const { name, value, files } = e.target;
		if (files) {
			setForm((prev) => ({ ...prev, [name]: files[0] }));
		} else {
			setForm((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		Object.entries(form).forEach(([key, value]) => {
			if (value) formData.append(key, value);
		});

		try {
			const res = await API.put("/auth/profile/", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			if (res.data.success) {
				setProfile(res.data.data);
				setEditMode(false);
			} else {
				setError("Failed to update profile");
			}
		} catch (err) {
			console.error(err);
			setError("Update failed");
		}
	};

	if (error) return <div className="text-red-500">{error}</div>;
	if (!profile) return <div>Loading...</div>;

	return (
		<div className="max-w-md mx-auto bg-white p-6 rounded shadow">
			<div className="flex items-center space-x-4 mb-4">
				{profile.avatar ? (
					<img
						src={profile.avatar}
						alt="Avatar"
						className="w-16 h-16 rounded-full object-cover"
					/>
				) : (
					<div className="w-16 h-16 rounded-full bg-gray-200" />
				)}
				<div>
					<h2 className="text-xl font-bold">{profile.name}</h2>
					<p className="text-gray-600">{profile.email}</p>
					<p className="text-sm text-gray-400">
						{profile.is_merchant ? "Merchant" : "Customer"}
					</p>
				</div>
			</div>

			{editMode ? (
				<form onSubmit={handleSubmit} className="space-y-4 mt-4">
					<div>
						<label className="block text-sm text-gray-600">Phone</label>
						<input
							name="phone"
							value={form.phone}
							onChange={handleChange}
							className="w-full border rounded px-3 py-2"
						/>
					</div>
					<div>
						<label className="block text-sm text-gray-600">Date of Birth</label>
						<input
							type="date"
							name="dob"
							value={form.dob}
							onChange={handleChange}
							className="w-full border rounded px-3 py-2"
						/>
					</div>
					<div>
						<label className="block text-sm text-gray-600">Address</label>
						<input
							name="address"
							value={form.address}
							onChange={handleChange}
							className="w-full border rounded px-3 py-2"
						/>
					</div>
					<div>
						<label className="block text-sm text-gray-600">Bio</label>
						<textarea
							name="bio"
							value={form.bio}
							onChange={handleChange}
							className="w-full border rounded px-3 py-2"
						/>
					</div>
					<div>
						<label className="block text-sm text-gray-600">Update Avatar</label>
						<input type="file" name="avatar" onChange={handleChange} />
					</div>
					<div className="flex gap-2 mt-2">
						<button
							type="submit"
							className="bg-blue-600 text-white px-4 py-2 rounded"
						>
							Save
						</button>
						<button
							type="button"
							onClick={() => setEditMode(false)}
							className="bg-gray-300 px-4 py-2 rounded"
						>
							Cancel
						</button>
					</div>
				</form>
			) : (
				<div className="mt-4 space-y-2">
					<p>
						<strong>Phone:</strong> {profile.phone || "N/A"}
					</p>
					<p>
						<strong>DOB:</strong> {profile.dob || "N/A"}
					</p>
					<p>
						<strong>Address:</strong> {profile.address || "N/A"}
					</p>
					<p>
						<strong>Bio:</strong> {profile.bio || "N/A"}
					</p>
					<p className="text-sm text-gray-500">
						Joined: {new Date(profile.date_joined).toLocaleDateString()}
					</p>
					<button
						onClick={() => setEditMode(true)}
						className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
					>
						Edit Profile
					</button>
				</div>
			)}
		</div>
	);
};

export default UserProfile;
