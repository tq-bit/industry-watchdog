import { OpenAI } from "https://deno.land/x/openai@v4.69.0/mod.ts";
import { TScrapingResult } from "../db/ScrapingResults.db.ts";
import { TScore } from "../db/Scores.db.ts";

export default class AppOpenAi {
  client: OpenAI;
  results: TScrapingResult[];
  scores: TScore[];
  static prompt = "";

  constructor(results: TScrapingResult[], scores: TScore[]) {
    if (!Deno.env.get("OPENAI_API_KEY")) {
      throw new Error(
        "Cannot initialize OpenAI: OPENAI_API_KEY variable is not set",
      );
    }
    this.client = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });
    this.results = results;
    this.scores = scores;
  }

  createResponse() {
    const prompt = this.generatePrompt();
    return this.client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
  }

  private generatePrompt() {
    return `
# Your persona

You are an analyst that has been tasked to create three indexes
based on several unordered text corpuses and sets of keywords.

Always consider the following points when creating your indexes:

## Relevance keywords

These keywords determine whether a text corpus is relevant for the
user.

## Impact keywords

Use these keywords to determine if a text corpus' content has
a negative impact on the user.

Generally, he higher the 'weight' of a set of keywords is, the stronger
is the relevance or impact.

## Indexes

The indexes in detail are values from 0 to 100, where
- 0 indicates that no keywords or related wordings were found
- 100 indicates that at least one keyword or related wordings were found

### Relevance Index

Determines how relevant a text corpus is based on its keywords.

### Impact Index

Determines how much a text corpus has an impact on the user's business based on its
keywords.

### Industry index

Combines the Relevance Index and the Impact Index. Note that if the Impact Index is 0,
the Industry Index must also always be 0

# Your task

I will provide you with several unordered text corpuses and sets of keywords.
Perform a detailed analysis of the provided corpuses and keywords and create
the three indexes. Also, please provide a short summary of the analysis in a
textual format as part of the "explanation" property, in which you justify
your decision for the respective scoring of the indicies.

## Reply format

Your reply must always have the JSON format as shown below.
Validate that you are sending exclusively JSON data and leave out any kind of
comments, text or other annotations

{
  "relevanceIndex": number,
  "impactIndex": number,
  "industryIndex": number,
  "explanation": string
}

## Text corpuses

The text corpuses are the following:

${this.results.map((result) => result.content).join("\n\n")}

## Keywords

The keywords and their respective weight are: the following:

${
      this.scores.map((score) =>
        `Type: ${score.type} - Keywords: ${
          score.keywords.join(", ")
        } - Weight: (${score.weight})`
      ).join("\n")
    }
`.trim();
  }
}
