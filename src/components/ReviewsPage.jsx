import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReviewsPage.css";

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const navigate = useNavigate();

  const savedCustomer = localStorage.getItem("customer");
  const customer = savedCustomer
    ? JSON.parse(savedCustomer)
    : null;

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews`
      );

      const data = await response.json();

      if (response.ok) {
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchReviews();
  }, []);

  const handleWriteReview = () => {
    if (!customer) {
      navigate("/login");
      return;
    }

    setShowForm(true);
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select your rating.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("customerToken")}`,
          },
          body: JSON.stringify({
            customerName: customer.name,
            rating,
            comment,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setReviews((prev) => [data, ...prev]);
        setRating(0);
        setComment("");
        setShowForm(false);
      } else {
        alert(data.message || "Could not submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const getStars = (rating) => {
    let stars = "";

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars += "★";
      } else if (rating >= i - 0.5) {
        stars += "⯪";
      } else {
        stars += "☆";
      }
    }

    return stars;
  };

  return (
    <section className="reviews-page">

      <div className="reviews-header">
        <p>REVIEWS</p>

        <h1>WHAT OUR CUSTOMERS SAY</h1>

        <span>
          Real experiences from our customers.
        </span>
      </div>

      <div className="reviews-action">
        <button
          className="write-review-btn"
          onClick={handleWriteReview}
        >
          ★ WRITE A REVIEW
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="no-reviews">
          <h2>No reviews yet.</h2>
          <p>Be the first to share your experience.</p>
        </div>
      ) : (
        <div className="reviews-grid">

          {reviews.map((review) => (
            <div
              className="review-card"
              key={review._id}
            >
              <div className="review-stars">
                {getStars(review.rating)}
              </div>

              <p className="review-comment">
                "{review.comment}"
              </p>

              <span>
                — {review.customerName}
              </span>
            </div>
          ))}

        </div>
      )}

      {showForm && (
        <div className="review-overlay">

          <div className="review-form-box">

            <button
              className="close-review"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>

            <p>SHARE YOUR EXPERIENCE</p>

            <h2>Write a Review</h2>

            <div className="rating-select">

              <span>Your Rating</span>

              <div className="rating-preview">
                {rating > 0
                  ? getStars(rating)
                  : "☆☆☆☆☆"}
              </div>

              <p className="select-rating-text">
                Select your rating:
              </p>

              <div className="rating-options">
                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(
                  (value) => (
                    <button
                      type="button"
                      key={value}
                      className={
                        rating === value
                          ? "rating-option selected"
                          : "rating-option"
                      }
                      onClick={() => setRating(value)}
                    >
                      {value}
                    </button>
                  )
                )}
              </div>

            </div>

            <form onSubmit={submitReview}>

              <textarea
                placeholder="Tell us about your experience..."
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
                required
              />

              <button
                type="submit"
                className="submit-review-btn"
              >
                SUBMIT REVIEW
              </button>

            </form>

          </div>

        </div>
      )}

    </section>
  );
}

export default ReviewsPage;