import { FreshContext, Handlers } from "$fresh/server.ts";
import * as BrowserController from "../../../components/server/browser/browser.controller.ts";
import IndustryIndex from "../../../components/core/IndustryIndex.ts";
import Scores from "../../../components/server/db/Scores.db.ts";
import ScrapingResults from "../../../components/server/db/ScrapingResults.db.ts";
import IndiciesDb from "../../../components/server/db/Indicies.db.ts";
import SourcesDb from "../../../components/server/db/Sources.db.ts";

export const handler: Handlers = {
  async GET(_req: Request, _ctx: FreshContext): Promise<Response> {
    const scrapeResults = await BrowserController.scrapeSources();
    await BrowserController.createScrapingResults(scrapeResults);
    const index = new IndustryIndex(ScrapingResults.read(), Scores.read());
    const industryIndex = index.calculateIndicies();
    const indexEntry = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      ...industryIndex,
    };
    await IndiciesDb.create(indexEntry);
    return new Response(JSON.stringify(
      {message: scrapeResults.length === SourcesDb.read().length
        ? {
          status: "success",
          text: "Scraping completed for all sources",
        }
        : {
          status: "error",
          text:
            `Scraping completed for ${scrapeResults.length} out of ${SourcesDb.read().length} sources`,
        },}
    ));
  },
};
