// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [accessToken, setAccessToken] = useState(() =>
		localStorage.getItem("access")
	);
	const [user, setUser] = useState(null);

	// Fetch user info if token exists
	useEffect(() => {
		if (accessToken) {
			axios
				.get("http://localhost:8000/api/auth/user/", {
					headers: { Authorization: `Bearer ${accessToken}` },
				})
				.then((res) => setUser(res.data))
				.catch(() => {
					logout();
				});
		}
	}, [accessToken]);

	const login = (access, refresh) => {
		localStorage.setItem("access", access);
		localStorage.setItem("refresh", refresh);
		setAccessToken(access);
	};

	const logout = () => {
		localStorage.removeItem("access");
		localStorage.removeItem("refresh");
		setAccessToken(null);
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ accessToken, user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
