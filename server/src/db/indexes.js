import { COLLECTIONS } from "../constants/db.constants.js";

export const createDatabaseIndexes = async (database) => {
  await Promise.all([
    database.collection(COLLECTIONS.USERS).createIndexes([
      { key: { email: 1 }, unique: true, name: "unique_user_email" },
      { key: { role: 1 }, name: "user_role_lookup" },
    ]),
    database.collection(COLLECTIONS.PROMPTS).createIndexes([
      { key: { title: "text", tags: "text", aiTool: "text" }, name: "prompt_search_text" },
      { key: { status: 1, visibility: 1, createdAt: -1 }, name: "marketplace_prompt_listing" },
      { key: { creatorEmail: 1, createdAt: -1 }, name: "creator_prompt_history" },
      { key: { copyCount: -1 }, name: "popular_prompt_copies" },
    ]),
    database.collection(COLLECTIONS.REVIEWS).createIndexes([
      { key: { promptId: 1, reviewerEmail: 1 }, unique: true, name: "unique_prompt_reviewer" },
      { key: { promptId: 1, createdAt: -1 }, name: "prompt_review_history" },
    ]),
    database.collection(COLLECTIONS.PAYMENTS).createIndexes([
      { key: { transactionId: 1 }, unique: true, name: "unique_transaction" },
      { key: { email: 1, createdAt: -1 }, name: "user_payment_history" },
    ]),
    database.collection(COLLECTIONS.REPORTS).createIndexes([
      { key: { promptId: 1, reporterEmail: 1 }, name: "prompt_report_lookup" },
      { key: { status: 1, createdAt: -1 }, name: "report_moderation_queue" },
    ]),
  ]);
};
