import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminReviews.css";

function AdminReviews() {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews`
      );

      const data = await response.json();

      if (response.ok) {
        setReviews(data);
      } else {
        console.error("Error fetching reviews:", data.message);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // DELETE REVIEW

  const deleteReview = async () => {
    if (!reviewToDelete) return;

    try {
      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews/${reviewToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setReviews((prev) =>
          prev.filter(
            (review) =>
              review._id !== reviewToDelete._id
          )
        );

        setReviewToDelete(null);
      } else {
        alert(
          data.message || "Could not delete review."
        );
      }
    } catch (error) {
      console.error(
        "Error deleting review:",
        error
      );
    }
  };

  // MOVE REVIEW AND SAVE ORDER

  const moveReview = async (index, direction) => {
    const newReviews = [...reviews];

    const newIndex = index + direction;

    if (
      newIndex < 0 ||
      newIndex >= newReviews.length
    ) {
      return;
    }

    const temp = newReviews[index];

    newReviews[index] = newReviews[newIndex];
    newReviews[newIndex] = temp;

    // Update screen immediately
    setReviews(newReviews);

    // Get IDs in their new order
    const reviewIds = newReviews.map(
      (review) => review._id
    );

    try {
      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews/reorder`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            reviewIds,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Error saving review order:",
          data.message
        );

        // Reload original order if saving fails
        fetchReviews();
      }
    } catch (error) {
      console.error(
        "Error saving review order:",
        error
      );

      fetchReviews();
    }
  };

  // DISPLAY STARS

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

  if (loading) {
    return (
      <div className="admin-reviews-page">

        <button
          className="back-dashboard"
          onClick={() => navigate("/admin")}
        >
          ← Back to Dashboard
        </button>

        <h1>Reviews</h1>

        <p>Loading reviews...</p>

      </div>
    );
  }

  return (
    <div className="admin-reviews-page">

      {/* BACK TO DASHBOARD */}

      <button
        className="back-dashboard"
        onClick={() => navigate("/admin")}
      >
        ← Back to Dashboard
      </button>

      {/* HEADER */}

      <div className="admin-reviews-header">

        <p>ADMIN PANEL</p>

        <h1>REVIEWS</h1>

        <span>
          Manage and arrange customer reviews.
        </span>

      </div>

      {/* REVIEWS */}

      {reviews.length === 0 ? (

        <div className="no-admin-reviews">

          <h2>No Reviews Yet</h2>

          <p>
            Customer reviews will appear here.
          </p>

        </div>

      ) : (

        <div className="admin-reviews-list">

          {reviews.map((review, index) => (

            <div
              className="admin-review-card"
              key={review._id}
            >

              <div className="admin-review-number">
                #{index + 1}
              </div>

              <div className="admin-review-content">

                <div className="admin-review-top">

                  <h3>
                    {review.customerName}
                  </h3>

                  <div className="admin-review-stars">

                    {getStars(review.rating)}

                    <span>
                      ({review.rating}/5)
                    </span>

                  </div>

                </div>

                <p className="admin-review-comment">
                  "{review.comment}"
                </p>

              </div>

              {/* ACTIONS */}

              <div className="admin-review-actions">

                <button
                  onClick={() =>
                    moveReview(index, -1)
                  }
                  disabled={index === 0}
                  title="Move Up"
                >
                  ↑
                </button>

                <button
                  onClick={() =>
                    moveReview(index, 1)
                  }
                  disabled={
                    index === reviews.length - 1
                  }
                  title="Move Down"
                >
                  ↓
                </button>

                <button
                  className="delete-review"
                  onClick={() =>
                    setReviewToDelete(review)
                  }
                  title="Delete Review"
                >
                  DELETE
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* DELETE CONFIRMATION */}

      {reviewToDelete && (

        <div className="review-delete-overlay">

          <div className="review-delete-box">

            <h2>
              Delete Review?
            </h2>

            <p>
              Are you sure you want to delete
              this review?
            </p>

            <span>
              This action cannot be undone.
            </span>

            <div className="review-delete-buttons">

              <button
                className="cancel-delete"
                onClick={() =>
                  setReviewToDelete(null)
                }
              >
                Cancel
              </button>

              <button
                className="confirm-delete"
                onClick={deleteReview}
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminReviews;