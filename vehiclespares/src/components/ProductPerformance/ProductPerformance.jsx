import React, { PureComponent } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import './ProductPerformance.css'

export default class ProductPerformance extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // Full dataset of products with dates
      topSellingProducts: [], // Top 5 selling products for analysis
      otherProducts: [], // Products not in the top 5
      selectedProduct: null, // Product selected via button click
      selectedProductData: null, // Data for the selected product
      loading: true,
      error: null,
      showOtherProducts: false, // State to manage visibility of other products
    };
  }

  componentDidMount() {
    this.fetchProductData();
  }

  fetchProductData = async () => {
    try {
      const response = await axios.get("https://topmax-autospares.vercel.app/api/performance/product-data");
      const apiData = response.data;

      if (Array.isArray(apiData.data)) {
        let salesData = [];

        // Loop through the data and aggregate sales
        apiData.data.forEach((customer) => {
          if (Array.isArray(customer.products)) {
            customer.products.forEach((product) => {
              const totalAmount = product.price * product.quantity;

              const existingProduct = salesData.find(p => p.name === product.name);

              if (existingProduct) {
                existingProduct.totalAmount += totalAmount;
                existingProduct.quantity += product.quantity;
                existingProduct.dates.push(product.purchaseDate); // Collect purchase dates
              } else {
                salesData.push({
                  name: product.name || "Unknown Product",
                  totalAmount: totalAmount,
                  quantity: product.quantity,
                  dates: [product.purchaseDate], // Store purchase dates
                });
              }
            });
          }
        });

        // Sort by totalAmount to find top-selling products
        const topSellingProducts = salesData
          .sort((a, b) => b.totalAmount - a.totalAmount)
          .slice(0, 5); // Top 5 selling products

        // Products excluding the top 5
        const otherProducts = salesData.filter(
          (product) => !topSellingProducts.find(topProduct => topProduct.name === product.name)
        );

        this.setState({
          data: salesData,
          topSellingProducts: topSellingProducts,
          otherProducts: otherProducts,
          loading: false,
        });
      } else {
        throw new Error("API response structure is not as expected.");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      this.setState({ error: error.message, loading: false });
    }
  };

  handleProductSelect = (productName) => {
    const selectedProductData = this.state.data.find(product => product.name === productName);
    this.setState({ selectedProduct: productName, selectedProductData });
  };

  toggleOtherProducts = () => {
    this.setState((prevState) => ({
      showOtherProducts: !prevState.showOtherProducts, // Toggle the visibility of other products
    }));
  };

  render() {
    const { topSellingProducts, otherProducts, selectedProductData, loading, error, showOtherProducts } = this.state;

    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div className="error">Error: {error}</div>;
    }

    return (
      <div className="product-performance-container">
        <div className="left-panel">
          {/* Top Selling Products */}
          <div className="top-selling-products">
            <h3>Top Selling Products</h3>
            {topSellingProducts.map((product) => (
              <button
                key={product.name}
                className="product-button"
                onClick={() => this.handleProductSelect(product.name)}
              >
                {product.name}
              </button>
            ))}
          </div>

          {/* Other Products */}
          <button onClick={this.toggleOtherProducts} className="view-other-products-button">
            {showOtherProducts ? "Hide Other Products" : "View Other Products"}
          </button>

          {showOtherProducts && (
            <div className="other-products-list">
              {otherProducts.map((product) => (
                <button
                  key={product.name}
                  className="product-button"
                  onClick={() => this.handleProductSelect(product.name)}
                >
                  {product.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="right-panel">
          {selectedProductData ? (
            <>
              <h2>{selectedProductData.name} Analysis</h2>
              <div className="product-details">
                <p>Total Revenue (KSh): {selectedProductData.totalAmount}</p>
                <p>Quantity Sold: {selectedProductData.quantity}</p>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={selectedProductData.dates.map((date, index) => ({
                      date: date, // X-axis will display the date
                      revenue: selectedProductData.totalAmount / selectedProductData.dates.length, // Avg revenue per date
                      quantity: selectedProductData.quantity / selectedProductData.dates.length, // Avg quantity per date
                    }))}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} /> {/* Format date */}
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      name="Total Revenue (KSh)"
                      fill="#8884d8"
                      barSize={30}
                    />
                    <Bar
                      dataKey="quantity"
                      name="Quantity Sold"
                      fill="#82ca9d"
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div>Please select a product to view the details.</div>
          )}
        </div>
      </div>
    );
  }
}
