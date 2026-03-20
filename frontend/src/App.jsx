import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

const emptyForm = {
  id: "",
  name: "",
  description: "",
  price: "",
  quantity: "",
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");

  const totalValue = useMemo(() => {
    return products.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  }, [products]);

  async function fetchProducts() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/product`);
      if (!res.ok) {
        throw new Error("Unable to fetch products");
      }
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      id: Number(form.id),
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
    };

    if (!payload.name || !payload.description) {
      setSaving(false);
      setMessage("Name and description are required.");
      return;
    }

    if (Number.isNaN(payload.id) || Number.isNaN(payload.price) || Number.isNaN(payload.quantity)) {
      setSaving(false);
      setMessage("ID, price, and quantity must be valid numbers.");
      return;
    }

    try {
      const endpoint = editMode
        ? `${API_BASE}/products?id=${encodeURIComponent(payload.id)}`
        : `${API_BASE}/products`;
      const method = editMode ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(editMode ? "Unable to update product" : "Unable to add product");
      }

      setMessage(editMode ? "Product updated successfully." : "Product added successfully.");
      setForm(emptyForm);
      setEditMode(false);
      await fetchProducts();
    } catch (error) {
      setMessage(error.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  function onEdit(item) {
    setForm({
      id: String(item.id),
      name: item.name ?? "",
      description: item.description ?? "",
      price: String(item.price ?? ""),
      quantity: String(item.quantity ?? ""),
    });
    setEditMode(true);
    setMessage(`Editing product #${item.id}`);
  }

  function onCancelEdit() {
    setForm(emptyForm);
    setEditMode(false);
    setMessage("Edit cancelled.");
  }

  async function onDelete(item) {
    setDeletingId(item.id);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/products?id=${encodeURIComponent(item.id)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Number(item.id),
          name: item.name,
          description: item.description,
          price: Number(item.price),
          quantity: Number(item.quantity),
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to delete product");
      }

      setMessage("Product deleted successfully.");
      if (String(form.id) === String(item.id)) {
        setForm(emptyForm);
        setEditMode(false);
      }
      await fetchProducts();
    } catch (error) {
      setMessage(error.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="page">
      <div className="glow glow-left" aria-hidden="true" />
      <div className="glow glow-right" aria-hidden="true" />

      <header className="hero reveal-1">
        <p className="tag">FastAPI x React Product Console</p>
        <h1>Launch Products In A Neon Studio</h1>
        <p className="lead">
          A creative control panel connected to your backend where you can add and review product inventory instantly.
        </p>
      </header>

      <section className="grid">
        <article className="card reveal-2">
          <h2>{editMode ? "Update Product" : "Add Product"}</h2>
          <form onSubmit={onSubmit} className="form">
            <label>
              ID
              <input name="id" value={form.id} onChange={onChange} type="number" required />
            </label>
            <label>
              Name
              <input name="name" value={form.name} onChange={onChange} type="text" required />
            </label>
            <label>
              Description
              <input name="description" value={form.description} onChange={onChange} type="text" required />
            </label>
            <div className="inline-fields">
              <label>
                Price
                <input name="price" value={form.price} onChange={onChange} type="number" required />
              </label>
              <label>
                Quantity
                <input name="quantity" value={form.quantity} onChange={onChange} type="number" required />
              </label>
            </div>
            <button disabled={saving} type="submit">
              {saving ? "Saving..." : editMode ? "Update Product" : "Create Product"}
            </button>
            {editMode ? (
              <button className="ghost" onClick={onCancelEdit} type="button">
                Cancel Edit
              </button>
            ) : null}
          </form>
          {message ? <p className="message">{message}</p> : null}
        </article>

        <article className="card reveal-3">
          <div className="card-head">
            <h2>Inventory</h2>
            <button className="ghost" onClick={fetchProducts} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="stats">
            <div>
              <span>Items</span>
              <strong>{products.length}</strong>
            </div>
            <div>
              <span>Total Stock Value</span>
              <strong>${totalValue.toLocaleString()}</strong>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty">
                      No products available yet.
                    </td>
                  </tr>
                ) : (
                  products.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                      <td>${Number(item.price).toLocaleString()}</td>
                      <td>{item.quantity}</td>
                      <td className="action-cell">
                        <div className="row-actions">
                          <button className="ghost" type="button" onClick={() => onEdit(item)}>
                            Edit
                          </button>
                          <button
                            className="danger"
                            type="button"
                            onClick={() => onDelete(item)}
                            disabled={deletingId === item.id}
                          >
                            {deletingId === item.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
