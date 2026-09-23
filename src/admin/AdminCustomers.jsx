import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");

    fetch(`${import.meta.env.VITE_API_URL}/api/customers`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>DJ VIPUL</h2>
        <small>ADMIN PANEL</small>

        <nav>
          <a href="/admin">
            Dashboard
          </a>

          <a href="/admin/bookings">
            Bookings
          </a>

          <a
            className="active"
            href="/admin/customers"
          >
            Customers
          </a>

          <a href="/admin/services">
            Services
          </a>

          <a href="/admin/reviews">
            Reviews
          </a>

          <a href="/admin/gallery">
            Gallery
          </a>
        </nav>

        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem("admin");
            localStorage.removeItem("adminToken");
            window.location.href = "/admin-login";
          }}
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-content">

        <header>
          <div>
            <small>ADMIN PANEL</small>
            <h1>Customers</h1>
          </div>

          <span>All Registered Customers</span>
        </header>

        <section className="booking-preview">

          <div className="section-title">
            <div>
              <small>CUSTOMERS</small>
              <h2>All Registered Customers</h2>
            </div>

            <span>
              {customers.length} Customers
            </span>
          </div>

          {customers.length === 0 ? (

            <div className="no-bookings">
              <p>No customers registered yet.</p>
            </div>

          ) : (

            <div className="customers-list">

              {customers.map((customer, index) => (

                <div
                  className="customer-card"
                  key={customer._id}
                >

                  <div className="customer-number">
                    {index + 1}
                  </div>

                  <div className="customer-info">

                    <h3>{customer.name}</h3>

                    <p>{customer.email}</p>

                    <span>{customer.phone}</span>

                  </div>

                  <button
                    className="view-details"
                    onClick={() =>
                      setSelectedCustomer(customer)
                    }
                  >
                    View Details
                  </button>

                </div>

              ))}

            </div>
          )}

        </section>

      </main>

      {/* CUSTOMER DETAILS POPUP */}
      {selectedCustomer && (

        <div className="details-overlay">

          <div className="details-box">

            <button
              className="close-details"
              onClick={() =>
                setSelectedCustomer(null)
              }
            >
              ×
            </button>

            <small>CUSTOMER DETAILS</small>

            <h2>{selectedCustomer.name}</h2>

            <p>
              <strong>Email:</strong>{" "}
              {selectedCustomer.email}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {selectedCustomer.phone}
            </p>

            <p>
              <strong>Customer ID:</strong>{" "}
              {selectedCustomer._id}
            </p>

            <button
              className="cancel-btn"
              onClick={() =>
                setSelectedCustomer(null)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminCustomers;