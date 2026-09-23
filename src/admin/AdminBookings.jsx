import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  // ================= EDIT / DELETE BOOKINGS =================

  const [editBookings, setEditBookings] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deletingBookings, setDeletingBookings] = useState(false);

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
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ================= UPDATE STATUS =================

  const updateStatus = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");

      await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${confirmAction.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            status: confirmAction.status,
          }),
        }
      );

      fetchBookings();
      setConfirmAction(null);
      setSelectedBooking(null);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= EDIT BOOKINGS =================

  const toggleEditBookings = () => {
    setEditBookings(!editBookings);
    setSelectedBookings([]);
  };

  // ================= SELECT / UNSELECT BOOKING =================

  const toggleBookingSelection = (bookingId) => {
    setSelectedBookings((prevSelected) => {
      if (prevSelected.includes(bookingId)) {
        return prevSelected.filter(
          (id) => id !== bookingId
        );
      }

      return [...prevSelected, bookingId];
    });
  };

  // ================= DELETE SELECTED =================

  const handleDeleteSelected = () => {
    if (selectedBookings.length === 0) {
      return;
    }

    setShowDeletePopup(true);
  };

  // ================= CONFIRM DELETE =================

  const confirmDeleteSelected = async () => {
    if (selectedBookings.length === 0) {
      return;
    }

    try {
      setDeletingBookings(true);

      const adminToken = localStorage.getItem("adminToken");

      // Admin can delete any selected booking
      const deleteRequests = selectedBookings.map(
        (bookingId) =>
          fetch(
            `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${adminToken}`,
              },
            }
          )
      );

      const responses = await Promise.all(
        deleteRequests
      );

      const results = await Promise.all(
        responses.map((response) => response.json())
      );

      const failedDelete = responses.some(
        (response) => !response.ok
      );

      if (failedDelete) {
        console.error(
          "Delete booking error:",
          results
        );

        alert(
          "Some bookings could not be deleted. Please try again."
        );

        return;
      }

      // Remove deleted bookings from Admin page
      setBookings((prevBookings) =>
        prevBookings.filter(
          (booking) =>
            !selectedBookings.includes(
              booking._id
            )
        )
      );

      setSelectedBookings([]);
      setShowDeletePopup(false);
      setEditBookings(false);

    } catch (error) {
      console.error(
        "Delete bookings error:",
        error
      );

      alert(
        "Unable to connect to the server."
      );
    } finally {
      setDeletingBookings(false);
    }
  };

  // ================= DATE GROUPING =================

  const getDateLabel = (date) => {
    const bookingDate = new Date(date);
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(
      yesterday.getDate() - 1
    );

    const isSameDate = (date1, date2) => {
      return (
        date1.getFullYear() ===
          date2.getFullYear() &&
        date1.getMonth() ===
          date2.getMonth() &&
        date1.getDate() ===
          date2.getDate()
      );
    };

    if (isSameDate(bookingDate, today)) {
      return "TODAY";
    }

    if (isSameDate(bookingDate, yesterday)) {
      return "YESTERDAY";
    }

    return bookingDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  // ================= GROUP BOOKINGS BY DATE =================

  const groupedBookings = bookings.reduce(
    (groups, booking) => {
      const label = getDateLabel(
        booking.createdAt
      );

      if (!groups[label]) {
        groups[label] = [];
      }

      groups[label].push(booking);

      return groups;
    },
    {}
  );

  return (
    <div className="admin-dashboard">

      <aside className="sidebar">

        <h2>DJ VIPUL</h2>

        <small>ADMIN PANEL</small>

        <nav>

          <a href="/admin">
            Dashboard
          </a>

          <a
            className="active"
            href="/admin/bookings"
          >
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
          onClick={() => {
            localStorage.removeItem("admin");
            localStorage.removeItem("adminToken");
            window.location.href = "/admin-login";
          }}
        >
          Logout
        </button>

      </aside>

      <main className="admin-content">

        <header>

          <div>

            <small>
              ADMIN PANEL
            </small>

            <h1>
              Bookings
            </h1>

          </div>

          <span>
            All Booking Requests
          </span>

        </header>

        <section className="booking-preview">

          {/* ================= SECTION TITLE ================= */}

          <div className="section-title">

            <div>

              <small>
                BOOKINGS
              </small>

              <h2>
                All Customer Requests
              </h2>

            </div>

            {/* EDIT BUTTON */}

            {bookings.length > 0 && (
              <button
                className="edit-bookings-button"
                onClick={toggleEditBookings}
              >
                {editBookings
                  ? "DONE"
                  : "EDIT"}
              </button>
            )}

          </div>

          {bookings.length === 0 ? (

            <div className="no-bookings">

              <p>
                No booking requests yet.
              </p>

            </div>

          ) : (

            Object.entries(
              groupedBookings
            ).map(
              ([dateLabel, dateBookings]) => (

                <div
                  className="booking-date-section"
                  key={dateLabel}
                >

                  {/* DATE HEADING */}

                  <div className="booking-date-heading">

                    <span>
                      {dateLabel}
                    </span>

                  </div>

                  {/* BOOKINGS FOR THIS DATE */}

                  {dateBookings.map(
                    (booking) => {

                      const isSelected =
                        selectedBookings.includes(
                          booking._id
                        );

                      return (

                        <div
                          className="booking-card"
                          key={booking._id}
                        >

                          {/* CHECKBOX */}

                          {editBookings && (

                            <div className="booking-select">

                              <label>

                                <input
                                  type="checkbox"
                                  checked={
                                    isSelected
                                  }
                                  onChange={() =>
                                    toggleBookingSelection(
                                      booking._id
                                    )
                                  }
                                />

                                <span>
                                  Select booking
                                </span>

                              </label>

                            </div>

                          )}

                          <div>

                            <span
                              className={`status status-${booking.status.toLowerCase()}`}
                            >
                              {booking.status.toUpperCase()}
                            </span>

                            <h3>
                              {booking.customerName}
                            </h3>

                            <p>
                              {booking.eventType}
                            </p>

                            <span>

                              {new Date(
                                booking.eventDate
                              ).toLocaleDateString()}

                              {" • "}

                              {booking.venue}

                              {" • "}

                              {booking.guests ||
                                "—"}{" "}
                              Guests

                            </span>

                          </div>

                          <div className="booking-buttons">

                            <button
                              className="view-details"
                              onClick={() =>
                                setSelectedBooking(
                                  booking
                                )
                              }
                            >
                              View Details
                            </button>

                            {booking.status ===
                              "Pending" && (

                              <>

                                <button
                                  className="accept"
                                  onClick={() =>
                                    setConfirmAction({
                                      id: booking._id,
                                      status:
                                        "Accepted",
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
                                      status:
                                        "Rejected",
                                    })
                                  }
                                >
                                  Reject
                                </button>

                              </>

                            )}

                          </div>

                        </div>

                      );

                    }
                  )}

                </div>

              )
            )

          )}

          {/* ================= DELETE SELECTED ================= */}

          {editBookings &&
            bookings.length > 0 && (

              <div className="remove-selected-container">

                <button
                  className="remove-selected-button"
                  onClick={
                    handleDeleteSelected
                  }
                  disabled={
                    selectedBookings.length ===
                      0 ||
                    deletingBookings
                  }
                >
                  DELETE SELECTED
                </button>

              </div>

            )}

        </section>

      </main>

      {/* ================= BOOKING DETAILS ================= */}

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

            <small>
              BOOKING DETAILS
            </small>

            <h2>
              {selectedBooking.customerName}
            </h2>

            <p>
              <strong>
                Email:
              </strong>{" "}
              {selectedBooking.email}
            </p>

            <p>
              <strong>
                Phone:
              </strong>{" "}
              {selectedBooking.phone}
            </p>

            <p>
              <strong>
                Event:
              </strong>{" "}
              {selectedBooking.eventType}
            </p>

            <p>

              <strong>
                Date:
              </strong>{" "}

              {new Date(
                selectedBooking.eventDate
              ).toLocaleDateString()}

            </p>

            <p>
              <strong>
                Venue:
              </strong>{" "}
              {selectedBooking.venue}
            </p>

            <p>

              <strong>
                Guests:
              </strong>{" "}

              {selectedBooking.guests ||
                "Not provided"}

            </p>

            <p>

              <strong>
                Event Details:
              </strong>{" "}

              {selectedBooking.eventDetails ||
                "No additional details provided."}

            </p>

            <p>

              <strong>
                Status:
              </strong>{" "}

              <span
                className={`status status-${selectedBooking.status.toLowerCase()}`}
              >
                {selectedBooking.status.toUpperCase()}
              </span>

            </p>

            {selectedBooking.status ===
              "Pending" && (

              <div className="booking-buttons">

                <button
                  className="accept"
                  onClick={() =>
                    setConfirmAction({
                      id: selectedBooking._id,
                      status:
                        "Accepted",
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
                      status:
                        "Rejected",
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

      {/* ================= ACCEPT / REJECT POPUP ================= */}

      {confirmAction && (

        <div className="confirm-overlay">

          <div className="confirm-box">

            <h2>

              {confirmAction.status ===
                "Accepted"
                ? "Accept Booking?"
                : "Reject Booking?"}

            </h2>

            <p>

              Are you sure you want to{" "}

              {confirmAction.status ===
                "Accepted"
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
                  confirmAction.status ===
                  "Accepted"
                    ? "accept"
                    : "reject"
                }
                onClick={updateStatus}
              >

                Yes,{" "}

                {confirmAction.status ===
                  "Accepted"
                  ? "Accept"
                  : "Reject"}

              </button>

            </div>

          </div>

        </div>

      )}

      {/* ================= DELETE POPUP ================= */}

      {showDeletePopup && (

        <div className="cancel-popup-overlay">

          <div className="cancel-popup">

            <p className="cancel-popup-small">
              MANAGE BOOKINGS
            </p>

            <h2>
              Delete Bookings?
            </h2>

            <p>

              Are you sure you want to
              permanently delete{" "}

              <strong>
                {selectedBookings.length}{" "}
                {selectedBookings.length === 1
                  ? "booking"
                  : "bookings"}
              </strong>
              ?

            </p>

            <div className="cancel-popup-actions">

              <button
                className="keep-booking-button"
                onClick={() =>
                  setShowDeletePopup(false)
                }
                disabled={deletingBookings}
              >
                KEEP BOOKINGS
              </button>

              <button
                className="confirm-cancel-button"
                onClick={
                  confirmDeleteSelected
                }
                disabled={deletingBookings}
              >
                {deletingBookings
                  ? "DELETING..."
                  : "YES, DELETE"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminBookings;