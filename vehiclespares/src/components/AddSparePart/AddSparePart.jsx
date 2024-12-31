import React, { useState } from "react";
import axios from "axios";
import "./AddSparePart.css";

const AddSparePart = ({ categories = [], brands = [] }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "", // For image preview
    category: "",
    brand: "",
    stock: "",
    warranty: "",
    isActive: true,
  });

  const [imageFile, setImageFile] = useState(null); // For the actual image file to be uploaded
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setFormData({ ...formData, image: preview });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const submissionData = new FormData();

    // Append all form data
    Object.keys(formData).forEach((key) => {
      if (key !== "image") {
        submissionData.append(key, formData[key]);
      }
    });

    // Append the image file
    if (imageFile) {
      submissionData.append("image", imageFile);
    }

    try {
      // Make the API call with correct headers
      const response = await axios.post(
        "http://localhost:4004/api/spares/add",
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Spare part added successfully!");
        // Reset form after submission
        setFormData({
          name: "",
          description: "",
          price: "",
          image: "",
          category: "",
          brand: "",
          stock: "",
          warranty: "",
          isActive: true,
        });
        setImageFile(null); // Reset image file
      }
    } catch (err) {
      setError("Error while adding spare part. Please try again!");
      console.error(
        "Submission Error:",
        err.response ? err.response.data : err
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">Add Spare Part</h2>
      <div className="form-grid">
        <div className="form-row">
          <label className="form-label">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-row description-row">
          <label className="form-label">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-row">
          <label className="form-label">Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="form-input"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">Select Category</option>
            <option value="Brakes">Brakes</option>
            <option value="Engine">Engine</option>
            <option value="Lights">Lights</option>
            <option value="Filters">Filters</option>
            <option value="Suspension">Suspension</option>
            <option value="Tires">Tires</option>
            <option value="Interior Accessories">Interior Accessories</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Brand (Optional):</label>

          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Stock:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="form-input"
            required
            min="0"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Warranty:</label>
          <input
            type="text"
            name="warranty"
            value={formData.warranty}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Active:</label>
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="form-checkbox"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Image:</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="form-input"
            accept="image/*"
          />
          {formData.image && (
            <div className="image-preview">
              <img
                src={formData.image}
                alt="Preview"
                className="preview-thumbnail"
              />
            </div>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}
        {loading && <p className="loading-message">Adding spare part...</p>}

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Adding..." : "Add Spare Part"}
        </button>
      </div>
    </form>
  );
};

export default AddSparePart;
