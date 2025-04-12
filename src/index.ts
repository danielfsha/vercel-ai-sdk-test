import dotenv from "dotenv";
dotenv.config();

const GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

import { generateObject, generateText, streamObject, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

if (!GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error("GOOGLE_GEMINI_API not set");
}

async function main() {
  const location = "ethiopia, Addis Ababa";

  const result = await generateText({
    model: google("models/gemini-2.0-flash-exp"),
    prompt: `What is the temprature in ${location}?`,
    tools: {
      weather: {
        description:
          "Get the weather data for a specified location asked by the user.",
        parameters: z.object({
          location: z.string(),
        }),
        execute: async ({ location }) => {
          const temprature = Math.floor(Math.random() * 100);
          return {
            temprature,
          };
        },
      },
    },
  });

  if (result.toolResults && result.toolCalls) {
    const joke = await generateObject({
      model: google("models/gemini-2.0-flash-exp"),
      prompt:
        "tell me a joke that incorporates the weather in " +
        location +
        "and its current temprature is " +
        result.toolResults[0].result.temprature,
      schema: z.object({
        setup: z.string(),
        punchline: z.string(),
        whyIsItFunny: z.string(),
      }),
    });

    console.log(joke.object);
  }
}

main();
