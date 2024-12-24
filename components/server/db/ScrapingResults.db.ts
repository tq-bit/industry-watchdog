import { PersistentObject } from "../../core/PersistentObject.ts";

export type TScrapingResult = {
    id: string;
    sourceId: string;
    content: string;
}

const ScrapingResults = new PersistentObject<TScrapingResult>("scrapingresult");

export default ScrapingResults;