import React, { useState } from "react";

function FeedbackPage() {
  const [feedback, setFeedback] = useState({
    rating: 1,
    comment: "",
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
  };

  return (
    <div className="feedback-container">
      <h1 className="feedback-title">Feedback</h1>
      {feedbackSubmitted ? (
        <div className="feedback-confirmation">
          <h2>Thank you for your feedback!</h2>
          <p>Your feedback: {feedback.comment}</p>
          <p>Rating: {feedback.rating}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label htmlFor="rating">Rating:</label>
            <select
              id="rating"
              name="rating"
              value={feedback.rating}
              onChange={handleChange}
              required
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="comment">Comment:</label>
            <textarea
              id="comment"
              name="comment"
              value={feedback.comment}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
}

export default FeedbackPage;
