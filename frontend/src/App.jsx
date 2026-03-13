import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "/api/grocery/";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  // Helper to show the alert
  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };

  // Automatically hide alert after 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      showAlert();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [alert.show]);

  useEffect(() => {
    refreshItems();
  }, []);

  const refreshItems = async () => {
    try {
      const res = await fetch(BASE_URL);
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Connection Refused! Is Django running?");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showAlert(true, "danger", "Please enter a value");
      return;
    }

    const url = editId ? `${BASE_URL}${editId}/` : BASE_URL;
    const method = editId ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Submit failed");

      showAlert(true, "success", editId ? "Item Edited" : "Item Added");
      setName("");
      setEditId(null);
      refreshItems();
    } catch (err) {
      showAlert(true, "danger", "Submit failed. Check server.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      showAlert(true, "danger", "Item Deleted");
      refreshItems();

      if (editId === id) {
        setName("");
        setEditId(null);
      }
    } catch (err) {
      showAlert(true, "danger", "Could not delete item.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Notification Pop-up */}
        {alert.show && (
          <div style={{ ...styles.alert, ...styles[alert.type] }}>
            {alert.msg}
          </div>
        )}

        <h2 style={styles.title}>Grocery Bud</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. apple"
          />
          <button type="submit" style={styles.submitBtn}>
            {editId ? "Edit" : "Add"}
          </button>
        </form>

        <div style={styles.list}>
          {items.map((item) => (
            <div key={item.id} style={styles.itemRow}>
              <span style={styles.text}>{item.name}</span>
              <div style={styles.btnGroup}>
                <button
                  onClick={() => {
                    setName(item.name);
                    setEditId(item.id);
                  }}
                  style={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  container: {
    width: "100%",
    maxWidth: "450px",
    textAlign: "center",
    position: "relative",
  },
  alert: {
    marginBottom: "1rem",
    height: "1.25rem",
    display: "grid",
    alignItems: "center",
    textAlign: "center",
    fontSize: "0.85rem",
    borderRadius: "0.25rem",
    letterSpacing: "2px",
    textTransform: "capitalize",
    padding: "10px",
  },
  success: {
    color: "#155724",
    backgroundColor: "#d4edda",
  },
  danger: {
    color: "#721c24",
    backgroundColor: "#f8d7da",
  },
  title: {
    color: "#333",
    marginBottom: "20px",
    fontSize: "2rem",
    letterSpacing: "2px",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
  },
  input: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#fff",
    color: "#333",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
  },
  submitBtn: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  list: {
    width: "100%",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 10px",
    borderBottom: "1px solid #eee",
  },
  text: {
    color: "#333",
    fontSize: "18px",
    textTransform: "capitalize",
  },
  btnGroup: {
    display: "flex",
    gap: "8px",
  },
  editBtn: {
    padding: "5px 10px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  deleteBtn: {
    padding: "5px 10px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
};

export default App;
