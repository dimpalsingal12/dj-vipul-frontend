import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchBookings = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ADMIN LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    window.location.href = "/admin-login";
  };

  const updateStatus = async (id, status) => {
    try {
      const adminToken = localStorage.getItem("adminToken");

      await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      fetchBookings();
      setSelectedBooking(null);
      setConfirmAction(null);
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const pending = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  return (
    <div className="admin-dashboard">

      <aside className="sidebar">
        <h2>DJ VIPUL</h2>
        <small>ADMIN PANEL</small>

        <nav>
          <a className="active" href="/admin">
            Dashboard
          </a>

          <a href="/admin/bookings">
            Bookings
          </a>

          <a href="/admin/customers">
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
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      <main className="admin-content">

        <header>
          <div>
            <small>ADMIN PANEL</small>
            <h1>Dashboard</h1>
          </div>

          <span>Welcome, Admin</span>
        </header>

        <section className="welcome">
          <small>WELCOME BACK</small>
          <h2>DJ Vipul Professional Sound & Lights</h2>
          <p>Manage bookings and customers from one place.</p>
        </section>

        <section className="stats">

          <div>
            <small>PENDING BOOKINGS</small>
            <h2>{pending}</h2>
            <p>New requests</p>
          </div>

          <div>
            <small>TOTAL BOOKINGS</small>
            <h2>{bookings.length}</h2>
            <p>All requests</p>
          </div>

          <div>
            <small>ACCEPTED</small>
            <h2>
              {bookings.filter(
                (b) => b.status === "Accepted"
              ).length}
            </h2>
            <p>Confirmed</p>
          </div>

          <div>
            <small>REJECTED</small>
            <h2>
              {bookings.filter(
                (b) => b.status === "Rejected"
              ).length}
            </h2>
            <p>Rejected</p>
          </div>

        </section>

        <section className="booking-preview">

          <div className="section-title">
            <div>
              <small>BOOKINGS</small>
              <h2>Recent Booking Requests</h2>
            </div>

            <button
              onClick={() =>
                window.location.href = "/admin/bookings"
              }
            >
              View All
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="no-bookings">
              <p>No booking requests yet.</p>

              <span>
                New customer booking requests will appear here.
              </span>
            </div>
          ) : (
            bookings.slice(0, 5).map((booking) => (

              <div
                className="booking-card"
                key={booking._id}
              >

                <div>
                  <span className="status">
                    {booking.status.toUpperCase()}
                  </span>

                  <h3>{booking.customerName}</h3>

                  <p>{booking.eventType}</p>

                  <span>
                    {new Date(
                      booking.eventDate
                    ).toLocaleDateString()}
                    {" • "}
                    {booking.venue}
                    {" • "}
                    {booking.guests} Guests
                  </span>
                </div>

                <div className="booking-buttons">

                  <button
                    className="view-details"
                    onClick={() =>
                      setSelectedBooking(booking)
                    }
                  >
                    View Details
                  </button>

                  {booking.status === "Pending" && (
                    <>
                      <button
                        className="accept"
                        onClick={() =>
                          setConfirmAction({
                            id: booking._id,
                            status: "Accepted",
                          })
                        }
                      >
                        Accept
                      </button>

                      <button
                        className="reject"
                        onClick={() =>
                          setConfirmAction({
                            id: booking._id,
                            status: "Rejected",
                          })
                        }
                      >
                        Reject
                      </button>
                    </>
                  )}

                </div>

              </div>
            ))
          )}

        </section>

      </main>

      {selectedBooking && (
        <div className="details-overlay">

          <div className="details-box">

            <button
              className="close-details"
              onClick={() =>
                setSelectedBooking(null)
              }
            >
              ×
            </button>

            <small>BOOKING DETAILS</small>

            <h2>{selectedBooking.customerName}</h2>

            <p>
              <strong>Email:</strong>{" "}
              {selectedBooking.email}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {selectedBooking.phone}
            </p>

            <p>
              <strong>Event:</strong>{" "}
              {selectedBooking.eventType}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(
                selectedBooking.eventDate
              ).toLocaleDateString()}
            </p>

            <p>
              <strong>Venue:</strong>{" "}
              {selectedBooking.venue}
            </p>

            <p>
              <strong>Guests:</strong>{" "}
              {selectedBooking.guests}
            </p>

            <p>
              <strong>Event Details:</strong>{" "}
              {selectedBooking.eventDetails ||
                "No additional details provided."}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {selectedBooking.status}
            </p>

            {selectedBooking.status === "Pending" && (
              <div className="booking-buttons">

                <button
                  className="accept"
                  onClick={() =>
                    setConfirmAction({
                      id: selectedBooking._id,
                      status: "Accepted",
                    })
                  }
                >
                  Accept
                </button>

                <button
                  className="reject"
                  onClick={() =>
                    setConfirmAction({
                      id: selectedBooking._id,
                      status: "Rejected",
                    })
                  }
                >
                  Reject
                </button>

              </div>
            )}

          </div>

        </div>
      )}

      {confirmAction && (
        <div className="confirm-overlay">

          <div className="confirm-box">

            <h2>
              {confirmAction.status === "Accepted"
                ? "Accept Booking?"
                : "Reject Booking?"}
            </h2>

            <p>
              Are you sure you want to{" "}
              {confirmAction.status === "Accepted"
                ? "accept"
                : "reject"}{" "}
              this booking?
            </p>

            <div className="confirm-buttons">

              <button
                className="cancel-btn"
                onClick={() =>
                  setConfirmAction(null)
                }
              >
                Cancel
              </button>

              <button
                className={
                  confirmAction.status === "Accepted"
                    ? "accept"
                    : "reject"
                }
                onClick={() =>
                  updateStatus(
                    confirmAction.id,
                    confirmAction.status
                  )
                }
              >
                Yes,{" "}
                {confirmAction.status === "Accepted"
                  ? "Accept"
                  : "Reject"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminDashboard;