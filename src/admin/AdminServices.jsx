import { useEffect, useState } from "react";
import "./AdminServices.css";

function AdminServices() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const fetchServices = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/services`
      );

      const data = await response.json();

      if (response.ok) {
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const adminToken = localStorage.getItem("adminToken");

      const url = editingId
        ? `${import.meta.env.VITE_API_URL}/api/services/${editingId}`
        : `${import.meta.env.VITE_API_URL}/api/services`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: "",
          description: "",
        });

        setEditingId(null);
        setShowForm(false);

        fetchServices();
      }
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const editService = (service) => {
    setFormData({
      name: service.name,
      description: service.description,
    });

    setEditingId(service._id);
    setShowForm(true);
  };

  const moveService = async (index, direction) => {
    const newIndex =
      direction === "up" ? index - 1 : index + 1;

    if (
      newIndex < 0 ||
      newIndex >= services.length
    ) {
      return;
    }

    const newServices = [...services];

    const temp = newServices[index];
    newServices[index] = newServices[newIndex];
    newServices[newIndex] = temp;

    setServices(newServices);

    try {
      const adminToken = localStorage.getItem("adminToken");

      await Promise.all(
        newServices.map((service, newOrder) =>
          fetch(
            `${import.meta.env.VITE_API_URL}/api/services/${service._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
              },
              body: JSON.stringify({
                name: service.name,
                description: service.description,
                active: service.active,
                order: newOrder + 1,
              }),
            }
          )
        )
      );

      fetchServices();
    } catch (error) {
      console.error("Error moving service:", error);
    }
  };

  const toggleService = async (service) => {
    try {
      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/services/${service._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            name: service.name,
            description: service.description,
            active: !service.active,
            order: service.order,
          }),
        }
      );

      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error("Error changing service status:", error);
    }
  };

  const confirmDelete = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/services/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (response.ok) {
        setDeleteId(null);
        fetchServices();
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);

    setFormData({
      name: "",
      description: "",
    });
  };

  return (
    <div className="admin-services">

      <aside className="services-sidebar">
        <h2>DJ VIPUL</h2>
        <small>ADMIN PANEL</small>

        <nav>
          <a href="/admin">
            Dashboard
          </a>

          <a href="/admin/bookings">
            Bookings
          </a>

          <a href="/admin/customers">
            Customers
          </a>

          <a
            className="active"
            href="/admin/services"
          >
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
          className="services-logout"
          onClick={() => {
            localStorage.removeItem("admin");
            localStorage.removeItem("adminToken");
            window.location.href = "/admin-login";
          }}
        >
          Logout
        </button>
      </aside>

      <main className="services-content">

        <header className="services-header">
          <div>
            <small>ADMIN PANEL</small>
            <h1>Services</h1>
          </div>

          <span>Manage Event Services</span>
        </header>

        <section className="services-section">

          <div className="services-title">

            <div>
              <small>SERVICES</small>
              <h2>Event Experiences</h2>
            </div>

            <button
              className="add-service-btn"
              onClick={() => {
                if (showForm) {
                  closeForm();
                } else {
                  setShowForm(true);
                }
              }}
            >
              {showForm ? "Close" : "+ Add Service"}
            </button>

          </div>

          {showForm && (
            <form
              className="service-form"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="name"
                placeholder="Service Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <textarea
                name="description"
                placeholder="Service Description"
                value={formData.description}
                onChange={handleChange}
                required
              />

              <button type="submit">
                {editingId
                  ? "Update Service"
                  : "Add Service"}
              </button>
            </form>
          )}

          {services.length === 0 ? (
            <div className="no-services">
              <p>No services added yet.</p>
            </div>
          ) : (
            <div className="services-list">

              {services.map((service, index) => (
                <div
                  className="admin-service-card"
                  key={service._id}
                >

                  <div>
                    <h3>{service.name}</h3>

                    <p>{service.description}</p>

                    <span>
                      {service.active
                        ? "ACTIVE"
                        : "INACTIVE"}
                    </span>
                  </div>

                  <div className="service-actions">

                    <button
                      className="move-service"
                      onClick={() =>
                        moveService(index, "up")
                      }
                      disabled={index === 0}
                    >
                      ↑
                    </button>

                    <button
                      className="move-service"
                      onClick={() =>
                        moveService(index, "down")
                      }
                      disabled={
                        index === services.length - 1
                      }
                    >
                      ↓
                    </button>

                    <button
                      className="toggle-service"
                      onClick={() =>
                        toggleService(service)
                      }
                    >
                      {service.active
                        ? "Hide"
                        : "Show"}
                    </button>

                    <button
                      className="edit-service"
                      onClick={() =>
                        editService(service)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-service"
                      onClick={() =>
                        setDeleteId(service._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </main>

      {deleteId && (
        <div className="delete-overlay">

          <div className="delete-box">

            <h2>Delete Service?</h2>

            <p>
              Are you sure you want to delete this service?
            </p>

            <div className="delete-buttons">

              <button
                className="cancel-delete"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>

              <button
                className="confirm-delete"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminServices;