import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import AccountDropdown from "./AccountDropdown";
import React from "react";
import { useAuth } from "../context/AuthContext";

const GoogleAuthNav = () => {
	const navigate = useNavigate();
	const { user, logout } = useAuth();

	const handleLogout = () => {
		logout(); // Clears tokens + user from context and localStorage
		navigate("/login");
	};

	return (
		<nav className="bg-blue-900 text-white p-4 shadow-lg">
			<div className="container mx-auto flex justify-between items-center">
				<Link to="/" className="text-2xl font-bold">
					ecomerce
				</Link>
				<ul className="flex gap-6 items-center">
					{user ? (
						<>
							<li>
								<AccountDropdown />
							</li>
							<li>
								<button
									onClick={handleLogout}
									className="flex items-center gap-1 hover:text-blue-300"
								>
									<LogOut size={18} />
									Logout
								</button>
							</li>
							<li className="font-medium">Hello, {user.name || user.email}</li>
						</>
					) : (
						<>
							<li>
								<Link to="/login" className="hover:text-blue-300 font-medium">
									Sign In
								</Link>
							</li>
						</>
					)}
				</ul>
			</div>
		</nav>
	);
};

export default GoogleAuthNav;
