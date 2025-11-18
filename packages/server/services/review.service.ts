import { llmClient } from "../llm/client";
import { reviewRepository } from "../repositories/review.repository";
import template from "../prompts/summarize-review.txt";

export const reviewService = {
  getReviews: async (productId: number, limit: number = 10) =>
    reviewRepository.getReviews(productId, limit),

  getReviewSummary: async (productId: number): Promise<string> => {
    const summary = await reviewRepository.getReviewSummary(productId);

    if (summary && summary.expiresAt > new Date()) {
      return summary.content;
    }

    const reviews = await reviewRepository.getReviews(productId, 10);

    const joinedReviews = reviews.map((review) => review.content).join("\n\n");

    const prompt = template.replace("{{reviews}}", joinedReviews);

    const { message } = await llmClient.generateText({
      model: process.env.LLM_MODEL as string,
      prompt,
      temperature: Number(process.env.LLM_TEMPERATURE),
      maxOutputTokens: Number(process.env.LLM_MAX_OUTPUT_TOKENS),
    });

    await reviewRepository.storeReviewSummary(productId, message);

    return message;
  },
};
