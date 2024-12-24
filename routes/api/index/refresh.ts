import { FreshContext, Handlers } from "$fresh/server.ts";
import * as BrowserController from "../../../components/server/browser/browser.controller.ts";
import IndustryIndex from "../../../components/core/IndustryIndex.ts";
import Scores from "../../../components/server/db/Scores.db.ts";
import ScrapingResults from "../../../components/server/db/ScrapingResults.db.ts";
import IndiciesDb from "../../../components/server/db/Indicies.db.ts";
import SourcesDb from "../../../components/server/db/Sources.db.ts";
import AppOpenAi from "../../../components/server/ai/AppOpenAI.ts";
import AiResponsesDb from "../../../components/server/db/AiResponses.db.ts";

export const handler: Handlers = {
  async GET(_req: Request, _ctx: FreshContext): Promise<Response> {
    const scrapeResults = await BrowserController.scrapeSources();
    await BrowserController.createScrapingResults(scrapeResults);

    // Algorithms stuff
    const index = new IndustryIndex(ScrapingResults.read(), Scores.read());
    const industryIndex = index.calculateIndicies();
    const indexEntry = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      ...industryIndex,
    };
    await IndiciesDb.create(indexEntry);

    // AI Stuff
    const openAi = new AppOpenAi(ScrapingResults.read(), Scores.read());
    const response = await openAi.createResponse();
    await AiResponsesDb.create({
      ...JSON.parse(response.choices[0].message.content as string),
      createdAt: new Date(),
    });

    return new Response(JSON.stringify(
      {
        message: scrapeResults.length === SourcesDb.read().length
          ? {
            status: "success",
            text: "Scraping completed for all sources",
          }
          : {
            status: "error",
            text:
              `Scraping completed for ${scrapeResults.length} out of ${SourcesDb.read().length} sources`,
          },
      },
    ));
  },
};
