import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const idea = "Post about consistency beating talent in tech";

async function run() {
  const linkedin = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Write LinkedIn posts for tech professionals.",
      },
      { role: "user", content: idea },
    ],
  });

  const twitter = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Write a Twitter post under 280 characters." },
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

run();
