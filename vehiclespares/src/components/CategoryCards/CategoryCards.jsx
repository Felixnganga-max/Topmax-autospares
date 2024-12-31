import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './CategoryCards.css';
import categoryData from '../../assets/assets';


const CategoryCards = () => {
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const cardsPerPage = 6;

  const handleNext = () => {
    setCurrentStartIndex((prevIndex) =>
      (prevIndex + cardsPerPage) % categoryData.length
    );
  };

  const handlePrev = () => {
    setCurrentStartIndex((prevIndex) =>
      (prevIndex - cardsPerPage + categoryData.length) % categoryData.length
    );
  };

  // Display cards for the current page
  const displayedCards = Array.from({ length: cardsPerPage }, (_, i) =>
    categoryData[(currentStartIndex + i) % categoryData.length]
  );

  return (
    <div className="category-cards-wrapper">
      {/* Add an H2 with instructions */}
      <h2 className="category-header">
        Categories
      </h2>
      <div className="category-cards-content">
        <button className="nav-arrow left-arrow" onClick={handlePrev}>
          &#10094;
        </button>
        <div className="category-cards-container">
          {displayedCards.map((category, index) => (
            <div key={index} className="category-card">
              {/* Wrap the category card with a Link to make it clickable */}
              <Link to={`/category/${category.name}`} className="category-link">
                <div
                  className="category-card-image"
                  style={{ backgroundImage: `url(${category.image})` }}
                ></div>
                <div className="category-card-name">{category.name}</div>
              </Link>
            </div>
          ))}
        </div>
        <button className="nav-arrow right-arrow" onClick={handleNext}>
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default CategoryCards;
