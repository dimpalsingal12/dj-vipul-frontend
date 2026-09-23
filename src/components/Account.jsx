import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Account.css";

function Account() {
  const navigate = useNavigate();

  const savedCustomer = localStorage.getItem("customer");
  const customer = savedCustomer ? JSON.parse(savedCustomer) : null;

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Cancel booking
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellingBooking, setCancellingBooking] = useState(false);

  // Edit / remove bookings
  const [editBookings, setEditBookings] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [removingBookings, setRemovingBookings] = useState(false);

  useEffect(() => {
    if (!customer) return;

    const fetchBookings = async () => {
      try {
        setLoadingBookings(true);

        const customerToken = localStorage.getItem("customerToken");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/bookings/my-bookings/${encodeURIComponent(
            customer.email
          )}`,
          {
            headers: {
              Authorization: `Bearer ${customerToken}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setBookings(data);
        } else {
          console.error("Error fetching bookings:", data.message);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [customer?.email]);

  const handleLogout = () => {
    localStorage.removeItem("customer");
    localStorage.removeItem("customerToken");

    navigate("/");
    window.location.reload();
  };

  // =========================
  // CANCEL BOOKING
  // =========================

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      setCancellingBooking(true);

      const customerToken = localStorage.getItem("customerToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${selectedBooking._id}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${customerToken}`,
          },
          body: JSON.stringify({
            email: customer.email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === selectedBooking._id
              ? { ...booking, status: "Cancelled" }
              : booking
          )
        );

        setSelectedBooking(null);
      } else {
        console.error("Error cancelling booking:", data.message);
        alert(data.message || "Unable to cancel booking.");
      }
    } catch (error) {
      console.error("Cancel booking error:", error);
      alert("Unable to connect to the server.");
    } finally {
      setCancellingBooking(false);
    }
  };

  // =========================
  // EDIT BOOKINGS
  // =========================

  const toggleEditBookings = () => {
    setEditBookings(!editBookings);
    setSelectedBookings([]);
  };

  // =========================
  // SELECT / UNSELECT BOOKING
  // =========================

  const toggleBookingSelection = (bookingId) => {
    setSelectedBookings((prevSelected) => {
      if (prevSelected.includes(bookingId)) {
        return prevSelected.filter((id) => id !== bookingId);
      }

      return [...prevSelected, bookingId];
    });
  };

  // =========================
  // REMOVE SELECTED BOOKINGS
  // =========================

  const handleRemoveSelected = () => {
    if (selectedBookings.length === 0) {
      return;
    }

    setShowRemovePopup(true);
  };

  // =========================
  // CONFIRM DELETE
  // =========================

  const confirmRemoveSelected = async () => {
    if (selectedBookings.length === 0) {
      return;
    }

    try {
      setRemovingBookings(true);

      const customerToken = localStorage.getItem("customerToken");

      // Delete each selected booking from MongoDB
      const deleteRequests = selectedBookings.map((bookingId) =>
        fetch(
          `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${customerToken}`,
            },
            body: JSON.stringify({
              email: customer.email,
            }),
          }
        )
      );

      const responses = await Promise.all(deleteRequests);

      const results = await Promise.all(
        responses.map((response) => response.json())
      );

      const failedDelete = responses.some(
        (response) => !response.ok
      );

      if (failedDelete) {
        console.error("Delete booking error:", results);

        alert("Some bookings could not be deleted. Please try again.");
        return;
      }

      // Remove deleted bookings from Account page
      setBookings((prevBookings) =>
        prevBookings.filter(
          (booking) => !selectedBookings.includes(booking._id)
        )
      );

      setSelectedBookings([]);
      setShowRemovePopup(false);
      setEditBookings(false);
    } catch (error) {
      console.error("Delete bookings error:", error);

      alert("Unable to connect to the server.");
    } finally {
      setRemovingBookings(false);
    }
  };

  if (!customer) {
    return (
      <div className="account-page">
        <div className="account-box">
          <h1>Please Login</h1>

          <p>
            You need to login to view your account.
          </p>

          <Link
            to="/login"
            className="account-button"
          >
            LOGIN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="account-box">

        <p className="account-small">
          MY ACCOUNT
        </p>

        <h1>
          Welcome, {customer.name}
        </h1>

        <div className="account-details">

          <div className="account-item">
            <span>Name</span>
            <strong>{customer.name}</strong>
          </div>

          <div className="account-item">
            <span>Email</span>
            <strong>{customer.email}</strong>
          </div>

          <div className="account-item">
            <span>Phone</span>
            <strong>{customer.phone}</strong>
          </div>

        </div>

        {/* MY BOOKINGS */}

        <div className="my-bookings">

          <div className="bookings-heading">

            <p className="account-small">
              MY BOOKINGS
            </p>

            {bookings.length > 0 && (
              <button
                className="edit-bookings-button"
                onClick={toggleEditBookings}
              >
                {editBookings ? "DONE" : "EDIT"}
              </button>
            )}

          </div>

          {loadingBookings ? (
            <p>Loading bookings...</p>

          ) : bookings.length === 0 ? (

            <p>
              You don't have any bookings yet.
            </p>

          ) : (

            <div className="booking-list">

              {bookings.map((booking) => {

                const canCancel =
                  booking.status === "Pending" ||
                  booking.status === "Accepted";

                const isSelected =
                  selectedBookings.includes(
                    booking._id
                  );

                return (
                  <div
                    className="booking-card"
                    key={booking._id}
                  >

                    {/* SELECT CHECKBOX */}

                    {editBookings && (
                      <div className="booking-select">

                        <label>

                          <input
                            type="checkbox"
                            checked={isSelected}
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

                    <div className="booking-card-top">

                      <div className="booking-event">

                        <span>
                          EVENT
                        </span>

                        <strong>
                          {booking.eventType}
                        </strong>

                      </div>

                      <div
                        className={`booking-status ${booking.status.toLowerCase()}`}
                      >
                        {booking.status}
                      </div>

                    </div>

                    <div className="booking-details">

                      <div className="booking-item">

                        <span>
                          Date
                        </span>

                        <strong>
                          {new Date(
                            booking.eventDate
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </strong>

                      </div>

                      <div className="booking-item">

                        <span>
                          Venue
                        </span>

                        <strong>
                          {booking.venue}
                        </strong>

                      </div>

                      <div className="booking-item">

                        <span>
                          Guests
                        </span>

                        <strong>
                          {booking.guests}
                        </strong>

                      </div>

                    </div>

                    {canCancel && (
                      <div className="booking-card-action">

                        <button
                          className="cancel-booking-button"
                          onClick={() =>
                            setSelectedBooking(
                              booking
                            )
                          }
                        >
                          CANCEL BOOKING
                        </button>

                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          )}

          {/* REMOVE SELECTED BUTTON */}

          {editBookings &&
            bookings.length > 0 && (

            <div className="remove-selected-container">

              <button
                className="remove-selected-button"
                onClick={handleRemoveSelected}
                disabled={
                  selectedBookings.length === 0 ||
                  removingBookings
                }
              >
                DELETE SELECTED
              </button>

            </div>
          )}

        </div>

        <div className="account-actions">

          <Link
            to="/booking"
            className="review-button"
          >
            BOOK AN EVENT
          </Link>

          <Link
            to="/reviews"
            className="review-button"
          >
            SHARE YOUR EXPERIENCE
          </Link>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            LOGOUT
          </button>

        </div>

      </div>

      {/* =========================
          CANCEL CONFIRMATION POPUP
      ========================= */}

      {selectedBooking && (

        <div className="cancel-popup-overlay">

          <div className="cancel-popup">

            <p className="cancel-popup-small">
              BOOKING CANCELLATION
            </p>

            <h2>
              Cancel Booking?
            </h2>

            <p>
              Are you sure you want to cancel your
              <strong>
                {" "}
                {selectedBooking.eventType}
              </strong>{" "}
              booking?
            </p>

            <div className="cancel-popup-actions">

              <button
                className="keep-booking-button"
                onClick={() =>
                  setSelectedBooking(null)
                }
                disabled={cancellingBooking}
              >
                KEEP BOOKING
              </button>

              <button
                className="confirm-cancel-button"
                onClick={handleCancelBooking}
                disabled={cancellingBooking}
              >
                {cancellingBooking
                  ? "CANCELLING..."
                  : "YES, CANCEL"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =========================
          REMOVE BOOKINGS POPUP
      ========================= */}

      {showRemovePopup && (

        <div className="cancel-popup-overlay">

          <div className="cancel-popup">

            <p className="cancel-popup-small">
              MANAGE BOOKINGS
            </p>

            <h2>
              Delete Bookings?
            </h2>

            <p>
              Are you sure you want to permanently
              delete{" "}
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
                  setShowRemovePopup(false)
                }
                disabled={removingBookings}
              >
                KEEP BOOKING
              </button>

              <button
                className="confirm-cancel-button"
                onClick={confirmRemoveSelected}
                disabled={removingBookings}
              >
                {removingBookings
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

export default Account;