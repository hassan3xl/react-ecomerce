import React from 'react';

const Logout = () => {
	localStorage.removeItem('accessToken'); // Remove the JWT token

	return <div></div>;
};

export default Logout;
