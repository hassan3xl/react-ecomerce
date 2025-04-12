import React from "react";

const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
	const stars = [1, 2, 3, 4, 5];

	const handleClick = (selectedRating) => {
		if (!readOnly && onRatingChange) {
			onRatingChange(selectedRating);
		}
	};

	return (
		<div className="flex">
			{stars.map((star) => (
				<button
					key={star}
					type={readOnly ? "button" : "button"}
					onClick={() => handleClick(star)}
					className={`text-xl focus:outline-none ${
						readOnly ? "cursor-default" : "cursor-pointer"
					}`}
					disabled={readOnly}
					aria-label={`${star} star${star !== 1 ? "s" : ""}`}
				>
					{star <= rating ? (
						<span className="text-yellow-400">★</span>
					) : (
						<span className="text-gray-300">★</span>
					)}
				</button>
			))}
		</div>
	);
};

export default StarRating;
