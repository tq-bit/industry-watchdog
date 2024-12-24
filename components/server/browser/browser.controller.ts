import AppBrowser from "../../core/AppBrowser.ts";
import Sources, { TSource } from "../db/Sources.db.ts";
import ScrapingResults, { TScrapingResult } from "../db/ScrapingResults.db.ts";

export const scrapeSources = async (): Promise<TScrapingResult[]>=> {
	const sources = Sources.read();
  const browser = new AppBrowser();
  const resultPromises = sources.map(async (source: TSource) => {
    const rawContent = await browser.getSelectorContent(
      source.url,
      source.selector,
    ) as string;

		const content = browser.tidyText(rawContent)
    return {
      id: crypto.randomUUID(),
      sourceId: source.id,
      content
    };
  });

	const results = await Promise.allSettled(resultPromises).then((promises) =>
    promises.flatMap((promise) => {
      if (promise.status === "fulfilled") {
        return [promise.value];
      } else {
        console.error(`Error scraping source ${promise.reason.sourceId}: ${promise.reason}`);
        return [];
      }
    })
  );
	return results;
};

export const createScrapingResults = async (scrapingResults: TScrapingResult[]) => {
  await ScrapingResults.deleteMany()
	await ScrapingResults.createMany(scrapingResults);
}
