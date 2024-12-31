import React, { useContext, useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Product.css";
import { ShopContext } from "../../context/ShopContext";
import { FaCartPlus } from "react-icons/fa6";

const Product = () => {
  const { productData, addToCart, url } = useContext(ShopContext);
  const { productId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("related");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const foundProduct = productData.find(
      (prod) => prod._id === productId || prod._id.toString() === productId
    );

    setProduct(foundProduct || null);
    setLoading(false);
  }, [productId, productData]);

  const relatedProducts = useMemo(() => {
    if (product) {
      return productData
        .filter(
          (prod) =>
            (prod.category === product.category ||
              prod.brand === product.brand) &&
            prod._id !== product._id
        )
        .slice(0, 4);
    }
    return [];
  }, [product, productData]);

  if (loading) {
    return <div className="loading-container">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist.</p>
        <button
          onClick={() => navigate("/collections")}
          className="back-to-home-btn"
        >
          Back to Collections
        </button>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <ProductInfo product={product} url={url} />

      <div className="product-tabs">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === "related" ? "active" : ""}`}
            onClick={() => setActiveTab("related")}
          >
            Related Products
          </button>
          <button
            className={`tab-button ${
              activeTab === "description" ? "active" : ""
            }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "related" && (
            <RelatedProducts
              relatedProducts={relatedProducts}
              url={url}
              currentProductId={product._id}
            />
          )}

          {activeTab === "description" && (
            <div className="description-content">
              <h2>Product Description</h2>
              <p>{product.description || "No description available"}</p>
            </div>
          )}

          {activeTab === "reviews" && <Reviews productId={product._id} />}
        </div>
      </div>
    </div>
  );
};

const ProductInfo = ({ product, url }) => {
  const { addToCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product._id);
  };

  const handleBuyNow = () => {
    addToCart(product._id);
    setTimeout(() => {
      navigate("/place-order");
    }, 100);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="product-info-container">
      <div className="product-images-container">
        {product.image ? (
          <img
            src={`${url}/images/${product.image}`}
            alt={product.name || "Unnamed Product"}
            className="large-image"
            onError={(e) => {
              e.target.src = "/placeholder-image.png";
            }}
          />
        ) : (
          <div className="no-image-placeholder">No Image Available</div>
        )}
      </div>

      <div className="product-details-content">
        <h1 className="product-title">{product.name || "Unnamed Product"}</h1>
        <p className="product-price-t">
          KSh. {product.price ? product.price.toLocaleString() : "0"}
        </p>

        <div className="product-stock-info">
          {product.stock > 0 ? (
            <span className="in-stock">In Stock</span>
          ) : (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>

        <div className="quantity-control">
          <button onClick={decrementQuantity} disabled={quantity <= 1}>
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={incrementQuantity}
            disabled={quantity >= product.stock}
          >
            +
          </button>
        </div>

        <div className="add-buy">
          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <FaCartPlus className="cart-icon-product"/>
          </button>
          <button
            onClick={handleBuyNow}
            className="buy-button"
            disabled={product.stock === 0}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    // Simulated reviews data
    const mockReviews = [
      {
        id: 1,
        rating: 5,
        comment: "Great product!",
        user: "John D.",
        date: "2024-03-15",
      },
      {
        id: 2,
        rating: 4,
        comment: "Good value for money",
        user: "Sarah M.",
        date: "2024-03-14",
      },
    ];
    setReviews(mockReviews);
  }, [productId]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const mockNewReview = {
      id: reviews.length + 1,
      ...newReview,
      user: "Current User",
      date: new Date().toISOString().split("T")[0],
    };
    setReviews([mockNewReview, ...reviews]);
    setNewReview({ rating: 5, comment: "" });
  };

  return (
    <div className="reviews-section">
      <h2>Customer Reviews</h2>

      <form onSubmit={handleSubmitReview} className="review-form">
        <div className="form-group">
          <label>Rating:</label>
          <select
            value={newReview.rating}
            onChange={(e) =>
              setNewReview({ ...newReview, rating: parseInt(e.target.value) })
            }
          >
            {[5, 4, 3, 2, 1].map((num) => (
              <option key={num} value={num}>
                {num} Stars
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Your Review:</label>
          <textarea
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            rows="4"
            required
          />
        </div>

        <button type="submit" className="submit-review-button">
          Submit Review
        </button>
      </form>

      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <span className="review-user">{review.user}</span>
              <span className="review-date">{review.date}</span>
            </div>
            <div className="review-rating">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const RelatedProducts = React.memo(
  ({ relatedProducts, url, currentProductId }) => {
    const navigate = useNavigate();

    if (relatedProducts.length === 0) {
      return null;
    }

    return (
      <div className="related-products-section">
        <h2>Related Products</h2>
        <div className="related-products-grid">
          {relatedProducts.map((prod) => (
            <div
              key={prod._id}
              className="related-product-card"
              onClick={() => navigate(`/product/${prod._id}`)}
            >
              <img
                src={`${url}/images/${prod.image}`}
                alt={prod.name || "Unnamed Product"}
                className="related-product-image"
                onError={(e) => {
                  e.target.src = "/placeholder-image.png";
                }}
              />
              <div className="related-product-info">
                <h3 className="related-product-title">
                  {prod.name || "Unnamed"}
                </h3>
                <p className="related-product-price">
                  KSh {prod.price ? prod.price.toLocaleString() : "0"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default Product;
