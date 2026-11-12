
import { useState } from "react";
import "./BookingForm.css";

function BookingForm() {
  const savedCustomer = localStorage.getItem("customer");
  const customer = savedCustomer ? JSON.parse(savedCustomer) : null;

  const [formData, setFormData] = useState({
    customerName: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    eventType: "",
    eventDate: "",
    venue: "",
    guests: "",
    eventDetails: "",
  });

  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      const token = localStorage.getItem("customerToken");

      const headers = {
        "Content-Type": "application/json",
      };

      if (token && token !== "null" && token !== "undefined") {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Booking request submitted successfully!");
        setShowPopup(true);

        setFormData({
          customerName: customer?.name || "",
          email: customer?.email || "",
          phone: customer?.phone || "",
          eventType: "",
          eventDate: "",
          venue: "",
          guests: "",
          eventDetails: "",
        });
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setMessage("Unable to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="booking">

      <p className="section-label">BOOK YOUR EVENT</p>

      <h2>LET'S MAKE IT HAPPEN</h2>

      <form className="booking-form" onSubmit={handleSubmit}>

        <input
          type="text"
          name="customerName"
          placeholder="Your Name"
          value={formData.customerName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <select
          name="eventType"
          value={formData.eventType}
          onChange={handleChange}
          required
        >
          <option value="">Select Event Type</option>
          <option>Wedding & Sangeet Nights</option>
          <option>Birthday & Anniversary Parties</option>
          <option>Corporate Events & Launches</option>
          <option>College Fests & Club Nights</option>
          <option>Other</option>
        </select>

        <input
          type="date"
          name="eventDate"
          min={new Date().toISOString().split("T")[0]}
          value={formData.eventDate}
          onChange={handleChange}
          onClick={(e) => e.currentTarget.showPicker()}
          required
        />

        <input
          type="text"
          name="venue"
          placeholder="Event Venue"
          value={formData.venue}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="guests"
          placeholder="Number of Guests"
          value={formData.guests}
          onChange={handleChange}
          required
        />

        <textarea
          name="eventDetails"
          placeholder="Tell us about your event"
          value={formData.eventDetails}
          onChange={handleChange}
        ></textarea>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "SENDING..." : "SEND BOOKING REQUEST"}
        </button>

      </form>

      {message && !showPopup && (
        <p className="booking-message">
          {message}
        </p>
      )}

      {showPopup && (
        <div className="booking-popup-overlay">

          <div className="booking-popup">

            <div className="popup-icon">✓</div>

            <h3>Booking Submitted Successfully!</h3>

            <p>
              Thank you for choosing DJ Vipul Professional Sound & Lights.
            </p>

            <p>
              Your booking request has been received successfully.
              Our team will contact you soon to discuss further details.
            </p>

            <p className="popup-note">
              For pricing, payment, timings and other arrangements,
              please contact DJ Vipul directly.
            </p>

            <button
              type="button"
              onClick={() => {
                setShowPopup(false);
                setMessage("");
              }}
            >
              OKAY
            </button>

          </div>

        </div>
      )}

    </section>
  );
}

export default BookingForm;
