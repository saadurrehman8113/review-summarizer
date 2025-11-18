import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.LLM_API_KEY,
});

type llmInputOptions = {
  model?: string;
  instructions?: string;
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
};

type llmOutput = {
  id: string;
  message: string;
};

export const llmClient = {
  generateText: async ({
    model = "llama-3.1-8b-instant",
    instructions = "",
    prompt,
    temperature = 0.2,
    maxOutputTokens = 100,
  }: llmInputOptions): Promise<llmOutput> => {
    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: instructions,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature,
      max_tokens: maxOutputTokens,
    });

    return {
      id: response.id,
      message: response.choices?.[0]?.message?.content ?? "",
    };
  },
};
