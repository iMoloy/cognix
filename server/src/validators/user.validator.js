import {
  ACCOUNT_STATUS,
  SUBSCRIPTION_STATUS,
  USER_ROLES,
} from "../constants/account.constants.js";
import {
  hasLengthBetween,
  isNonEmptyString,
  isOneOf,
  isValidEmail,
  isValidUrl,
  toValidationResult,
} from "./shared.validators.js";

export const validateUser = (payload) => {
  const errors = [];
  const allowedRoles = Object.values(USER_ROLES);
  const allowedSubscriptions = Object.values(SUBSCRIPTION_STATUS);
  const allowedStatuses = Object.values(ACCOUNT_STATUS);

  if (!hasLengthBetween(payload.name, 2, 80)) {
    errors.push("Name must be between 2 and 80 characters.");
  }

  if (!isValidEmail(payload.email)) {
    errors.push("A valid email is required.");
  }

  if (payload.photoURL && !isValidUrl(payload.photoURL)) {
    errors.push("Photo URL must be a valid URL.");
  }

  if (!isOneOf(payload.role || USER_ROLES.USER, allowedRoles)) {
    errors.push("Role must be user, creator, or admin.");
  }

  if (!isOneOf(payload.subscription || SUBSCRIPTION_STATUS.FREE, allowedSubscriptions)) {
    errors.push("Subscription must be free or premium.");
  }

  if (!isOneOf(payload.status || ACCOUNT_STATUS.ACTIVE, allowedStatuses)) {
    errors.push("Account status must be active or blocked.");
  }

  return toValidationResult(errors);
};

export const createUserDocument = (payload) => ({
  name: payload.name.trim(),
  email: payload.email.trim().toLowerCase(),
  photoURL: payload.photoURL?.trim() || "",
  role: payload.role || USER_ROLES.USER,
  subscription: payload.subscription || SUBSCRIPTION_STATUS.FREE,
  status: payload.status || ACCOUNT_STATUS.ACTIVE,
  bookmarks: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const validateLoginPayload = (payload) => {
  const errors = [];

  if (!isValidEmail(payload.email)) {
    errors.push("A valid email is required.");
  }

  if (!isNonEmptyString(payload.password)) {
    errors.push("Password is required.");
  }

  return toValidationResult(errors);
};

