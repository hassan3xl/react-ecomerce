import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import AccountDropdown from "./AccountDropdown";
import React from "react";

const Navbar = () => {
	const navigate = useNavigate();
	const isLoggedIn = localStorage.getItem("accessToken");

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("username");
		navigate("/login");
	};

	return (
		<nav className="bg-blue-900 text-white p-4 shadow-lg">
			<div className="container mx-auto flex justify-between items-center">
				<Link to="/" className="text-2xl font-bold">
					ecomerce
				</Link>
				<ul className="flex gap-6 items-center">
					{isLoggedIn ? (
						<>
							<li>
								<AccountDropdown />
							</li>
						</>
					) : (
						<>
							<li>
								<Link to="/login" className="hover:text-blue-300 font-medium">
									Login
								</Link>
							</li>
							<li>
								<Link
									to="/register"
									className="hover:text-blue-300 font-medium"
								>
									Register
								</Link>
							</li>
						</>
					)}
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
