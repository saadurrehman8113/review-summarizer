import { conversationRepository } from "../repositories/conversation.repository";
import instructions from "../prompts/chatbot.txt";
import { llmClient } from "../llm/client";

type messageResponse = {
  id: string;
  message: string;
};

export const conversationService = {
  sendMessage: async (
    message: string,
    conversationId: string
  ): Promise<messageResponse> => {
    const response = await llmClient.generateText({
      model: process.env.LLM_MODEL as string,
      instructions,
      prompt: message,
      temperature: Number(process.env.LLM_TEMPERATURE),
      maxOutputTokens: Number(process.env.LLM_MAX_OUTPUT_TOKENS),
    });

    conversationRepository.setLastResponseId(conversationId, response.id);

    return {
      id: response.id,
      message: response.message,
    };
  },
};
