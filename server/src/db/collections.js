import { getDatabase } from "./client.js";
import { COLLECTIONS } from "../constants/db.constants.js";

export { COLLECTIONS };

export const usersCollection = () => getDatabase().collection(COLLECTIONS.USERS);

export const promptsCollection = () => getDatabase().collection(COLLECTIONS.PROMPTS);

export const reviewsCollection = () => getDatabase().collection(COLLECTIONS.REVIEWS);

export const paymentsCollection = () => getDatabase().collection(COLLECTIONS.PAYMENTS);

export const reportsCollection = () => getDatabase().collection(COLLECTIONS.REPORTS);
