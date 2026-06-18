import {
  hasLengthBetween,
  isValidEmail,
  isValidObjectId,
  toValidationResult,
} from "./shared.validators.js";

export const validateReview = (payload) => {
  const errors = [];

  if (!isValidObjectId(payload.promptId)) {
    errors.push("A valid prompt ID is required.");
  }

  if (!isValidEmail(payload.reviewerEmail)) {
    errors.push("Reviewer email is required.");
  }

  if (!Number.isInteger(payload.rating) || payload.rating < 1 || payload.rating > 5) {
    errors.push("Rating must be an integer between 1 and 5.");
  }

  if (!hasLengthBetween(payload.comment, 5, 600)) {
    errors.push("Comment must be between 5 and 600 characters.");
  }

  return toValidationResult(errors);
};

export const createReviewDocument = (payload) => ({
  promptId: payload.promptId,
  reviewerName: payload.reviewerName?.trim() || "",
  reviewerEmail: payload.reviewerEmail.trim().toLowerCase(),
  rating: payload.rating,
  comment: payload.comment.trim(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

