import puppeteer from "npm:puppeteer-core";
import { removeStopwords } from "npm:stopword";

const BROWSER_WS = Deno.env.get('BROWSER_WS');

export default class Scraper {
  public async getSelectorContent(url: string, selector: string) {
    let browser = null;
    let page = null;

    try {
      browser = await puppeteer.connect({
        browserWSEndpoint: BROWSER_WS,
      });
      console.log(`${url}: Connected to browser. Navigating to page`);
      page = await browser.newPage();
      await page.goto(url, {waitUntil: 'domcontentloaded', timeout: 0});

      // wait until selector is available
      console.log(`${url}: Waiting for selector ${selector}`);
      await page.waitForSelector(selector);

      console.log(`${url}: Querying ${selector}`);
      const element = await page.$(selector);

      const content = await page.evaluate((el) => el?.textContent, element);

      console.log(`${url}: Success!`);

      return content;
    } catch (error) {
      console.log(`${url}: Error: ${error}`);
    } finally {
      await page?.close();
      await browser?.disconnect();
    }
  }

  public tidyText(text: string) {
    const words = text.replace(/\s+/g, " ").trim().split(" ");
    const withoutStopwords: string[] = removeStopwords(words);
    const withoutEmojy = withoutStopwords.filter((word) => {
      return !/[^\x00-\x7F]+/g.test(word);
    });
    const withoutNumbers = withoutEmojy.filter((word) => !/^\d+$/.test(word));
    const withoutDuplicates = Array.from(new Set(withoutNumbers));
    const filteredWords = withoutDuplicates.filter((word) => word.length > 0);

    return filteredWords.join(" ");
  }
}
