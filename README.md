# AI Content Generator

Generate AI-powered content for multiple social media platforms using OpenAI's GPT-4.

## Features

- Generates LinkedIn posts for tech professionals
- Creates Twitter posts (under 280 characters)
- Uses OpenAI's GPT-4o-mini model
- Stores generated content with metadata

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=sk-...
   IDEA=Your content idea here
   ```

## Usage

Run the content generator:

```bash
npm start
```

The generated content will be saved to `content/scheduled.json` with the following structure:

```json
{
  "idea": "Your content idea",
  "linkedin": "Generated LinkedIn post",
  "twitter": "Generated Twitter post",
  "createdAt": "2025-12-21T12:00:00.000Z"
}
```

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `IDEA` - The content idea to generate posts about (optional, defaults to "Post about consistency beating talent in tech")

## Requirements

- Node.js 16+
- OpenAI API key
