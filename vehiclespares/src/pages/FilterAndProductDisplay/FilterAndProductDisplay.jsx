import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../../context/ShopContext";
import { Link, useNavigate } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa6";
import './FilterAndProductDisplay.css'

const FilterAndProductDisplay = () => {
  const { productData, addToCart, url } = useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const navigate = useNavigate();

  const priceRanges = [
    { label: "100 - 1000", min: 100, max: 1000 },
    { label: "1001 - 5000", min: 1001, max: 5000 },
    { label: "5001 - 10000", min: 5001, max: 10000 },
  ];

  const categories = productData
    ? [...new Set(productData.map((product) => product.category))]
    : [];
  const brands = productData
    ? [...new Set(productData.map((product) => product.brand))]
    : [];

  useEffect(() => {
    if (!productData) return;

    let updatedProducts = productData;

    if (selectedCategories.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    if (selectedBrands.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    if (selectedPriceRange) {
      const range = priceRanges.find((r) => r.label === selectedPriceRange);
      if (range) {
        updatedProducts = updatedProducts.filter(
          (product) => product.price >= range.min && product.price <= range.max
        );
      }
    }

    setFilteredProducts(updatedProducts);
  }, [selectedCategories, selectedBrands, selectedPriceRange, productData]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((item) => item !== brand)
        : [...prev, brand]
    );
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange((prevRange) => (prevRange === range ? "" : range));
  };

  const handleProceedToBuy = async (productId) => {
    await addToCart(productId);
    navigate("/place-order");
  };

  return (
    <div className="fpd-container">
      {/* Filters on the left */}
      <div className="fpd-sidebar">
        <h4 className="fpd-sidebar__title">Filters</h4>

        {/* Category Filter */}
        <div className="fpd-filter">
          <h5 className="fpd-filter__heading">Category</h5>
          {categories.map((category) => (
            <label key={category} className="fpd-filter__option">
              <span className="fpd-filter__label">{category}</span>
              <input
                type="checkbox"
                className="fpd-filter__checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
            </label>
          ))}
        </div>

        {/* Brand Filter */}
        <div className="fpd-filter">
          <h5 className="fpd-filter__heading">Brand</h5>
          {brands.map((brand) => (
            <label key={brand} className="fpd-filter__option">
              <span className="fpd-filter__label">{brand}</span>
              <input
                type="checkbox"
                className="fpd-filter__checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
              />
            </label>
          ))}
        </div>

        {/* Price Range Filter */}
        <div className="fpd-filter">
          <h5 className="fpd-filter__heading">Price Range</h5>
          {priceRanges.map((range) => (
            <label key={range.label} className="fpd-filter__option">
              <span className="fpd-filter__label">{range.label}</span>
              <input
                type="radio"
                className="fpd-filter__radio"
                name="price-range"
                checked={selectedPriceRange === range.label}
                onChange={() => handlePriceRangeChange(range.label)}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Products on the right */}
      <div className="fpd-products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="fpd-product">
              <Link to={`/product/${product._id}`} className="fpd-product__link">
                <img
                  src={url + "/images/" + product.image}
                  alt={product.name}
                  className="fpd-product__image"
                />
                <div className="fpd-product__details">
                  <h3 className="fpd-product__name">{product.name}</h3>
                  <h5 className="fpd-product__brand">{product.brand}</h5>
                  <p className="fpd-product__stock">
                    {product.stock > 5 ? `In Stock` : "Out of Stock"}
                  </p>
                  <span className="fpd-product__price">KSh. {product.price.toLocaleString()}</span>
                </div>
              </Link>
              <div className="fpd-product__actions">
                <button
                  onClick={() => addToCart(product._id)}
                  className="fpd-product__cart-btn"
                >
                  <FaCartPlus className="cart-icon" />
                </button>
                <button
                  onClick={() => handleProceedToBuy(product._id)}
                  className="fpd-product__buy-btn"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="fpd-products__empty">No products match the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default FilterAndProductDisplay;
