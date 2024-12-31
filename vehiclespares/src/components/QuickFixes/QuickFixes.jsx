import React, { useContext, useState } from 'react';
import './QuickFixes.css'
import { ShopContext } from '../../context/ShopContext';

const QuickFixes = () => {
  const {productData, url} = useContext(ShopContext)
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;

  const handlePrevClick = () => {
    setStartIndex(Math.max(0, startIndex - itemsPerPage));
  };

  const handleNextClick = () => {
    setStartIndex(Math.min(productData.length - itemsPerPage, startIndex + itemsPerPage));
  };

  const getRandomImage = (item) => {
    return `${url}/images/${item.image}`;
  };

  const displayedItems = productData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="quick-fixes">
      <h2>Quick Fixes</h2>
      <div className="gallery-container">
        <button
          className="arrow arrow-left"
          onClick={handlePrevClick}
          disabled={startIndex === 0}
        >
          &#8249;
        </button>
        <div className="item-grid">
          {displayedItems.map((item, index) => (
            <div key={index} className="item-card">
              <img src={getRandomImage(item)} alt={item.name} />
              <h4>{item.name}</h4>
            </div>
          ))}
        </div>
        <button
          className="arrow arrow-right"
          onClick={handleNextClick}
          disabled={startIndex + itemsPerPage >= productData.length}
        >
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default QuickFixes;
