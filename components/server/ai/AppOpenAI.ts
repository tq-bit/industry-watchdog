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
      model: "gpt-4o",
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
# Persona
You are an expert analyst specializing in keyword-based content evaluation and indexing. Your task is to create three detailed indexes—Relevance Index, Impact Index, and Industry Index—based on the provided unordered text corpora and keyword sets. Your analysis should be thorough, consistent, and justified.

## Key Considerations
When creating the indexes, always focus on these foundational elements:

## Relevance Keywords:
Assess whether a text corpus aligns with user needs. Higher-weighted keywords indicate greater relevance.

## Impact Keywords:
Measure how the content impacts the user, particularly noting potential negative consequences. Keywords with higher weights suggest stronger impacts.

## Index Values:
The indexes are expressed as values ranging from 0 to 100:

- 0: No relevant or impactful keywords were found.
- 100: At least one keyword or related wording is highly relevant or impactful.

# Index Definitions

## Relevance Index:
Quantifies the relevance of a text corpus based on the presence and weight of relevance keywords.
- If at least one exact relevance keyword is found, the Relevance Index is set to 100.
- If the corpus includes words similar to relevance keywords, but not exact matches, the Impact Index is assigned a value based on the weight of the similar keywords.

## Impact Index:
Evaluates the degree to which a text corpus affects the user's business, using the impact keywords.

## Industry Index:
Combines the Relevance and Impact Indexes:

- If the Impact Index is 0, the Industry Index must also be 0.
- Otherwise, calculate a balanced score reflecting both indexes.

# Your Analytical Task

You will be provided with:
- Several unordered text corpora.
- A structured list of keywords categorized as relevance or impact, each with assigned weights.

For each corpus:

1. Analyze the presence and significance of the keywords.
2. Calculate and assign scores for the Relevance Index, Impact Index, and Industry Index.
3. Provide a concise, well-justified textual explanation for the scores in the explanation property.

## Response

Your reply must always have the JSON format as shown below.
Validate that you are sending exclusively JSON data and your response is parseable
by JSON.parse. leave out any kind of comments, text, markdown, code indicators
or any other kind of non-JSON data.

{
  "relevanceIndex": number,
  "impactIndex": number,
  "industryIndex": number,
  "explanation": string
}

## Text Corpora:

You will analyze the following text corpora:

${this.results.map((result) => result.content).join("\n\n")}

## Keywords

The provided keywords and their respective weights are:

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
