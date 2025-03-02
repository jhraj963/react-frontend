import { useState, useEffect } from "react";
import axios from "axios";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch products when the component loads
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`);
        setProducts(response.data.data); // Assuming the response contains 'data'
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Update product if edit mode is true
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/products/${editProduct.id}`,
          { name, description, price },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert("Product updated successfully!");
        setIsEditMode(false);
      } else {
        // Create a new product if not in edit mode
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/products`,
          { name, description, price },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert("Product created successfully!");
      }

      // Clear input fields
      setName("");
      setDescription("");
      setPrice("");

      // Refresh product list
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`);
      setProducts(response.data.data);
    } catch (err) {
      setError("Error creating/updating product");
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Product deleted successfully!");

      // Refresh product list after deletion
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`);
      setProducts(response.data.data);
    } catch (error) {
      alert("Error deleting product");
      console.error(error);
    }
  };

  const handleEditProduct = (product) => {
    setIsEditMode(true);
    setEditProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
  };

  return (
    <div className="container mt-5">
      <h2>{isEditMode ? "Edit Product" : "Create New Product"}</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleCreateProduct}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {isEditMode ? "Update Product" : "Create Product"}
        </button>
      </form>

      <hr />

      <h3>Product List</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>
                <button
                  className="btn btn-warning"
                  onClick={() => handleEditProduct(product)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger ml-2"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
