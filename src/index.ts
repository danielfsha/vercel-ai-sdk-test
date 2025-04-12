import dotenv from "dotenv";
dotenv.config();

const GOOGLE_GEMINI_API = process.env.GOOGLE_GEMINI_API;
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

if (!GOOGLE_GEMINI_API) {
  throw new Error("GOOGLE_GEMINI_API not set");
}

if (!FIRECRAWL_API_KEY) {
  throw new Error("FIRECRAWL_API_KEY not set");
}

console.log(GOOGLE_GEMINI_API);
console.log(FIRECRAWL_API_KEY);
