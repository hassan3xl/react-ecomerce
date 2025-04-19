import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import AccountDropdown from "./AccountDropdown";
import { useAuth } from "../context/AuthContext";
import React from "react";
import {
	Search,
	ShoppingBag,
	User,
	Heart,
	X,
	ChevronLeft,
	ChevronRight,
	Menu,
	Home,
	Tag,
	Gift,
	Package,
	ArrowDown,
	LogIn,
} from "lucide-react";

const GoogleAuthNav = () => {
	const navigate = useNavigate();
	const { user, logout } = useAuth();

	const handleLogout = () => {
		logout(); // Clears tokens + user from context and localStorage
		navigate("/login");
	};

	return (
		<>
			<header className="sticky top-0 z-10 bg-white shadow-sm">
				<div className="px-4 py-2 flex items-center justify-between bg-red-500 text-white">
					<div className="flex items-center">
						<Menu className="mr-2" size={20} />
						<Link to="/">
							<h1 className="text-xl font-bold">STORE.XYZ</h1>
						</Link>
					</div>
					<ul className="flex items-center space-x-4">
						<div className="flex items-center space-x-4">
							<Link to="">
								<Heart size={20} />
							</Link>
							<Link to="/cart/">
								<ShoppingBag size={20} />
							</Link>
							<Link to="/profile/">
								<User size={20} />
							</Link>
						</div>
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
										{" "}
										| &nbsp;&nbsp;&nbsp;
										<LogOut size={20} />
									</button>
								</li>
							</>
						) : (
							<>
								|{" "}
								<li>
									<Link to="/login" className="hover:text-blue-300 font-medium">
										<LogIn size={20} />
									</Link>
								</li>
							</>
						)}
					</ul>
				</div>

				{/* Search bar */}
				<div className="p-2 bg-red-500">
					<div className="flex items-center bg-white rounded-full px-3 py-1">
						<Search size={18} className="text-gray-400" />
						<input
							type="text"
							placeholder="Search for products"
							className="w-full ml-2 text-sm outline-none border-none"
						/>
					</div>
				</div>
			</header>
		</>
	);
};

export default GoogleAuthNav;
