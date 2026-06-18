import {
  AI_TOOLS,
  PROMPT_CATEGORIES,
  PROMPT_DIFFICULTY,
  PROMPT_STATUS,
  PROMPT_VISIBILITY,
} from "../constants/prompt.constants.js";
import {
  hasLengthBetween,
  isOneOf,
  isValidEmail,
  isValidUrl,
  toValidationResult,
} from "./shared.validators.js";

export const validatePrompt = (payload) => {
  const errors = [];

  if (!hasLengthBetween(payload.title, 5, 120)) {
    errors.push("Prompt title must be between 5 and 120 characters.");
  }

  if (!hasLengthBetween(payload.description, 20, 800)) {
    errors.push("Prompt description must be between 20 and 800 characters.");
  }

  if (!hasLengthBetween(payload.content, 20, 5000)) {
    errors.push("Prompt content must be between 20 and 5000 characters.");
  }

  if (!isOneOf(payload.category, PROMPT_CATEGORIES)) {
    errors.push("Category is not supported.");
  }

  if (!isOneOf(payload.aiTool, AI_TOOLS)) {
    errors.push("AI tool is not supported.");
  }

  if (!isOneOf(payload.difficulty, Object.values(PROMPT_DIFFICULTY))) {
    errors.push("Difficulty must be Beginner, Intermediate, or Pro.");
  }

  if (!isOneOf(payload.visibility, Object.values(PROMPT_VISIBILITY))) {
    errors.push("Visibility must be public or private.");
  }

  if (!Array.isArray(payload.tags) || payload.tags.length === 0) {
    errors.push("At least one tag is required.");
  }

  if (Array.isArray(payload.tags) && payload.tags.some((tag) => !hasLengthBetween(tag, 2, 30))) {
    errors.push("Each tag must be between 2 and 30 characters.");
  }

  if (payload.thumbnailImage && !isValidUrl(payload.thumbnailImage)) {
    errors.push("Thumbnail image must be a valid URL.");
  }

  if (!isValidEmail(payload.creatorEmail)) {
    errors.push("Creator email is required.");
  }

  return toValidationResult(errors);
};

export const createPromptDocument = (payload) => ({
  title: payload.title.trim(),
  description: payload.description.trim(),
  content: payload.content.trim(),
  category: payload.category,
  aiTool: payload.aiTool,
  tags: payload.tags.map((tag) => tag.trim().toLowerCase()),
  difficulty: payload.difficulty,
  usageInstructions: payload.usageInstructions?.trim() || "",
  thumbnailImage: payload.thumbnailImage?.trim() || "",
  visibility: payload.visibility,
  status: PROMPT_STATUS.PENDING,
  rejectionFeedback: "",
  isFeatured: false,
  copyCount: 0,
  bookmarkCount: 0,
  averageRating: 0,
  reviewCount: 0,
  creatorName: payload.creatorName?.trim() || "",
  creatorEmail: payload.creatorEmail.trim().toLowerCase(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

