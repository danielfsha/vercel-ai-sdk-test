<!-- install all the packages -->

```bash
npm install -D ai @ai-sdk/google dotenv nodemon ts-node typescript zod
```

<!-- create a .env file and add GOOGLE_GENERATIVE_AI_API_KEY -->

dont forget to add the .env file to .gitignore

```ts
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error("GOOGLE_GEMINI_API not set");
}

async function main() {
  const result = await generateText({
    model: google("models/gemini-2.0-flash-exp"),
    prompt: "What is the meaning of life?",
  });

  console.log(result.text);
}

main();
```

<!-- To stream text in real time -->

```ts
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

const GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error("GOOGLE_GEMINI_API not set");
}

async function main() {
  const result = await streamText({
    model: google("models/gemini-2.0-flash-exp"),
    prompt: "What is the meaning of life?",
  });

  for await (const text of result.textStream) {
    console.log(text);
  }
}

main();
```

<!-- generate a structured object output this time we will use zod -->

```ts
import {google } from "@ai-sdk/google";
import {generateObject} from 'ai'
import z from "zod";


async function main() {
  const result await generateObject({
    model: google("models/gemini-2.0-flash-exp"),
    prompt: "tell me a joke",
    schema: z.object({
      setup: z.string(),
      punchline: z.string(),
      whyIsItFunny: z.string(),
    })
  })


  console.log(result)
}

```

<!-- you strema object in real time using partialObjectStream -->

```ts
import {google } from "@ai-sdk/google";
import {streamObject} from 'ai'
import z from "zod";

async function main() {
  const result await streamObject({
    model: google("models/gemini-2.0-flash-exp"),
    prompt: "tell me a joke",
    schema: z.object({
      setup: z.string(),
      punchline: z.string(),
      whyIsItFunny: z.string(),
    })
  })

  for await (const text of result.partialObjectStream) {
    console.log(text)
  }
}


main()
```

<!-- stream joke with -->

```ts
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
```
