import express from "express";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.post("/api/generate", async (req, res) => {
  try {
    const { idea } = req.body;

    if (!idea || idea.trim() === "") {
      return res.status(400).json({ error: "Idea is required" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY is not configured" });
    }

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

    // Save to file
    fs.writeFileSync(
      path.join(__dirname, "content/scheduled.json"),
      JSON.stringify(content, null, 2)
    );

    res.json(content);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
