import { Link } from "react-router-dom";
import "./ReviewInvite.css";

function ReviewInvite() {
  return (
    <section className="review-invite">

      <p className="review-invite-label">
        LOVED THE VIBE?
      </p>

      <h2>
        See what our clients say.
      </h2>

      <Link to="/reviews" className="review-invite-btn">
        ★ READ CLIENTS REVIEWS
      </Link>

    </section>
  );
}

export default ReviewInvite;