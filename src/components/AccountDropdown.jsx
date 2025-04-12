import React, { useState, useEffect, useRef } from "react";
import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/react.svg"; // Ensure this path is correct

const AccountDropdown = () => {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	// Authentication state
	const isLoggedIn = Boolean(localStorage.getItem("accessToken"));
	const username = localStorage.getItem("username");

	/**
	 * Handles user logout by clearing credentials and redirecting
	 */
	const handleLogout = () => {
		try {
			localStorage.removeItem("accessToken");
			localStorage.removeItem("username");
			setIsOpen(false);
			navigate("/login");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	/**
	 * Close dropdown when clicking outside
	 */
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	/**
	 * Toggles dropdown visibility
	 */
	const toggleDropdown = () => setIsOpen((prevState) => !prevState);

	/**
	 * Closes dropdown after navigation
	 */
	const closeDropdown = () => setIsOpen(false);

	// If not logged in, don't render the component
	if (!isLoggedIn) {
		return null;
	}

	// Menu items configuration for easier maintenance
	const menuItems = [
		{
			to: "/profile",
			icon: <FiUser className="w-4 h-4 text-gray-500" />,
			label: "Profile",
			className: "text-gray-700",
		},
		{
			to: "/account",
			icon: <FiSettings className="w-4 h-4 text-gray-500" />,
			label: "Account",
			className: "text-gray-700",
		},
		{
			to: "/settings",
			icon: <FiSettings className="w-4 h-4 text-gray-500" />,
			label: "Settings",
			className: "text-gray-700",
		},
	];

	return (
		<div className="relative" ref={dropdownRef} data-testid="account-dropdown">
			{/* Profile Button */}
			<button
				onClick={toggleDropdown}
				className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center focus:outline-none hover:border-gray-400 transition-colors"
				aria-expanded={isOpen}
				aria-label="Account menu"
			>
				<img
					src={defaultAvatar}
					alt={`${username || "User"} profile`}
					className="w-full h-full rounded-full object-cover"
					onError={(e) => {
						e.target.onerror = null;
						e.target.src = defaultAvatar;
					}}
				/>
			</button>

			{/* Dropdown Menu with Animation */}
			{isOpen && (
				<div
					className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-10 transform transition-all duration-200 ease-in-out scale-95 origin-top-right"
					role="menu"
					aria-orientation="vertical"
				>
					{/* Navigation Menu Items */}
					{menuItems.map((item) => (
						<Link
							key={item.to}
							to={item.to}
							className={`block px-4 py-2 text-sm ${item.className} hover:bg-gray-100 flex items-center gap-2 transition-colors duration-150`}
							onClick={closeDropdown}
							role="menuitem"
						>
							{item.icon}
							<span>{item.label}</span>
						</Link>
					))}

					{/* Logout Button */}
					<button
						className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2 transition-colors duration-150"
						onClick={handleLogout}
						role="menuitem"
					>
						<FiLogOut className="w-4 h-4 text-red-500" />
						<span>Logout</span>
					</button>
				</div>
			)}
		</div>
	);
};

export default AccountDropdown;
