import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing");
}

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const idea = "Post about consistency beating talent in tech";

async function run() {
  const linkedin = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "Write LinkedIn posts for tech professionals. Clear, practical, motivating.",
      },
      { role: "user", content: idea },
    ],
  });

  const twitter = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "Write a Twitter post under 280 characters. Crisp and impactful.",
      },
      { role: "user", content: idea },
    ],
  });

  const content = {
    idea,
    linkedin: linkedin.choices[0].message.content,
    twitter: twitter.choices[0].message.content,
    createdAt: new Date().toISOString(),
  };

  fs.writeFileSync("content/scheduled.json", JSON.stringify(content, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
