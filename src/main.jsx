import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			{/* <GoogleOAuthProvider clientId="382553856551-u5vv4q4gbhrnjfjjecflbhns8v0uikog.apps.googleusercontent.com"> */}
			<AuthProvider>
				<App />
			</AuthProvider>
		</GoogleOAuthProvider>
	</React.StrictMode>
);
