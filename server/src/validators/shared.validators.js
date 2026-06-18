import { ObjectId } from "mongodb";

export const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

export const isValidEmail = (value) =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim().toLowerCase());

export const isValidUrl = (value) => {
  if (!value) {
    return true;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const isValidObjectId = (value) => ObjectId.isValid(value);

export const isOneOf = (value, allowedValues) => allowedValues.includes(value);

export const hasLengthBetween = (value, min, max) =>
  typeof value === "string" && value.trim().length >= min && value.trim().length <= max;

export const toValidationResult = (errors) => ({
  valid: errors.length === 0,
  errors,
});

